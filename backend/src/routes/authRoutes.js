const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const protect = require('../middleware/authMiddleware');
const UserModel = require('../models/userModel');   

router.post('/register', authController.register); 
router.post('/login', authController.login);
router.get('/profile', protect, authController.getProfile);

router.get('/me', protect, async (req, res) => {
    console.log('Ruta /me ejecutada, user:', req.user)
    try {
        const user = await UserModel.findById(req.user.id)
        console.log('Usuario encontrado:', user)
        if (!user) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' })
        }
        res.status(200).json({ 
            success: true, 
            user
        })
    } catch (error) {
        console.error('Error en /me:', error)
        res.status(500).json({ success: false, message: 'Error' })
    }
})
module.exports = router;