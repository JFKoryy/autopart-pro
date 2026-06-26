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
    const fields = [];
    const values = [];

    // Por cada campo posible, si llegó en productData, lo agregamos
    if (productData.sku !== undefined) {
        fields.push('sku = ?');
        values.push(productData.sku);
    }
    if (productData.name !== undefined) {
        fields.push('name = ?');
        values.push(productData.name);
    }
    if (productData.brand !== undefined) {
        fields.push('brand = ?');
        values.push(productData.brand);
    }
    if (productData.compatible_cars !== undefined) {
        fields.push('compatible_cars = ?');
        values.push(productData.compatible_cars);
    }
    if (productData.price !== undefined) {
        fields.push('price = ?');
        values.push(productData.price);
    }
    if (productData.stock !== undefined) {
        fields.push('stock = ?');
        values.push(productData.stock);
    }

    if (fields.length === 0) {
        throw new Error('No se enviaron campos para actualizar');
    }

    const query = `UPDATE products SET ${fields.join(', ')} WHERE id = ?`;
    values.push(id);

    const [result] = await db.execute(query, values);
    return result.affectedRows > 0;
},

    // 5. Eliminar una autoparte
    delete: async (id) => {
        const [result] = await db.execute('DELETE FROM products WHERE id = ?', [id]);
        return result.affectedRows > 0; // Devuelve true si el producto existía y fue borrado
    },

    // 6. Obtener productos con stock bajo
    getLowStock: async () => {
    const [rows] = await db.execute('SELECT * FROM products WHERE stock <= min_stock');
    return rows;
}
};


module.exports = ProductModel;