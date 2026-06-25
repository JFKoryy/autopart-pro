const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        // 1. Verificar que el usuario exista en la petición (inyectado por authMiddleware)
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Acceso denegado. No se encontraron roles asignados.'
            });
        }

        // 2. Verificar si el rol del usuario está en la lista de roles permitidos
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Acceso denegado. No tienes los permisos necesarios para realizar esta acción.'
            });
        }

        // ¡Tiene el rol correcto! Sigue adelante
        next();
    };
};
module.exports = { authorize };