const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const protect = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const multer = require('multer');

router.post('/', protect, authorize('admin', 'employee'), (req, res) => {
    upload.single('image')(req, res, (err) => {
        if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(413).json({ success: false, message: 'La imagen supera el tamaño máximo de 7MB.' });
        }
        return res.status(400).json({ success: false, message: err.message });
        } else if (err) {
        return res.status(400).json({ success: false, message: err.message || 'Error al subir la imagen' });
        }

        if (!req.file) {
        return res.status(400).json({ success: false, message: 'No se subió ninguna imagen' });
        }

        const url = process.env.STORAGE_TYPE === 's3'
        ? req.file.location
        : `${req.protocol}://${req.get('host')}/uploads/products/${req.file.filename}`;

        res.status(200).json({ success: true, url });
    });
});
// backend/src/routes/uploadRoutes.js
router.delete('/', protect, authorize('admin', 'employee'), async (req, res) => {
    const { url } = req.body;
    if (!url) {
        return res.status(400).json({ success: false, message: 'URL de imagen requerida' });
    }

    try {
        if (process.env.STORAGE_TYPE === 's3') {
        const { DeleteObjectCommand } = require('@aws-sdk/client-s3');
        const s3Client = require('../config/s3');
        const key = url.split('.amazonaws.com/')[1]; // extrae el key del bucket desde la URL
            await s3Client.send(new DeleteObjectCommand({
            Bucket: process.env.S3_BUCKET_IMAGES,
            Key: key,
        }));
        } else {
            const fs = require('fs');
            const path = require('path');
            const filename = url.split('/uploads/products/')[1];
            const filePath = path.join(__dirname, '../../uploads/products', filename);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }
        res.status(200).json({ success: true, message: 'Imagen eliminada' });
    } catch (error) {
        console.error('Error al eliminar imagen:', error);
        res.status(500).json({ success: false, message: 'Error al eliminar la imagen' });
    }
    });

module.exports = router;