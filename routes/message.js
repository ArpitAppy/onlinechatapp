const express = require('express');
const { newMessage, getMessages } = require('../controllers/MessageController');

const router = express.Router();

router.post('/newMessage', newMessage);
router.get('/getMessages', getMessages);

module.exports = router;