const SaleModel = require('../models/saleModel');

const saleController = {

    getSales: async (req, res) => {
        try {
            // Admin ve todas las ventas, cliente solo las suyas
            const sales = req.user.role === 'admin'
                ? await SaleModel.getAll()
                : await SaleModel.getByUser(req.user.id);

            res.status(200).json({ success: true, data: sales });
        } catch (error) {
            console.error('Error en getSales:', error);
            res.status(500).json({ success: false, message: 'Error al obtener ventas.' });
        }
    },

    createSale: async (req, res) => {
        try {
            const { items } = req.body;

            if (!items || items.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'El carrito está vacío.'
                });
            }

            const saleId = await SaleModel.create(req.user.id, items);

            res.status(201).json({
                success: true,
                message: 'Compra realizada con éxito.',
                saleId
            });
        } catch (error) {
            console.error('Error en createSale:', error);
            res.status(500).json({ success: false, message: 'Error al procesar la compra.' });
        }
    }
};

module.exports = saleController;