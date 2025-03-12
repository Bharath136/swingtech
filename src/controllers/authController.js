// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const { Op } = require('sequelize');
// const User = require('../models/User');
// const { sequelize } = require('../config/database'); 


// const JWT_SECRET = process.env.JWT_SECRET ;




// // Login user
// exports.loginUser = async (req, res) => {
//     const { email, password } = req.body;

//     try {

//         const user = await User.findOne({
//             where: { email } 
//         });

//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         const isPasswordValid = await bcrypt.compare(password, user.password);
//         if (!isPasswordValid) {
//             return res.status(401).json({ message: 'Incorrect password' });
//         }

//         const token = jwt.sign(
//             { id: user.id, identifier, role: user.role },
//             JWT_SECRET
//         );

//         res.status(200).json({ message: 'Login successful', token });
//     } catch (error) {
//         res.status(500).json({ message: 'Login failed', error: error.message });
//     }
// };

// // Get a specific user by ID
// exports.getUserById = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const user = await User.findByPk(id);

//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         res.status(200).json(user);
//     } catch (error) {
//         res.status(500).json({ message: 'Error retrieving user', error: error.message });
//     }
// };


// exports.getAllUsers = async (req, res) => {
//     const { page = 1, limit = 10 } = req.query;

//     try {
//         const users = await User.findAll({
//             limit,
//             offset: (page - 1) * limit
//         });
//         res.status(200).json(users);
//     } catch (error) {
//         res.status(500).json({ message: 'Error retrieving users', error: error.message });
//     }
// };

// // Update a user's details
// exports.updateUser = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const {name, email, phone, password} = req.body;

//         const user = await User.findByPk(id);
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         // Update user information
//         await user.update({
//             name,
//             email,
//             password,
//             phone,
//         });

//         res.status(200).json({ message: 'User updated successfully', user });
//     } catch (error) {
//         res.status(500).json({ message: 'Error updating user', error: error.message });
//     }
// };

// // Delete a user
// exports.deleteUser = async (req, res) => {
//     try {
//         const { id } = req.params;

//         const user = await User.findByPk(id);
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         await user.destroy();
//         res.status(200).json({ message: 'User deleted successfully' });
//     } catch (error) {
//         res.status(500).json({ message: 'Error deleting user', error: error.message });
//     }
// };


const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const User = require('../models/User'); // Import User model
const { sequelize } = require('../config/database');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// ✅ **User Registration**
exports.registerUser = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = await User.create({
            name,
            email,
            phone,
            password: hashedPassword, // Store hashed password
        });

        res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Registration failed', error: error.message });
    }
};

// ✅ **User Login**
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Incorrect password' });
        }

        // Generate JWT Token
        const token = jwt.sign(
            { id: user.id, role: user.role },
            JWT_SECRET,
            { expiresIn: '1d' } // Token valid for 1 day
        );

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ message: 'Login failed', error: error.message });
    }
};

// ✅ **Get User by ID (Protected Route)**
exports.getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving user', error: error.message });
    }
};

// ✅ **Get All Users**
exports.getAllUsers = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const users = await User.findAll({
            limit: parseInt(limit),
            offset: (page - 1) * parseInt(limit)
        });

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving users', error: error.message });
    }
};

// ✅ **Update User**
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phone, password } = req.body;

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Hash new password if provided
        if (password) {
            user.password = await bcrypt.hash(password, 10);
        }

        // Update user information
        await user.update({ name, email, phone });

        res.status(200).json({ message: 'User updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error: error.message });
    }
};

// ✅ **Delete User**
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await user.destroy();
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
};
