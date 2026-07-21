require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');

const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
};

async function setupDatabase() {
  let connection;
  try {
    connection = await mysql.createConnection(config);
    console.log('✅ Conectado a RDS');
    
    const sql = fs.readFileSync('./database.sql', 'utf8');
    const statements = sql.split(';').filter(stmt => stmt.trim());
    for (const stmt of statements) {
      await connection.execute(stmt);
    }
    
    console.log('✅ Base de datos creada en RDS');
    await connection.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

setupDatabase();