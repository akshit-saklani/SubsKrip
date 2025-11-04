const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

// API Routes
router.get('/', customerController.getAllCustomers);
router.post('/', customerController.addCustomer);
router.put('/:id', customerController.updateCustomer);
router.patch('/:id/toggle', customerController.toggleCustomer);

module.exports = router;
