// src/routes/restaurant.routes.js
const { Router } = require('express');
const { body } = require('express-validator');
const protect = require('../middlewares/auth.middleware');
const { createRestaurant, getMyRestaurants, getRestaurantDetails } = require('../controllers/restaurant.controller');
// Próximamente: const checkRestaurantOwnership = require('../middlewares/ownership.middleware');

const router = Router();
router.use(protect); // Todas estas rutas están protegidas

router.post(
    '/',
    [
        body('name', 'El nombre es obligatorio').notEmpty(),
        body('slug', 'El slug es obligatorio y no debe contener espacios').notEmpty().isSlug()
    ],
    createRestaurant
);

// Ruta para obtener TODOS los restaurantes del usuario
router.get('/my-restaurants', getMyRestaurants);

// Ruta para obtener los detalles de UN restaurante específico
// Próximamente: router.get('/:id', checkRestaurantOwnership, getRestaurantDetails);
router.get('/:id', getRestaurantDetails); 

// La ruta PUT /my-restaurant/menu se elimina
module.exports = router;