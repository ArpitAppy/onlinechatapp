const mongoose = require('mongoose');

var UserSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            trim: true,
            required: true
        },
        uid: {
            type: String,
            trim: true,
            required: true
        },
        emailAddress: {
            type: String,
            trim: true,
            required: true
        },
        password: {
            type: String,
            trim: true,
            required: true
        },
        mobileNumber: {
            type: String,
            trim: true,
            required: true
        }
    }
)

var Users = mongoose.model("Users", UserSchema);
module.exports = Users;