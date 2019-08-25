var roomList = [];
var roomListInfo = {};
const userService = require('../service/UserService');
const secret="pGctNMl4LL4bEQSwCdIzdg";
const jwt = require('jsonwebtoken');

const getCurrentDate = () => {
    let today = new Date();
    let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    return date+' '+time;
};

const gameLogic = function(io){
    let roomId = "";

    const leaveRoom = (socket) => {
      if  (roomId){
        socket.leave(roomId);
        let userList = roomList[roomId].userList;

        io.in('global').emit('room-close', {
            id: roomId
        });
        if (roomList[roomId].status === 2){
            let winner = (userList.indexOf(socket.id) + 1) % 2;
            userService.updateRank(userList[winner], socket.id);
        }
        
        let index = userList.indexOf(socket.id);
        userList.slice(index,1);
        let leftUserid = userList[0];
        let oldName = roomListInfo[roomId].name;
		delete roomList[roomId];
		delete roomListInfo[roomId];
        // let newRoom ={
        //     userList: userList,
        //     currTurn: 0,
        //     status : 0,
        //     start_ack: 0
        // };
        // roomList[leftUserid] = newRoom;

        // let date = getCurrentDate();
        // let callback = (params) => {
        //     let newRoom = {
        //         id: leftUserid,
        //         creator: {
        //             username: params.username,
        //             rank: params.rank
        //         },
        //         name: oldName,
        //         createdAt: date,
        //         status: 0
        //     };
        //     roomListInfo[socket.id] = newRoom
        //     socket.to('global').emit('new-room', newRoom);
        //     socket.to(roomId).emit('other-disconnect',newRoom);
        // };
        // userService.getUser(leftUserid, callback);
        // console.log('LEAVE AND THEN NEW ROOM');
				// console.log(roomListInfo);
		socket.to(roomId).emit('other-disconnect', {'oldRoomId': roomId});
        roomId="";
      }

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
        console.log(socket.decoded);

        setTimeout(()=>{
            console.log(roomListInfo);
            socket.emit('room-list', roomListInfo);
        },500);

        socket.on('create-room', (data) => {
					// if(data.oldRoomId) {
					// 	socket.leave(data.oldRoomId);
					// }
            socket.join(socket.id);
            roomId = socket.id;
            let newRoom ={
                userList: [socket.id],
                currTurn: 0,
                status : 0,
                start_ack: 0
            };
            roomList[socket.id] = newRoom;
            socket.emit("room-created", {
                id: socket.id,
                name: data.roomName
            });
            console.log(roomList);
            let date = getCurrentDate();
            let callback = (params) => {
                let newRoom = {
                    id: socket.id,
                    creator: {
                        username: params.username,
                        rank: params.rank
                    },
                    name: data.roomName,
                    createdAt: date,
                    status: 0
                };
                roomListInfo[socket.id] = newRoom
                socket.to('global').emit('new-room', newRoom);
            };
            userService.getUser(socket.id, callback);

        });
        socket.on('join', (data) => {
            roomId = data.roomId;
            socket.join(roomId);

            console.log(`${socket.id} has joined room ${data.roomId}`);

            roomList[roomId].userList.push(socket.id);
            roomList[roomId].status = 1;

            console.log(roomList[roomId].userList);

            let callback = (joinedUser)=>{
                io.in(roomId).emit('start-game', {joining: {
                    username: joinedUser.username,
                    rank: joinedUser.rank
                }});
                socket.to('global').emit('room-full', {
                    id: roomId
                });
            };

            userService.getUser(socket.id, callback);


        });

        socket.on('game-ack', () => {
            roomList[roomId].start_ack++;
            console.log(roomList[roomId].start_ack);
            if (roomList[roomId].start_ack === 2){
                roomList[roomId].status = 2;
                roomList[roomId].currTurn = Math.floor((Math.random() * 2));
                let currUser = roomList[roomId].userList[roomList[roomId].currTurn % 2];
                io.in(roomId).emit('start-playing', {'message': 'PLAY DI'});
                setTimeout(() => {
                    io.in(roomId).emit('turn', {user: currUser, currTurn: roomList[roomId].currTurn, firstTurn: 1});
                    socket.to('global').emit('room-start-playing', {
                        id: roomId
                    });
                    roomList[roomId].currTurn++;
                    console.log('Start at: ' + currUser);
                }, 2000);
            }
        });

        socket.on('play', (data) => {
            let currUser = roomList[roomId].userList[roomList[roomId].currTurn % 2];
            let msgBody = {
                user: currUser,
                currTurn: roomList[roomId].currTurn,
                updatedBoard: data.updatedBoard
            };

            if (data.gameEnd === 1){
								roomList[roomId].start_ack = 0;
								roomList[roomId].status = 1;
                msgBody.gameEnd = 1;
                let winner = roomList[roomId].userList[(roomList[roomId].currTurn + 1) % 2];
                userService.updateRank(winner,currUser);
                socket.to('global').emit('room-full', {
                    id: roomId
                });
            }
            else {
                msgBody.gameEnd = 0;
            }

            socket.to(roomId).emit('turn', msgBody);
            roomList[roomId].currTurn++;
        });

        socket.on('replay', (data) => {
            if (roomList[roomId].start_ack === 1){
                roomList[roomId].start_ack = 0;
                io.in(roomId).emit('start-game', {});
            } else {
                roomList[roomId].start_ack = 1;
                socket.to(roomId).emit('want-replay', {});
            }
        });

        socket.on('chat', (data) => {
            socket.to(roomId).emit('chat', data.msg);
        });

        socket.on('leave-room', () => {
             leaveRoom(socket);
        });

        socket.on(('disconnect'), (reason) => {
            leaveRoom(socket);
            console.log("Disconnenct because " + reason);
        });
    });

};
module.exports = gameLogic;
