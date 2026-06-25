const express = require('express'); 
const cors = require('cors'); 
require('dotenv').config(); 
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');

const app = express();
const db = require('./config/db');

app.use(cors()); 
app.use(express.json()); 

app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'ON',
        message: 'Servidor de AutoPart Pro funcionando correctamente',
        timestamp: new Date()
    });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
    console.log(`Prueba el servidor en: http://localhost:${PORT}/api/health`);
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);


module.exports = app;