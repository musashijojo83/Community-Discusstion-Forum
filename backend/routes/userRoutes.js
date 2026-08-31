// User route setting
const express = require('express');
const router = express.Router();
const { updateAvatar } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.patch('/me/avatar', protect, updateAvatar);

module.exports = router;
