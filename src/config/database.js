const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Requerido para conexiones a Render
  }
});

pool.connect((err) => {
  if (err) {
    console.error('Error al conectar con la base de datos', err.stack);
  } else {
    console.log('Conexión a la base de datos exitosa');
  }
});

module.exports = pool;