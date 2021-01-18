const mongoose = require('mongoose');
const ChatRoom = require('./ChatRoom');
const Users = require('./Users');

var MessageSchema = new mongoose.Schema({
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
    timestamp: String,        
    receiver: Boolean,
    read: Boolean
})

var Message = mongoose.model("messages", MessageSchema);
module.exports = Message;