const UserDAO = require('../model/UserModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const GameDAO = require('../model/GameModel');
const secret="pGctNMl4LL4bEQSwCdIzdg";

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
                if (bcrypt.compare(inUser.password,user.password)){
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
            }
        }); 
    },
    getGameHistory: (inUser, callback)  => {
        UserDAO.findOne({username: inUser.username}, (err,user) => {
           if (err) return handleError(err);
           if (!user){
               callback("Invalid");
           } else {
               GameDAO.find({players: inUser.username})
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
        let earning = 100;
        let losing = 100 * -1;
        Promise.all([
            UserDAO.findByIdAndUpdate(winnerId, {$inc: {rank: earning, win: 1}}),
            UserDAO.findByIdAndUpdate(loserId, {$inc: {rank: losing, loss: 1}})
        ]).then(([winner, loser])=>{
            console.log(winner,loser);
        }).catch((err) => {
            console.log('Error: ', err);
        });
    },
    getId: (username, callback) => {
        UserDAO.findOne({username:username}, (err,user) => {
            if (err) return handleError(err);
            callback(user.id);
        });
    }
};