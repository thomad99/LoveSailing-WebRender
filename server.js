require("dotenv").config();
const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

// Endpoint to add URLs for monitoring
app.post("/add_url", async (req, res) => {
    const { url, email, phone } = req.body;
    try {
        await pool.query(
            "INSERT INTO monitored_pages (url, email, phone) VALUES ($1, $2, $3)", 
            [url, email, phone]
        );
        res.status(201).json({ message: "URL added for monitoring" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Root endpoint
app.get("/", (req, res) => {
    res.send("Webpage Monitoring API is running!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
