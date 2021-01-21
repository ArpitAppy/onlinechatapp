const express = require('express');
const Message = require('../models/Message');
const { ResponseJson } = require('../utils/common');

const newMessage = async (req, res) => {
    try {
        const message = req.body;

        Message.create(message, (err, data) => {
            if (err) {
                return ResponseJson(res, 500, false, err, {}, err)
            } else {
                ResponseJson(res, 201, true, 'Message Saved', data, {})
            }
        })
    } catch (err) {
        return ResponseJson(res, 400, false, 'Something went wrong!', {}, err)
    }
};

const getMessages = async (req, res) => {
    try {
        Message.find((err, data) => {
            if (err) {
                return ResponseJson(res, 500, false, err, {}, err);
            } else {
                return ResponseJson(res, 200, true, "Message Fetched!", data, {});
            }
        })
    } catch (err) {
        return ResponseJson(res, 400, false, err, {}, err);
    }
}

const getMessagesForChatroom = async (req, res) => {
    try {
        const { chatroom } = req.query
        let messages = await Message.find({chatroom})
        if (!messages) {
            return ResponseJson(res, 200, true, "No Messages", {}, {})
        }

        return ResponseJson(res, 200, true, "Messages Fetched !!", messages, {});
    } catch (err) {
        return ResponseJson(res, 400, false, err, {}, err)
    }
}

const updateReadStatus = async (req, res) => {

    try {
        const { chatroom } = req.body
        const message = await Message.find({chatroom})
        console.log(message)
        if (!message) {
            return ResponseJson(res, 200, true, 'No Message Found!', {}, {})
        }
        await Message.updateMany({ chatroom }, { read : true }, { upsert: true })
        return ResponseJson(res, 200, true, 'Read Status Updated Successfully !', message, {});
    } catch (err) {
        console.log(err)
        return ResponseJson(res, 400, false, err, {}, err);
    }
}

module.exports = {
    newMessage,
    getMessages,
    getMessagesForChatroom,
    updateReadStatus
}