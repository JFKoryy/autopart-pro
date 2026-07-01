const UserModel = require('../models/userModel');

const userController = {

    getUsers: async (req, res) => {
        try {
            const users = await UserModel.getAll();
            res.status(200).json({ success: true, data: users });
        } catch (error) {
            console.error('Error en getUsers:', error);
            res.status(500).json({ success: false, message: 'Error al obtener usuarios.' });
        }
    },

    updateRole: async (req, res) => {
        try {
            const { id } = req.params;
            const { role } = req.body;

            if (!['admin', 'employee', 'client'].includes(role)) {
                return res.status(400).json({
                    success: false,
                    message: 'Rol inválido. Los roles válidos son: admin, employee, client.'
                });
            }

            const wasUpdated = await UserModel.updateRole(id, role);
            if (!wasUpdated) {
                return res.status(404).json({ success: false, message: 'Usuario no encontrado.' });
            }

            res.status(200).json({ success: true, message: 'Rol actualizado correctamente.' });
        } catch (error) {
            console.error('Error en updateRole:', error);
            res.status(500).json({ success: false, message: 'Error al actualizar el rol.' });
        }
    },

    deleteUser: async (req, res) => {
        try {
            const { id } = req.params;

            // Evitar que el admin se elimine a sí mismo
            if (parseInt(id) === req.user.id) {
                return res.status(400).json({
                    success: false,
                    message: 'No puedes eliminar tu propia cuenta.'
                });
            }

            await UserModel.deleteUser(id);
            res.status(200).json({ success: true, message: 'Usuario eliminado correctamente.' });
        } catch (error) {
            console.error('Error en deleteUser:', error);
            res.status(500).json({ success: false, message: 'Error al eliminar el usuario.' });
        }
    }
};

module.exports = userController;