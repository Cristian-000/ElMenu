// src/services/public.service.js
const pool = require('../config/database');

const getPublicMenuBySlug = async (slug) => {
    const query = `
        SELECT 
            r.id, 
            r.name, 
            r.slug, 
            r.whatsapp_number,
            r.address,          -- CAMBIO
            r.phone_2,          -- CAMBIO
            r.opening_hours,    -- CAMBIO
            r.notes,            -- CAMBIO
            m.menu_data 
        FROM restaurants r
        LEFT JOIN menus m ON r.active_menu_id = m.id
        WHERE r.slug = $1;
    `;
    
    const result = await pool.query(query, [slug]);

    if (result.rows.length === 0) {
        const error = new Error('Restaurante no encontrado.');
        error.status = 404;
        throw error;
    }

    const data = result.rows[0];

    if (!data.menu_data) {
        data.menu_data = { categories: [] };
    }
    
    // Asegurarnos de que opening_hours nunca sea null
    if (!data.opening_hours) {
        data.opening_hours = {};
    }

    return data;
};

module.exports = {
    getPublicMenuBySlug,
};