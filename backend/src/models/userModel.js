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


    findByEmail: async (email) => {
        const query = 'SELECT * FROM users WHERE email = ?';
        const [rows] = await db.execute(query, [email]);

        return rows[0];
    }
};

module.exports = UserModel;