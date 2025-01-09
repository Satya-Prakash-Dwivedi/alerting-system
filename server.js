const express = require("express")
const mongoose = require("mongoose")

require('dotenv').config();

const app = express()

// Mongodb connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Mongodb Connected"))
    .catch((err) => console.error("Mongodb connection error", err));

app.use(express.json());

// Routes
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));