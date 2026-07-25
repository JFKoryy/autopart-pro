const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = require('../middleware/upload');
const protect = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const path = require('path');

// Paso 1: el frontend pide "permiso" para subir — el backend decide el modo
router.post('/init', protect, authorize('admin', 'employee'), async (req, res) => {
    const { filename, contentType } = req.body;

    if (!filename || !contentType) {
        return res.status(400).json({ success: false, message: 'Falta filename o contentType' });
    }

    if (!contentType.startsWith('image/')) {
        return res.status(400).json({ success: false, message: 'Solo se permiten imágenes' });
    }

    if (process.env.STORAGE_TYPE === 's3') {
        try {
        const { PutObjectCommand } = require('@aws-sdk/client-s3');
        const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
        const s3Client = require('../config/s3');

        const key = `products/${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(filename)}`;

        const command = new PutObjectCommand({
            Bucket: process.env.S3_BUCKET_IMAGES,
            Key: key,
            ContentType: contentType,
        });

        const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 60 }); // 60 segundos para subir
        const publicUrl = `https://${process.env.S3_BUCKET_IMAGES}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

        return res.status(200).json({
            success: true,
            mode: 's3',
            uploadUrl,
            publicUrl,
            key,
        });
        } catch (error) {
        console.error('Error al generar URL prefirmada:', error);
        return res.status(500).json({ success: false, message: 'Error al generar URL de subida' });
        }
    }

    // Modo local: el frontend sabe que debe usar el flujo antiguo (FormData a /api/upload)
    return res.status(200).json({ success: true, mode: 'local' });
});

// Flujo local existente (sin cambios) — solo se usa cuando mode === 'local'
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

        const url = `${req.protocol}://${req.get('host')}/uploads/products/${req.file.filename}`;
        res.status(200).json({ success: true, url });
    });
});

// DELETE — funciona igual para ambos modos
router.delete('/', protect, authorize('admin', 'employee'), async (req, res) => {
    const { url } = req.body;
    if (!url) {
        return res.status(400).json({ success: false, message: 'URL de imagen requerida' });
    }

    try {
        if (process.env.STORAGE_TYPE === 's3') {
        const { DeleteObjectCommand } = require('@aws-sdk/client-s3');
        const s3Client = require('../config/s3');
        const key = url.split('.amazonaws.com/')[1];
        await s3Client.send(new DeleteObjectCommand({
            Bucket: process.env.S3_BUCKET_IMAGES,
            Key: key,
        }));
        } else {
        const fs = require('fs');
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