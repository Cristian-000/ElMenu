// src/services/menu.service.js
const pool = require('../config/database');

const getMenusByRestaurant = async (restaurantId) => {
    const query = 'SELECT * FROM menus WHERE restaurant_id = $1 ORDER BY created_at DESC';
    return (await pool.query(query, [restaurantId])).rows;
};

const createMenu = async (restaurantId, name) => {
    const query = 'INSERT INTO menus (restaurant_id, name) VALUES ($1, $2) RETURNING *';
    const result = await pool.query(query, [restaurantId, name]);
    return result.rows[0];
};

const updateMenuData = async (menuId, menuData) => {
    const query = 'UPDATE menus SET menu_data = $1 WHERE id = $2 RETURNING *';
    const result = await pool.query(query, [menuData, menuId]);
    return result.rows[0];
};

const activateMenu = async (restaurantId, menuId) => {
    const query = 'UPDATE restaurants SET active_menu_id = $1 WHERE id = $2 RETURNING id, active_menu_id';
    const result = await pool.query(query, [menuId, restaurantId]);
    return result.rows[0];
};

const deleteMenu = async (menuId) => {
    const query = 'DELETE FROM menus WHERE id = $1';
    await pool.query(query, [menuId]);
    return { message: 'Menú eliminado' };
};

module.exports = {
    getMenusByRestaurant,
    createMenu,
    updateMenuData,
    activateMenu,
    deleteMenu,
};