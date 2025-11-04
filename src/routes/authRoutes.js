// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { registerOrganization, loginUser } = require('../controllers/authContoller');

// POST /api/auth/register
router.post('/register', registerOrganization);

// POST /api/auth/login
router.post('/login', loginUser);

module.exports = router;
