const express = require("express");
const { Pool } = require("pg");
const app = express();

app.use(express.json());

const pool = new Pool({
    connectionString: "postgresql://sail1:5p2GYOeXinvhRvhfOjkK30zItFISFcxs@dpg-culanb8gph6c73d9jl50-a/sail_exks"
});

app.post("/add_url", async (req, res) => {
    const { url, email, phone } = req.body;
    try {
        await pool.query("INSERT INTO monitored_pages (url, email, phone) VALUES ($1, $2, $3)", [url, email, phone]);
        res.status(201).json({ message: "URL added for monitoring" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(5432, () => console.log("Server running on port 5432"));
