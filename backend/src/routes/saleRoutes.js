const express = require('express');
const router = express.Router();
const saleController = require('../controllers/saleController');
const protect = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');


// Ver ventas — admin ve todas, cliente solo las suyas
router.get('/', protect, saleController.getSales);

// Crear una venta (checkout) — cualquier usuario autenticado
router.post('/', protect, saleController.createSale);

module.exports = router;