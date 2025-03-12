const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateUser } = require('../middleware/authMiddleware');

// **Public Routes**
router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);

// **Protected Routes**
router.get('/users/:id', authenticateUser, authController.getUserById);
router.get('/users', authenticateUser, authController.getAllUsers);
router.put('/users/:id', authenticateUser, authController.updateUser);
router.delete('/users/:id', authenticateUser, authController.deleteUser);

module.exports = router;
