// src/services/restaurant.service.js
const pool = require('../config/database');

/**
 * Crea un nuevo restaurante para un usuario específico.
 * @param {string} userId - El ID del usuario dueño.
 * @param {string} name - El nombre del restaurante.
 * @param {string} slug - El slug único para la URL.
 * @returns {Promise<object>} El restaurante recién creado.
 */
const createRestaurant = async (userId, name, slug) => {
    // 1. Seguridad: Verificar si el slug ya está en uso.
    const existingSlug = await pool.query('SELECT id FROM restaurants WHERE slug = $1', [slug]);
    if (existingSlug.rows.length > 0) {
        const error = new Error('Esta URL (slug) ya está en uso. Por favor, elige otra.');
        error.status = 409; // Conflict
        throw error;
    }

    // 2. Lógica de negocio: Un usuario solo puede tener un restaurante.
    const existingRestaurant = await pool.query('SELECT id FROM restaurants WHERE user_id = $1', [userId]);
    if (existingRestaurant.rows.length > 0) {
        const error = new Error('Ya tienes un restaurante registrado.');
        error.status = 409;
        throw error;
    }

    // 3. Insertar el nuevo restaurante en la base de datos.
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
 * Obtiene el restaurante perteneciente a un usuario.
 * @param {string} userId - El ID del usuario.
 * @returns {Promise<object>} El objeto del restaurante.
 */
const getRestaurantByUserId = async (userId) => {
    const query = 'SELECT * FROM restaurants WHERE user_id = $1';
    const result = await pool.query(query, [userId]);

    if (result.rows.length === 0) {
        const error = new Error('No se encontró un restaurante para este usuario.');
        error.status = 404; // Not Found
        throw error;
    }

    return result.rows[0];
};

/**
 * Actualiza el menú de un restaurante específico.
 * @param {string} userId - El ID del usuario dueño para asegurar permisos.
 * @param {object} menuData - El nuevo objeto JSON del menú.
 * @returns {Promise<object>} El menú actualizado.
 */
const updateMenuByUserId = async (userId, menuData) => {
    const query = `
        UPDATE restaurants 
        SET menu_data = $1 
        WHERE user_id = $2 
        RETURNING id, menu_data
    `;
    const values = [menuData, userId];
    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
        const error = new Error('No se encontró el restaurante para actualizar.');
        error.status = 404;
        throw error;
    }

    return result.rows[0];
};


module.exports = {
    createRestaurant,
    getRestaurantByUserId,
    updateMenuByUserId,
};