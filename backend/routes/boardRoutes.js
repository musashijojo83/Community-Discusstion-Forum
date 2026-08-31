
//Board Route setting
const express = require('express');
const router = express.Router();
const { createBoard, getBoards } = require('../controllers/boardController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getBoards);
router.post('/', protect, createBoard);

module.exports = router;