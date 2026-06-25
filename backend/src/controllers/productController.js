const ProductModel = require('../models/productModel');

const ProductController = {
    // 1. Manejar la petición de listar todos los productos
    getAllProducts: async (req, res) => {
        try {
            const products = await ProductModel.getAll();
            res.status(200).json({
                success: true,
                data: products
            });
        } catch (error) {
            console.error('Error en getAllProducts:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener los productos del servidor.'
            });
        }
    },

    // 2. Manejar la petición de crear una nueva autoparte
    createProduct: async (req, res) => {
        try {
            const { sku, name, brand, compatible_cars, price, stock } = req.body;

            // Validación express: que al menos tenga SKU, Nombre y Marca
            if (!sku || !name || !brand) {
                return res.status(400).json({
                    success: false,
                    message: 'Faltan campos obligatorios: sku, name y brand son requeridos.'
                });
            }

            const newProductId = await ProductModel.create({
                sku,
                name,
                brand,
                compatible_cars,
                price,
                stock
            });

            res.status(201).json({
                success: true,
                message: 'Autoparte registrada con éxito',
                productId: newProductId
            });
        } catch (error) {
            console.error('Error en createProduct:', error);
            
            // Un truco por si intentan meter un SKU que ya existe
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({
                    success: false,
                    message: `El SKU '${sku}' ya está registrado en el inventario.`
                });
            }

            res.status(500).json({
                success: false,
                message: 'Error al registrar el producto.'
            });
        }
    },
    // 3. Manejar la actualización de un producto
    updateProduct: async (req, res) => {
        try {
            const { id } = req.params;
            const wasUpdated = await ProductModel.update(id, req.body);

            if (!wasUpdated) {
                return res.status(404).json({ success: false, message: 'Producto no encontrado.' });
            }

            res.status(200).json({ success: true, message: 'Autoparte actualizada con éxito.' });
        } catch (error) {
            console.error('Error en updateProduct:', error);
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ success: false, message: 'El SKU ingresado ya pertenece a otro producto.' });
            }
            res.status(500).json({ success: false, message: 'Error al actualizar el producto.' });
        }
    },
    // 3. Manejar la actualización de un producto
    updateProduct: async (req, res) => {
        try {
            const { id } = req.params;
            const wasUpdated = await ProductModel.update(id, req.body);

            if (!wasUpdated) {
                return res.status(404).json({ success: false, message: 'Producto no encontrado.' });
            }

            res.status(200).json({ success: true, message: 'Autoparte actualizada con éxito.' });
        } catch (error) {
            console.error('Error en updateProduct:', error);
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ success: false, message: 'El SKU ingresado ya pertenece a otro producto.' });
            }
            res.status(500).json({ success: false, message: 'Error al actualizar el producto.' });
        }
    },

    // 4. Manejar la eliminación de un producto
    deleteProduct: async (req, res) => {
        try {
            const { id } = req.params;
            const wasDeleted = await ProductModel.delete(id);

            if (!wasDeleted) {
                return res.status(404).json({ success: false, message: 'Producto no encontrado.' });
            }

            res.status(200).json({ success: true, message: 'Autoparte eliminada del inventario.' });
        } catch (error) {
            console.error('Error en deleteProduct:', error);
            res.status(500).json({ success: false, message: 'Error al eliminar el producto.' });
        }
    }
};

module.exports = ProductController;