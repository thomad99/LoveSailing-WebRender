require("dotenv").config(); // Load environment variables
const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors()); // Allow cross-origin requests (Wix form can submit data)

// PostgreSQL Connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL || "postgresql://sail1:5p2GYOeXinvhRvhfOjkK30zItFISFcxs@dpg-culanb8gph6c73d9jl50-a/sail_exks",
    ssl: { rejectUnauthorized: false }  // Required for cloud PostgreSQL
});

// Test database connection
pool.connect()
    .then(() => console.log("✅ Connected to PostgreSQL!"))
    .catch(err => console.error("❌ Database connection failed:", err));

// API to handle form submissions from Wix
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

// Root test endpoint
app.get("/", (req, res) => {
    res.send("✅ Wix API Server is running!");
});

// Start Express server on the correct port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
