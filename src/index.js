// src/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors'); 
const authRoutes = require('./routes/auth.routes');
const menuRoutes = require('./routes/menu.routes.js');
const restaurantRoutes = require('./routes/restaurant.routes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors()); 
app.use(express.json());

// Rutas de la API
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/restaurants', restaurantRoutes);
app.use('/api/v1', menuRoutes);
// Middleware de manejo de errores (debe ser el último)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});