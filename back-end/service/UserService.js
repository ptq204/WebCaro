const UserDAO = require('../model/UserModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const GameDAO = require('../model/GameModel');
const secret="pGctNMl4LL4bEQSwCdIzdg"

module.exports = {
    createUser: (user) => {
        newUser = new UserDAO({
            username: user.username,
            password: user.password,
            win: 0,
            loss: 0,
        })
        console.log("Created user: ",user);
        newUser.save();
    },
    authenticateUser: (inUser , callback) => {
        UserDAO.findOne({username: inUser.username}, (err, user) => {
            if (err) return handleError(err);
            if (!user){
                callback("Invalid");
            } else {
                if (bcrypt.compare(inUser.password,user.password)){
                    let token = jwt.sign(
                        {id: user._id},
                        secret,
                        {expiresIn: '24h'}
                    );
                    callback(token);
                } else {
                    callback("Invalid");
                }
            }
        })
    },
    getGameHistory: (inUser, callback)  => {
        UserDAO.findOne({username: inUser.username}, '_id', (err,user) => {
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
    }
};