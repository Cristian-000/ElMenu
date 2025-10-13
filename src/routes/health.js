const { Router } = require('express');
const pool = require('../config/database'); // Importamos la conexión

const router = Router();

router.get('/health', async (req, res) => {
  try {
    // Hacemos una consulta simple para verificar la conexión
    const time = await pool.query('SELECT NOW()');
    res.status(200).json({
      status: 'ok',
      message: 'API funcionando correctamente',
      dbTime: time.rows[0].now,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error en el servidor o la base de datos',
      error: error.message,
    });
  }
});

module.exports = router;