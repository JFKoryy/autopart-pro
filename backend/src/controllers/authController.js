const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');


const authController = {
    
    
//Esta función se usa para registrar usuarios y hashear la contraseña 

    register: async (req, res) => {
        try {
            
            const { name, email, password } = req.body;

            
            if (!name || !email || !password) {
                return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
            }

            
            const userExists = await UserModel.findByEmail(email);
            if (userExists) {
                return res.status(400).json({ message: 'El correo electrónico ya está registrado.' });
            }

            
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            
            await UserModel.create(name, email, hashedPassword);

            
            return res.status(201).json({ 
                message: '¡Usuario registrado con éxito! Ya puedes iniciar sesión.' 
            });

        } catch (error) {
            
            console.error('Error en el registro de usuario:', error);
            return res.status(500).json({ message: 'Error interno del servidor.' });
        }
    },

    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
            }

            const user = await UserModel.findByEmail(email);
            if (!user) {
                return res.status(400).json({ message: 'Credenciales inválidas.' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Credenciales inválidas.' });
            }

            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

            return res.status(200).json({ 
                message: '¡Inicio de sesión exitoso!', 
                token 
            });

        } catch (error) {
            console.error('Error en el inicio de sesión:', error);
            return res.status(500).json({ message: 'Error interno del servidor.' });
        }
    }
};

module.exports = authController;