// src/controllers/restaurant.controller.js
const { validationResult } = require('express-validator');
const restaurantService = require('../services/restaurant.service');

const createRestaurant = async (req, res, next) => {
    // ... (sin cambios en createRestaurant)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { name, slug } = req.body;
        const userId = req.user.id; 
        const newRestaurant = await restaurantService.createRestaurant(userId, name, slug);
        res.status(201).json(newRestaurant);
    } catch (error) {
        next(error);
    }
};

// Renombrado a plural
const getMyRestaurants = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const restaurants = await restaurantService.getRestaurantsByUserId(userId);
        res.status(200).json(restaurants); // Devuelve un array
    } catch (error) {
        next(error);
    }
};

// Nueva función para obtener un solo restaurante (para la pág. de detalles)
const getRestaurantDetails = async (req, res, next) => {
    try {
        const { id } = req.params;
        // Aquí deberíamos verificar que el usuario es dueño de este restaurante
        // (lo haremos en el middleware de seguridad)
        const restaurant = await restaurantService.getRestaurantById(id);
        res.status(200).json(restaurant);
    } catch (error) {
        next(error);
    }
};

const updateSettings = async (req, res, next) => {
    try {
        const { id } = req.params; // ID del restaurante
        const userId = req.user.id; // ID del usuario (del token)
        const settings = req.body; // { whatsapp_number: "..." }

        const updatedRestaurant = await restaurantService.updateRestaurantSettings(id, userId, settings);
        res.status(200).json(updatedRestaurant);
    } catch (error) {
        next(error);
    }
};

// Exporta la nueva función
module.exports = {
    createRestaurant,
    getMyRestaurants,
    getRestaurantDetails,
    updateSettings, // <-- Añade esto
};