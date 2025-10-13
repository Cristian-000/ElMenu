// src/services/auth.service.js
const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Función para registrar un usuario
const register = async (email, password) => {
    // 1. Hashear la contraseña
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 2. Insertar en la base de datos
    const query = 'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email';
    const values = [email, passwordHash];

    try {
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        // Manejar error de email duplicado
        if (error.code === '23505') { 
            const err = new Error('El correo electrónico ya está registrado');
            err.status = 409; // 409 Conflict
            throw err;
        }
        throw error;
    }
};

// Función para iniciar sesión
const login = async (email, password) => {
    // 1. Buscar al usuario por email
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);

    if (result.rows.length === 0) {
        const error = new Error('Credenciales inválidas');
        error.status = 401; // 401 Unauthorized
        throw error;
    }
    
    const user = result.rows[0];

    // 2. Comparar la contraseña enviada con la hasheada
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
        const error = new Error('Credenciales inválidas');
        error.status = 401;
        throw error;
    }

    // 3. Crear el payload para el token
    const payload = {
        user: {
            id: user.id,
            email: user.email
        }
    };

    // 4. Firmar y devolver el token
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    return { 
        token,
        user: {
            id: user.id,
            email: user.email
        }
    };
};

module.exports = {
    register,
    login,
};