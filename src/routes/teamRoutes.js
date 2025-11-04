// routes/teamRoutes.js
const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');

// Get all members
router.get('/', teamController.getAllTeamMembers);

// Add new member
router.post('/', teamController.createTeamMember);

// Update member details
router.put('/:id', teamController.updateTeamMember);

// Enable/Disable member
router.patch('/:id/toggle', teamController.toggleTeamMember);

module.exports = router;
