const express = require('express');
const router = express.Router();
const { getSummary, getAlerts } = require('../controllers/dashboardController');
const { protect } = require('../middleware/protect');

router.get('/summary', protect, getSummary);
router.get('/alerts', protect, getAlerts);

module.exports = router;
