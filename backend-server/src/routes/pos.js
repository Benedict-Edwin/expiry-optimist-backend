const express = require('express');
const router = express.Router();
const { syncPosData } = require('../controllers/posController');

router.post('/sync', syncPosData);

module.exports = router;
