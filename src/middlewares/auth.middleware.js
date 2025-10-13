// src/middlewares/auth.middleware.js
const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    // 1. Obtener el token del header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No autorizado, token no encontrado' });
    }

    const token = authHeader.split(' ')[1];

    try {
        // 2. Verificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 3. Añadir el usuario del payload a la petición
        req.user = decoded.user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'No autorizado, el token no es válido' });
    }
};

module.exports = protect;