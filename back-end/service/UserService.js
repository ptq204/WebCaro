const UserDAO = require('../model/UserModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const GameDAO = require('../model/GameModel');
const secret="pGctNMl4LL4bEQSwCdIzdg";

let client;


module.exports = {
    createUser: (user, callback) => {
        UserDAO.findOne({username: user.username}, (err,foundUser) => {
            if (err) return handleError(err);
            if (foundUser) {
                callback("exist");
            } else {
                newUser = new UserDAO({
                    username: user.username,
                    password: user.password,
                    win: 0,
                    loss: 0,
                    rank: 1000,
                });
                console.log("Created user: ",user);
                saved = newUser.save((err) => {
                    if (err) throw err;
                    let token = jwt.sign(
                        {id: newUser.id},
                        secret,
                        {expiresIn: '24h'}
                    );
                    callback(token);
                });
            }
        });

    },
    authenticateUser: (inUser , callback) => {
        UserDAO.findOne({username: inUser.username}, (err, user) => {
            if (err) return handleError(err);
            if (!user){
                console.log("not found");
                callback("Invalid");
            } else {
                console.log(inUser.password);
                console.log(user.password);
                bcrypt.compare(inUser.password,user.password, (err, res) => {
                  if (res) {
                  let token = jwt.sign(
                      {id: user.id},
                      secret,
                      {expiresIn: '24h'}
                  );
                  callback(token);
                  } else {
                      console.log("wrong pass ");
                      callback("Invalid");
                  }
                });
            }
        });
    },
    getGameHistory: (usrId, callback)  => {
        UserDAO.findOne({id: usrId}, (err,user) => {
           if (err) return handleError(err);
           if (!user){
               callback("Invalid");
           } else {
               GameDAO.findOne({players: usrId})
                   .populate('players')
                   .populate('winner')
                   .exec( (err, games) => {
                       if (err) return handleError(err);
                       callback(games);
                   });
           }
        });
    },
    updateRank: (winnerId, loserId) => {

        Promise.all([
            UserDAO.findById(winnerId),
            UserDAO.findById(loserId)
        ]).then(([winner, loser])=>{
            console.log(winner,loser);
            let K = 0;
            let rankDiff = Math.abs(winner.rank - loser.rank);
            if (rankDiff < 500){
                K = 100;
            } else if (rankDiff < 1000){
                K = 300;
            } else if (rankDiff < 2000){
                K = 500;
            } else if (rankDiff < 4000){
                K = 1000;
            } else {
                K = 1500;
            }
            let p1 = 1.0 * 1.0 / (1 + 1.0 * Math.pow(10, 1.0 * (loser.rank - winner.rank) / 4000));
            let p2 = 1.0 * 1.0 / (1 + 1.0 * Math.pow(10, 1.0 * (winner.rank - loser.rank) / 4000));
            winner.rank = winner.rank + Math.floor(K*(1-p1));
            loser.rank = loser.rank + Math.floor(K*(0-p2));
            winner.win += 1;
            loser.loss += 1;

            client.zadd('ranking', winner.rank, winner.username, loser.rank, loser.username);
            client.set('user:'+winner.id,JSON.stringify({
                username: winner.username,
                win: winner.win,
                loss: winner.loss,
                rank: winner.rank
            }));
            client.set('user:'+loser.id,JSON.stringify({
                username: loser.username,
                win: loser.win,
                loss: loser.loss,
                rank: loser.rank
            }));
            Promise.all([
                winner.save(),
                loser.save()
            ]).then(([winner,loser]) => {
                console.log(winner,loser);
            })
            .catch();

        }).catch((err) => {
            console.log('Error: ', err);
        });
    },
    getId: (username, callback) => {
        UserDAO.findOne({username:username},'id', (err,user) => {
            if (err) return handleError(err);
            callback(user);
        });
    },
    getUser: (userId, callback) => {
        client.get('user:'+userId, (err, reply) => {
            if (err) return handleError(err);
            if (reply != null){
                reply = JSON.parse(reply);
                callback(reply);
            } else {
                UserDAO.findById(userId, (err,user) => {
                    if (err) return handleError(err);
                    client.set('user:'+userId, JSON.stringify({
                        username: user.username,
                        win: user.win,
                        loss: user.loss,
                        rank: user.rank
                    }));
                    callback(user);
                });
            }
        });
    },
    setRedisClient: (inClient) => {
        client = inClient;
    }
};
