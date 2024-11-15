
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

// Allowed origins (update YOUR_EXTENSION_ID with your Chrome extension ID)
const allowedOrigins = ["chrome-extension://YOUR_EXTENSION_ID"];

// Middleware for CORS
app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader("Access-Control-Allow-Origin", origin);
    }
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    next();
});

// Middleware to parse JSON
app.use(express.json());

// Endpoint for the proxy
app.post("/proxy", async (req, res) => {
    const { placa, token } = req.body;

    // Input validation
    if (!placa || placa.length !== 7) {
        return res.status(400).json({ error: "Placa inválida. Use o formato AAA2B34." });
    }
    if (!token || typeof token !== "string") {
        return res.status(400).json({ error: "Token inválido ou ausente." });
    }

    try {
        // Forward request to the external API
        const response = await axios.post("https://api.placafipe.com.br/getplacafipe", { placa, token });
        res.json(response.data);
    } catch (error) {
        console.error("Erro na API externa:", error.message);
        res.status(500).json({ error: error.response?.data?.error || "Erro interno do servidor." });
    }
});

// Define dynamic port for Heroku or fallback to 3001 locally
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Proxy rodando na porta ${PORT}.`);
});
