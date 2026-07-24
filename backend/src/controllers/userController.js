const UserModel = require('../models/userModel');
const bcrypt = require('bcryptjs');

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
    updateUser: async (req, res) => {
        try {
            const { id } = req.params;
            const { name, email, role } = req.body;

            if (!name || !email || !role) {
                return res.status(400).json({
                    success: false,
                    message: 'Nombre, correo y rol son obligatorios.'
                });
            }

            if (!['admin', 'employee', 'client'].includes(role)) {
                return res.status(400).json({
                    success: false,
                    message: 'Rol inválido. Los roles válidos son: admin, employee, client.'
                });
            }

            const wasUpdated = await UserModel.updateUser(id, { name, email, role });
            if (!wasUpdated) {
                return res.status(404).json({ success: false, message: 'Usuario no encontrado.' });
            }

            res.status(200).json({ success: true, message: 'Usuario actualizado correctamente.' });
        } catch (error) {
            console.error('Error en updateUser:', error);
            res.status(500).json({ success: false, message: 'Error al actualizar el usuario.' });
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
    },

    createUser: async (req, res) => {
        try {
            const { name, email, password, role } = req.body;

            if (!name || !email || !password || !role) {
                return res.status(400).json({
                    success: false,
                    message: 'Todos los campos son obligatorios.'
                });
            }

            if (!['admin', 'employee', 'client'].includes(role)) {
                return res.status(400).json({
                    success: false,
                    message: 'Rol inválido. Los roles válidos son: admin, employee, client.'
                });
            }

            const userExists = await UserModel.findByEmail(email);
            if (userExists) {
                return res.status(400).json({
                    success: false,
                    message: 'El correo electrónico ya está registrado.'
                });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const result = await UserModel.createWithRole(name, email, hashedPassword, role);

            res.status(201).json({
                success: true,
                data: { id: result.insertId, name, email, role }
            });
        } catch (error) {
            console.error('Error en createUser:', error);
            res.status(500).json({ success: false, message: 'Error al crear usuario.' });
        }
    }
};

module.exports = userController;