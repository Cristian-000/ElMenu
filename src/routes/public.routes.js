// src/routes/public.routes.js
const { Router } = require('express');
const { handleGetPublicMenu } = require('../controllers/public.controller');

const router = Router();

// Esta es la ruta que leerá el cliente final
router.get('/menu/:slug', handleGetPublicMenu);

module.exports = router;