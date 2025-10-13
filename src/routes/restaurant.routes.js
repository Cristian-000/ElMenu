// src/routes/restaurant.routes.js
const { Router } = require('express');
const { body } = require('express-validator');
const protect = require('../middlewares/auth.middleware');
const { createRestaurant, getMyRestaurant, updateRestaurantMenu } = require('../controllers/restaurant.controller');

const router = Router();

// Todas las rutas aquí requieren autenticación, por eso usamos `protect`.
router.use(protect);

// Crear un nuevo restaurante
router.post(
    '/',
    [
        body('name', 'El nombre es obligatorio').notEmpty(),
        body('slug', 'El slug es obligatorio y no debe contener espacios').notEmpty().isSlug()
    ],
    createRestaurant
);

// Obtener el restaurante del usuario logueado
router.get('/my-restaurant', getMyRestaurant);

// Actualizar el menú de mi restaurante
router.put('/my-restaurant/menu', updateRestaurantMenu);


module.exports = router;