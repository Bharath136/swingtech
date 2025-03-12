// // models/User.js

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database'); // your database configuration

const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    phone: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true,
    }
}, {
    timestamps: true,
    tableName: 'users',
});

module.exports = User;