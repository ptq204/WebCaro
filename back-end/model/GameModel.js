const mongoose = require('mongoose');
const gameSchema = new mongoose.Schema({
    players: [{type:mongoose.Schema.Types.ObjectId, ref: 'User'}],
    winner: {type:mongoose.Schema.Types.ObjectId, ref: 'User'}
})

module.exports = mongoose.model("Game", gameSchema);