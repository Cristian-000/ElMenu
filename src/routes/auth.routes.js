// src/routes/auth.routes.js
const { Router } = require('express');
const { body } = require('express-validator');
const { registerUser, loginUser } = require('../controllers/auth.controller');

const router = Router();

// Ruta para registrar un nuevo usuario
// Añadimos validaciones para asegurar la calidad de los datos
router.post(
    '/register',
    [
        body('email', 'El email no es válido').isEmail().normalizeEmail(),
        body('password', 'La contraseña debe tener al menos 6 caracteres').isLength({ min: 6 })
    ],
    registerUser
);

// Ruta para iniciar sesión
router.post(
    '/login',
    [
        body('email', 'El email no es válido').isEmail().normalizeEmail(),
        body('password', 'La contraseña no puede estar vacía').notEmpty()
    ],
    loginUser
);

module.exports = router;