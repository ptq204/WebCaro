var roomList = [];
const userService = require('../service/UserService');
const secret="pGctNMl4LL4bEQSwCdIzdg";

const getCurrentDate = () => {
    let today = new Date();
    let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    return date+' '+time;
};

const gameLogic = function(io){
    let roomId = "";

    const leaveRoom = () => {
        socket.leave(roomId);
        let userList = roomList[roomId].userList;
        if (roomList[roomId].status === 0){
            io.in('global').emit('room-close', {
                id: roomId
            });
            delete roomList[roomId];
        } else {
            if (roomList[roomId].status === 2){
                let winner = (userList.indexOf(socket.id) + 1) % 2;
                userService.updateRank(userList[winner], socket.id);
            }
            let index = userList.indexOf(socket.id);
            userList.slice(index,1);
            roomList[roomId].status = 0;
            roomList[roomId].replay = 0;
            roomList[roomId].start_ack = 0;
            socket.to(roomId).emit('other-disconnect',{});
        }
        roomId=""; 
    };

    io.use(function(socket, next){
        if (socket.handshake.query && socket.handshake.query.token){
          jwt.verify(socket.handshake.query.token, secret, function(err, decoded) {
            if(err) return next(new Error('Authentication error'));
            socket.id = decoded.id;
            next();
          });
        } else {
            next(new Error('Authentication error'));
        }    
    })
    .on('connection', (socket) => {
        console.log('New user connected');
        socket.join('global');
        socket.on('create-room', (data) => {
            socket.join(socket.id);
            roomId = socket.id;
            let newRoom ={
                userList: [socket.id],
                currTurn: 0,
                status : 0,
                replay: 0,
                start_ack: 0
            };
            roomList[socket.id] = newRoom;
            console.log(roomList);
            let date = getCurrentDate();
            let callback = (params) => {
                socket.to('global').emit('new-room', {
                    id: socket.id,
                    creator: params,
                    name: data.roomName,
                    createdAt: date
                });
            };
            userService.getUser(socket.id, callback);

        });
        socket.on('join', (data) => {
            roomId = data.roomId;
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
        
        socket.on('leave-room', () => {
            leaveRoom();
        });

        socket.on(('disconnect'), (reason) => {
            leaveRoom();
            console.log("Disconnenct because " + reason); 
        });
    });

};
module.exports = gameLogic;