require("dotenv").config(); // Load environment variables
const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors()); // Allows Wix to call this API

// PostgreSQL Database Connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL, // Uses the Render environment variable
    ssl: { rejectUnauthorized: false }  // Required for Render PostgreSQL
});

// Test database connection
pool.connect()
    .then(() => console.log("✅ Connected to PostgreSQL!"))
    .catch(err => console.error("❌ Database connection failed:", err));

// API to receive form data from Wix
app.post("/submit", async (req, res) => {
    const { url, email, phone } = req.body;
    try {
        const result = await pool.query(
            "INSERT INTO wix_submissions (url, email, phone) VALUES ($1, $2, $3) RETURNING *",
            [url, email, phone]
        );
        res.status(201).json({ message: "✅ Submission successful!", data: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Root Test Endpoint
app.get("/", (req, res) => {
    res.send("✅ Wix API Server is running!");
});

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
