// src/routes/menu.routes.js
const { Router } = require('express');
const protect = require('../middlewares/auth.middleware');
const { 
    handleGetMenus, 
    handleCreateMenu, 
    handleUpdateMenuData,
    handleActivateMenu,
    handleDeleteMenu
} = require('../controllers/menu.controller');

const router = Router();
router.use(protect);

// Rutas anidadas bajo un restaurante
router.get('/restaurants/:restaurantId/menus', handleGetMenus);
router.post('/restaurants/:restaurantId/menus', handleCreateMenu);
router.put('/restaurants/:restaurantId/activate-menu', handleActivateMenu);

// Rutas específicas de un menú
router.put('/menus/:menuId', handleUpdateMenuData);
router.delete('/menus/:menuId', handleDeleteMenu);

module.exports = router;