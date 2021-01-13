const express = require('express');
const { createChatRoom, getChatRoom } = require('../controllers/ChatRoomController');
const router = express.Router();

router.post('/createChatRoom', createChatRoom);
router.get('/getChatRoom', getChatRoom);

module.exports = router;