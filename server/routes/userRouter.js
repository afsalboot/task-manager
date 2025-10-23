const express = require('express')
const { getUserProfile } = require('../controller/userController');
const protect = require('../middleware/authMiddleware');
const router = express.Router()


router.get('/get-user-profile', protect, getUserProfile);

module.exports = router;