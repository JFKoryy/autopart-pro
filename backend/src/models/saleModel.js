const db = require('../config/db');



const SaleModel = {

    
    create: async (userId, items) => {
        const connection = await db.getConnection();
        await connection.beginTransaction();

        try {
            const total = items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);

            const [saleResult] = await connection.execute(
                'INSERT INTO sales (user_id, total) VALUES (?, ?)',
                [userId, total]
            );
            const saleId = saleResult.insertId;

            for (const item of items) {
                await connection.execute(
                    'INSERT INTO sale_items (sale_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)',
                    [saleId, item.product_id, item.quantity, item.unit_price]
                );

                await connection.execute(
                    'UPDATE products SET stock = stock - ? WHERE id = ?',
                    [item.quantity, item.product_id]
                );
            }

            await connection.commit();
            return saleId;

        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    },

    getAll: async () => {
        const [rows] = await db.execute(`
            SELECT 
                s.id,
                s.total,
                s.status,
                s.created_at,
                u.name as user_name,
                u.email as user_email,
                JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'product_id', si.product_id,
                        'product_name', p.name,
                        'quantity', si.quantity,
                        'unit_price', si.unit_price
                    )
                ) as items
            FROM sales s
            JOIN users u ON s.user_id = u.id
            JOIN sale_items si ON s.id = si.sale_id
            JOIN products p ON si.product_id = p.id
            GROUP BY s.id, s.total, s.status, s.created_at, u.name, u.email
            ORDER BY s.created_at DESC
        `);

        return rows.map(row => ({
            ...row,
            total: parseFloat(row.total),
            items: typeof row.items === 'string' ? JSON.parse(row.items) : row.items
        }));
    },

    getByUser: async (userId) => {
        const [rows] = await db.execute(`
            SELECT 
                s.id,
                s.total,
                s.status,
                s.created_at,
                JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'product_id', si.product_id,
                        'product_name', p.name,
                        'quantity', si.quantity,
                        'unit_price', si.unit_price
                    )
                ) as items
            FROM sales s
            JOIN sale_items si ON s.id = si.sale_id
            JOIN products p ON si.product_id = p.id
            WHERE s.user_id = ?
            GROUP BY s.id, s.total, s.status, s.created_at
            ORDER BY s.created_at DESC
        `, [userId]);

        return rows.map(row => ({
            ...row,
            total: parseFloat(row.total),
            items: typeof row.items === 'string' ? JSON.parse(row.items) : row.items
        }));
    }
};

module.exports = SaleModel;