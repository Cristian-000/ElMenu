// src/services/restaurant.service.js
const pool = require('../config/database');

const createRestaurant = async (userId, name, slug) => {
    const existingSlug = await pool.query('SELECT id FROM restaurants WHERE slug = $1', [slug]);
    if (existingSlug.rows.length > 0) {
        const error = new Error('Esta URL (slug) ya está en uso. Por favor, elige otra.');
        error.status = 409;
        throw error;
    }

    // ¡HEMOS QUITADO LA RESTRICCIÓN DE 1 RESTAURANTE POR USUARIO!

    const query = `
        INSERT INTO restaurants (user_id, name, slug) 
        VALUES ($1, $2, $3) 
        RETURNING *
    `;
    const values = [userId, name, slug];
    const result = await pool.query(query, values);

    return result.rows[0];
};

/**
 * Obtiene TODOS los restaurantes pertenecientes a un usuario.
 * @param {string} userId - El ID del usuario.
 * @returns {Promise<Array>} Un array de restaurantes.
 */
const getRestaurantsByUserId = async (userId) => {
    const query = 'SELECT * FROM restaurants WHERE user_id = $1 ORDER BY created_at DESC';
    const result = await pool.query(query, [userId]);
    
    // Ya no es un error no tener restaurantes, solo devuelve un array vacío
    return result.rows; 
};

/**
 * Obtiene UN restaurante específico por su ID.
 * @param {string} restaurantId - El ID del restaurante.
 * @returns {Promise<object>} El objeto del restaurante.
 */
const getRestaurantById = async (restaurantId) => {
    const query = 'SELECT * FROM restaurants WHERE id = $1';
    const result = await pool.query(query, [restaurantId]);

    if (result.rows.length === 0) {
        const error = new Error('Restaurante no encontrado.');
        error.status = 404;
        throw error;
    }
    return result.rows[0];
};
/**
 * Actualiza los ajustes de un restaurante (ej. WhatsApp).
 * @param {string} restaurantId - El ID del restaurante a actualizar.
 * @param {string} userId - El ID del usuario para verificar propiedad.
 * @param {object} settings - Objeto con los campos a actualizar (ej. { whatsapp_number })
 * @returns {Promise<object>} El restaurante actualizado.
 */
const updateRestaurantSettings = async (restaurantId, userId, settings) => {
    // Obtenemos los campos del body. Usamos '??' para default a null si no vienen.
    const { 
        whatsapp_number = null, 
        address = null, 
        phone_2 = null, 
        opening_hours = {}, // Debe ser un objeto
        notes = null 
    } = settings;

    const query = `
        UPDATE restaurants 
        SET 
            whatsapp_number = $1, 
            address = $2, 
            phone_2 = $3, 
            opening_hours = $4,
            notes = $5
        WHERE id = $6 AND user_id = $7 
        RETURNING *
    `;
    const values = [
        whatsapp_number, 
        address, 
        phone_2, 
        opening_hours, 
        notes, 
        restaurantId, 
        userId
    ];
    
    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
        const error = new Error('No se pudo actualizar el restaurante. No encontrado o sin permisos.');
        error.status = 404; 
        throw error;
    }

    return result.rows[0];
};

// Asegúrate de exportar la new function
module.exports = {
    createRestaurant,
    getRestaurantsByUserId,
    getRestaurantById,
    updateRestaurantSettings, // <-- Añade esto
};