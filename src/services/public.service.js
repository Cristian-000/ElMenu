// src/services/public.service.js
const pool = require('../config/database');

/**
 * Obtiene los datos de un restaurante y su menú activo
 * para la vista pública, usando el slug.
 * @param {string} slug - El slug del restaurante (ej. "cafe-litoral")
 * @returns {Promise<object>} Un objeto con los datos del restaurante y el JSON del menú.
 */
const getPublicMenuBySlug = async (slug) => {
    const query = `
        SELECT 
            r.id, 
            r.name, 
            r.slug, 
            r.whatsapp_number,
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

    // Si el restaurante existe pero no tiene un menú activo o el menú está vacío
    if (!data.menu_data) {
        data.menu_data = { categories: [] }; // Devuelve un menú vacío en lugar de null
    }

    return data;
};

module.exports = {
    getPublicMenuBySlug,
};