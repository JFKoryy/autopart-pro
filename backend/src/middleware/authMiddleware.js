const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    // 1. Obtener el token desde las cabeceras (Headers) de la petición
    const authHeader = req.headers.authorization;

    // Los tokens JWT estándar se envían como "Bearer <TOKEN>", validamos eso:
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No autorizado, no se proporcionó un token.' });
    }

    // 2. Separar la palabra "Bearer" y quedarnos solo con el string del token
    const token = authHeader.split(' ')[1];

    try {
        // 3. Verificar si el token es válido y no ha expirado
        // Usamos la misma clave secreta que usamos para firmarlo en el login
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 4. Inyectar los datos del usuario descifrados directamente en la petición (req)
        // Así, cualquier ruta que use este middleware sabrá exactamente qué usuario está operando
        req.user = decoded;

        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token no válido o expirado.' });
    }

};


module.exports = protect;