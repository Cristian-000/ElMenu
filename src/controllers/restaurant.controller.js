// src/controllers/restaurant.controller.js
const { validationResult } = require('express-validator');
const restaurantService = require('../services/restaurant.service');

const createRestaurant = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { name, slug } = req.body;
        // Obtenemos el ID del usuario del token JWT, que fue añadido por el middleware 'protect'
        const userId = req.user.id; 

        const newRestaurant = await restaurantService.createRestaurant(userId, name, slug);
        res.status(201).json(newRestaurant);
    } catch (error) {
        next(error); // Pasamos el error al manejador central
    }
};

const getMyRestaurant = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const restaurant = await restaurantService.getRestaurantByUserId(userId);
        res.status(200).json(restaurant);
    } catch (error) {
        next(error);
    }
};

const updateRestaurantMenu = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const menuData = req.body; // El body completo será el objeto JSON del menú

        // Lógica de validación para el menuData podría ir aquí si es necesario
        if (typeof menuData !== 'object' || menuData === null) {
            return res.status(400).json({ message: 'El cuerpo de la petición debe ser un objeto JSON de menú válido.' });
        }

        const updatedRestaurant = await restaurantService.updateMenuByUserId(userId, menuData);
        res.status(200).json(updatedRestaurant);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createRestaurant,
    getMyRestaurant,
    updateRestaurantMenu,
};