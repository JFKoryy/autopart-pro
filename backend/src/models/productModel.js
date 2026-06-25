const db = require('../config/db');

const ProductModel = {
    // 1. Obtener todos los productos del inventario
    getAll: async () => {
        const [rows] = await db.execute('SELECT * FROM products ORDER BY created_at DESC');
        return rows;
    },

    // 2. Buscar un producto por su ID
    getById: async (id) => {
        const [rows] = await db.execute('SELECT * FROM products WHERE id = ?', [id]);
        return rows[0]; // Retornamos solo el primer resultado si existe
    },

    // 3. Crear una nueva autoparte
    create: async (productData) => {
        const { sku, name, brand, compatible_cars, price, stock } = productData;
        const query = `
            INSERT INTO products (sku, name, brand, compatible_cars, price, stock) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const [result] = await db.execute(query, [sku, name, brand, compatible_cars, price, stock]);
        return result.insertId; // Nos devuelve el ID del nuevo producto creado
    },
    // 4. Actualizar una autoparte existente
    update: async (id, productData) => {
        const { sku, name, brand, compatible_cars, price, stock } = productData;
        const query = `
            UPDATE products 
            SET sku = ?, name = ?, brand = ?, compatible_cars = ?, price = ?, stock = ? 
            WHERE id = ?
        `;
        const [result] = await db.execute(query, [sku, name, brand, compatible_cars, price, stock, id]);
        return result.affectedRows > 0; // Devuelve true si encontró el producto y lo editó
    },

    // 5. Eliminar una autoparte
    delete: async (id) => {
        const [result] = await db.execute('DELETE FROM products WHERE id = ?', [id]);
        return result.affectedRows > 0; // Devuelve true si el producto existía y fue borrado
    }
};


module.exports = ProductModel;