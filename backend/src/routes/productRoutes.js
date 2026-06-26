const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/productController');
const protect = require('../middleware/authMiddleware');
const { validateProductData } = require('../middleware/productMiddleware');
const { authorize } = require('../middleware/roleMiddleware'); 

// 1. Ver inventario: Cualquier usuario logueado (admin o employee) puede verlo
router.get('/', protect, ProductController.getAllProducts);

router.get('/low-stock', protect, ProductController.getLowStockProducts);

router.get('/:id', protect, ProductController.getProductById);

// 2. Crear producto: SOLO ADMINS
router.post('/', protect, authorize('admin'), validateProductData, ProductController.createProduct);

// 3. Editar producto: SOLO ADMINS
router.put('/:id', protect, authorize('admin'), validateProductData, ProductController.updateProduct);

// 4. Eliminar producto: SOLO ADMINS
router.delete('/:id', protect, authorize('admin'), ProductController.deleteProduct);

module.exports = router;


