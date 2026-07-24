const multer = require('multer');
const path = require('path');
const fs = require('fs');

let storage;

if (process.env.STORAGE_TYPE === 's3') {
    const multerS3 = require('multer-s3');
    const s3Client = require('../config/s3');

storage = multerS3({
    s3: s3Client,
    bucket: process.env.S3_BUCKET_IMAGES,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      const uniqueName = `products/${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    },
});
} else {
  // Almacenamiento local en disco
    const uploadDir = path.join(__dirname, '../../uploads/products');
    fs.mkdirSync(uploadDir, { recursive: true });

    storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
      const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    },
});
}

const upload = multer({
    storage,
    limits: { fileSize: 7 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
    return cb(new Error('Solo se permiten archivos de imagen'));
    }
    cb(null, true);
},
});

module.exports = upload;