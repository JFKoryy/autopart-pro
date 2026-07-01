const db = require('../config/db');

const UserModel = {

    create: async (name, email, hashedPassword) => {
        const query = `
            INSERT INTO users (name, email, password) 
            VALUES (?, ?, ?)
        `;

        const [result] = await db.execute(query, [name, email, hashedPassword]);
        return result;
    },

    getAll: async () => {
        const [rows] = await db.execute('SELECT id, name, email, role FROM users');
        return rows;
    },


    findByEmail: async (email) => {
        const query = 'SELECT * FROM users WHERE email = ?';
        const [rows] = await db.execute(query, [email]);

        return rows[0];
    },
    deleteUser: async (id) => {
        const query = 'DELETE FROM users WHERE id = ?';
        const [result] = await db.execute(query, [id]);
        return result;
    },
    updateRole: async (id, role) => {
    const [result] = await db.execute(
        'UPDATE users SET role = ? WHERE id = ?',
        [role, id]
    );
    return result.affectedRows > 0;
}
};

module.exports = UserModel;