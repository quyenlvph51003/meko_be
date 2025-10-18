import mysql from 'mysql2/promise';
const dbConfig = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  };

  const pool = mysql.createPool(dbConfig);

  async function testConnection() {
    try{
        const connection = await pool.getConnection();
        console.log('Successfully connected to the database');
        connection.release();
    }catch(error){
        console.error('Error connecting to the database:', error);
        
    }
  }

  export default {
    pool,
    testConnection
  }

