// src/controllers/menu.controller.js
const menuService = require('../services/menu.service');

// NOTA: Aquí falta la validación de propiedad. 
// Un usuario no debería poder editar menús de un restaurante que no es suyo.
// Lo añadiremos con un middleware de seguridad más adelante.

exports.handleGetMenus = async (req, res, next) => {
    try {
        const { restaurantId } = req.params;
        const menus = await menuService.getMenusByRestaurant(restaurantId);
        res.status(200).json(menus);
    } catch (error) {
        next(error);
    }
};

exports.handleCreateMenu = async (req, res, next) => {
    try {
        const { restaurantId } = req.params;
        const { name } = req.body;
        const newMenu = await menuService.createMenu(restaurantId, name);
        res.status(201).json(newMenu);
    } catch (error) {
        next(error);
    }
};

exports.handleUpdateMenuData = async (req, res, next) => {
    try {
        const { menuId } = req.params;
        const menuData = req.body;
        const updatedMenu = await menuService.updateMenuData(menuId, menuData);
        res.status(200).json(updatedMenu);
    } catch (error) {
        next(error);
    }
};

exports.handleActivateMenu = async (req, res, next) => {
    try {
        const { restaurantId } = req.params;
        const { menuId } = req.body;
        const updatedRestaurant = await menuService.activateMenu(restaurantId, menuId);
        res.status(200).json(updatedRestaurant);
    } catch (error) {
        next(error);
    }
};

exports.handleDeleteMenu = async (req, res, next) => {
    try {
        const { menuId } = req.params;
        await menuService.deleteMenu(menuId);
        res.status(200).json({ message: 'Menú eliminado' });
    } catch (error) {
        next(error);
    }
};