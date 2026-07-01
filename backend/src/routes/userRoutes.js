const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const protect  = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Todas las rutas de usuarios son solo para admin
router.get('/', protect, authorize('admin'), userController.getUsers);
router.put('/:id/role', protect, authorize('admin'), userController.updateRole);
router.delete('/:id', protect, authorize('admin'), userController.deleteUser);

module.exports = router;