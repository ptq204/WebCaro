const express = require('express');
const mongoose = require('mongoose');
const { DATABASE_LINK } = require('./constants/constants');

mongoose.connect(DATABASE_LINK);
mongoose.connection.once('open', () => {
    console.log('Connected to database');
});

const app = express();
var roomList = [];

app.get('', (req, res) => {
    res.send('Welcome');
});

const server = app.listen(4000);

const io = require('socket.io')(server);

[
    {
        roomId: {
            userList: ['user1', 'user2'],
            currTurn: 12,
            status: 0
        }
    }
]

io.on('connection', (socket) => {
    console.log('New user connected');

    socket.on('join', (data) => {
        let roomId = data.roomId;
        socket.join(roomId);
        console.log(`${data.user} has joined room ${data.roomId}`);
        if(!roomList[roomId]) {
            roomList[roomId] = {
                userList: [data.user],
                currTurn: 0,
                status: 0
            }
        }
        else {
            roomList[roomId].userList.push(data.user);
            roomList[roomId].status = 1;
            io.in(roomId).emit('start-game', {});
            console.log(roomList);
            let currUser = roomList[roomId].userList[roomList[roomId].currTurn % 2];
            io.in(roomId).emit('turn', {user: currUser, currTurn: roomList[roomId].currTurn});
            roomList[roomId].currTurn++;
        }
    });

    socket.on('play', (data) => {
        let roomId = data.roomId;
        let currUser = roomList[roomId].userList[roomList[roomId].currTurn % 2];
        io.in(roomId).emit('turn', {user: currUser, currTurn: roomList[roomId].currTurn, updatedBoard: data.updatedBoard});
        roomList[roomId].currTurn++;
    });
});
