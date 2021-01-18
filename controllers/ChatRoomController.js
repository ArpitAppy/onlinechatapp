const express = require('express');
const ChatRoom = require('../models/ChatRoom');
const { ResponseJson } = require('../utils/common');

const createChatRoom = async (req, res) => {
    try {
        const { name, from, to } = req.body;
        let chatroom = await ChatRoom.findOne({name});
        if (chatroom) {
            return ResponseJson(res, 200, true, 'Already created', {chatroom}, {});
        }

        const newChatRoom = new ChatRoom({
            name,
            from,
            to
        });

        await newChatRoom.save(async function(err, chatroom) {
            if (err) {
                return ResponseJson(res, 500, false, "Error occured. Please try again !!", {}, {} );
            }

            return ResponseJson(res, 201, true, "ChatRoom Created!!", {chatroom}, {});
        })

    } catch (err) {
        return ResponseJson(res, 400, false, err, {}, err);
    }
}

const getChatRoom = async (req, res) => {
    try{
        const { name } = req.query;
        const chatroom = await ChatRoom.findOne({name});

        if (!chatroom) {
            return ResponseJson(res, 200, true, 'No ChatRoom found !', {}, {});
        }

        return ResponseJson(res, 200, true, 'Chat Room Fetched !', {chatroom}, {});
    } catch(err) {
        return ResponseJson(res, 400, false, err, {}, err);
    }
}

module.exports = {
    createChatRoom,
    getChatRoom
}