var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var userSchema = new mongoose.Schema({
    username: {type: String, unique: true},
    password: String,
    win: Number,
    loss: Number,
    rank: Number,
});

userSchema.pre('save', function(next){
    let user = this;
    if (!user.isModified('password')) {return next();}
    bcrypt.hash(user.password,10).then((hashedPass) => {
            user.password = hashedPass;
            next();
        });
    }
);

module.exports = mongoose.model("User", userSchema);