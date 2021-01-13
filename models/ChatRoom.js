const mongoose = require('mongoose');


var ChatRoomSchema = new mongoose.Schema({

    name : {
        type: String,
        required: true
    }

})

var ChatRoom = mongoose.model("chatroom", ChatRoomSchema);
module.exports = ChatRoom;