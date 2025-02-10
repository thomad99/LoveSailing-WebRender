const express = require("express");
const { Pool } = require("pg");
const app = express();

app.use(express.json());

const pool = new Pool({
    connectionString: "postgresql://lovesailing_database_user:CPCKCP8PDpLAuypwT2tpyihCJxm44TLN@dpg-cul4lgan91rc73b39n90-a.oregon-postgres.render.com/lovesailing_database"
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

app.listen(5000, () => console.log("Server running on port 5000"));
