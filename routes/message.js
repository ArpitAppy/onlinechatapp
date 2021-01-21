const express = require('express');
const { newMessage, getMessages, getMessagesForChatroom, updateReadStatus } = require('../controllers/MessageController');

const router = express.Router();

router.post('/newMessage', newMessage);
router.get('/getMessages', getMessages);
router.get('/getMessagesForChatroom', getMessagesForChatroom);
router.post('/updateReadStatus', updateReadStatus);

module.exports = router;