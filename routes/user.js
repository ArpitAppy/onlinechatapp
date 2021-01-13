const express = require('express');
const { registerUser, getAllUsers, loginUser } = require('../controllers/UserController');
const router = express.Router();

router.post('/registerUser', registerUser);
router.get('/getAllUsers', getAllUsers);
router.post('/loginUser', loginUser);

module.exports = router;