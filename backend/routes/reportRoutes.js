
const express = require('express');
const router = express.Router();
const { reportPost, getReports } = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, reportPost);
router.get('/', protect, getReports);

module.exports = router;