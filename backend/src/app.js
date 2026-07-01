const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const db = require('./config/db');
const stockEmitter = require('./events/stockEmitter');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const saleRoutes = require('./routes/saleRoutes');

// Middlewares globales
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// EventEmitter — stock bajo
stockEmitter.on('low-stock', (product) => {
    console.log(`⚠️ Alerta de stock bajo: "${product.name}" (SKU: ${product.sku}) tiene stock de ${product.stock}.`);
});

// Health check
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'ON',
        message: 'Servidor de AutoPart Pro funcionando correctamente',
        timestamp: new Date()
    });
});

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/sales', saleRoutes);

// Servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
    console.log(`Prueba el servidor en: http://localhost:${PORT}/api/health`);
});

module.exports = app;