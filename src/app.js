const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectToDatabase, sequelize } = require('./config/database')

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/v1/auth', authRoutes);

app.get('/', (req, res) => {
    res.send(`Server is Running on Port : ${PORT}`);
});

connectToDatabase();

(async () => {
    try {
        await sequelize.sync({ force: false });
        console.log("All tables have been successfully created if they didn't already exist.");

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
})();