const mongoose = require('mongoose');
const ChatRoom = require('./ChatRoom');
const Users = require('./Users');

var MessageSchema = new mongoose.Schema({
    mid: String,
    user: {
        type: String,
        required: true,
        ref: Users
    },
    chatroom: {
        type: String,
        required: true,
        ref: ChatRoom
    },
    message: String,
    from: String,
    to: String,
    timestamp: String,
    sent: Boolean,        
    read: Boolean
})

var Message = mongoose.model("messages", MessageSchema);
module.exports = Message;