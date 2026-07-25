const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const protect = require('../middleware/authMiddleware');

router.post('/create-checkout-session', protect, paymentController.createCheckoutSession);

module.exports = router;