const express = require('express');
const { registerUser, getAllUsers, loginUser, getUserDetails } = require('../controllers/UserController');
const router = express.Router();

router.post('/registerUser', registerUser);
router.get('/getAllUsers', getAllUsers);
router.post('/loginUser', loginUser);
router.get('/getUserDetails', getUserDetails)

module.exports = router;