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

module.exports = {
    newMessage,
    getMessages
}