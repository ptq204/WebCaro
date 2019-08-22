var roomList = [];
const userService = require('../service/UserService');
const secret="pGctNMl4LL4bEQSwCdIzdg";
const jwt = require('jsonwebtoken');

const gameLogic = function(io){
    let roomId = "";
    let userID = "";
    io.use(function(socket, next){
        if (socket.handshake.query && socket.handshake.query.token){
          jwt.verify(socket.handshake.query.token, secret, function(err, decoded) {
            if(err) return next(new Error('Authentication error'));
            socket.decoded = decoded;
            next();
          });
        } else {
            next(new Error('Authentication error'));
        }    
    })
    .on('connection', (socket) => {
        console.log('New user connected');
        socket.join('global');
        console.log(socket.decoded);
        socket.on('create-room', (data) => {
            socket.join(data.user);
            roomId = data.user;
            userId = data.user;
            let newRoom ={
                userList: [data.user],
                currTurn: 0,
                status : 0,
                replay: 0,
                start_ack: 0
            };
            roomList[data.user] = newRoom;
            socket.to('global').emit('new-room', {
                id: data.user,
                detail: newRoom
            });
        });
        socket.on('join', (data) => {
            roomId = data.roomId;
            userId = data.user;
            socket.join(roomId);

            console.log(`${data.user} has joined room ${data.roomId}`);

            roomList[roomId].userList.push(data.user);
            roomList[roomId].status = 1;

            io.in(roomId).emit('start-game', {});
            socket.to('global').emit('room-status-change', {
                id: roomId
            });
        }); 
    
        socket.on('game-ack', () => {
            roomList[roomId].start_ack++;
            if (roomList[roomId].start_ack === 2){
                roomList[roomId].status = 2;
                roomList[roomId].currTurn = Math.floor((Math.random() * 2));
                let currUser = roomList[roomId].userList[roomList[roomId].currTurn % 2];
                io.in(roomId).emit('turn', {user: currUser, currTurn: roomList[roomId].currTurn});
                roomList[roomId].currTurn++;
                io.in(roomId).emit('start-playing', {});
            }
        });

        socket.on('play', (data) => {
            let currUser = roomList[roomId].userList[roomList[roomId].currTurn % 2];
            let msgBody = {
                user: currUser,
                currTurn: roomList[roomId].currTurn
            };

            if (data.gameEnd === 1){
                msgBody.gameEnd = 1;
                let winner = roomList[roomId].userList[(roomList[roomId].currTurn + 1) % 2];
                userService.updateRank(winner,currUser);
            } else {
                msgBody.gameEnd = 0;
                msgBody.updatedBoard = data.updatedBoard;
            }

            io.in(roomId).emit('turn', msgBody);
            roomList[roomId].currTurn++;
        });

        socket.on('replay', (data) => {
            if (roomList[roomId].replay === 1){
                roomList[roomId].replay = 0;
                io.in(roomId).emit('start-game', {});
            } else {
                roomList[roomId].replay = 1;
            }
        });

        socket.on('chat', (data) => {
            socket.to(roomId).emit('chat', data.msg);
        });

        socket.on(('disconnect'), (reason) => {
            // socket.leave(roomId);
            // let userList = roomList[roomId].userList;
            // if (roomList[roomId].status === 0){
            //     io.in('global').emit('room-close', {
            //         id: roomId
            //     });
            //     delete roomList[roomId];
            // } else {
            //     if (roomList[roomId].status === 2){
            //         let winner = (userList.indexOf(userID) + 1) % 2;
            //         userService.updateRank(userList[winner], userID);
            //     }
            //     let index = userList.indexOf(userID);
            //     userList.slice(index,1);
            //     roomList[roomId].status = 0;
            //     roomList[roomId].replay = 0;
            //     roomList[roomId].start_ack = 0;
            //     socket.to(roomId).emit('other-disconnect',{});
            // }
            // roomId=""; 
            console.log("Disconnenct because " + reason); 
        });
    });

};
module.exports = gameLogic;