// Express router setup in server.js will import these
// I will create individual route files for clarity

// src/routes/auth.js
const express = require('express');
const router = express.Router();
const { loginUser } = require('../controllers/authController');
router.post('/login', loginUser);
module.exports = router;
