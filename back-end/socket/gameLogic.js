var roomList = [];
const userService = require('../service/UserService');

const gameLogic = function(io){
    

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
                    status: 0,
                    replay: 0,
                };
            }
            else {
                roomList[roomId].userList.push(data.user);
                roomList[roomId].status = 1;
                io.in(roomId).emit('start-game', {});
                console.log(roomList);
                roomList[roomId].currTurn = Math.floor((Math.random() * 2));
                let currUser = roomList[roomId].userList[roomList[roomId].currTurn % 2];
                io.in(roomId).emit('turn', {user: currUser, currTurn: roomList[roomId].currTurn});
                roomList[roomId].currTurn++;
            }
        }); 
    
        socket.on('play', (data) => {
            let roomId = data.roomId;
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
            let roomId = data.roomId;
            if (roomList[roomId].replay === 1){
                roomList[roomId].replay = 0;
                roomList[roomId].currTurn = Math.floor((Math.random() * 2));
                let currUser = roomList[roomId].userList[roomList[roomId].currTurn % 2];
                io.in(roomId).emit('turn', {user: currUser, currTurn: roomList[roomId].currTurn});
                roomList[roomId].currTurn++;
            } else {
                roomList[roomId].replay = 1;
            }
        });
    });

};
module.exports = gameLogic;