const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/proxy", async (req, res) => {
    const { placa } = req.body;
    if (!placa || placa.length !== 7) {
        return res.status(400).json({ error: "Placa inválida." });
    }

    try {
        const response = await axios.post("https://api.placafipe.com.br/getplacafipe", req.body);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000; // Porta dinâmica para hospedagem
app.listen(PORT, () => {
    console.log(`Proxy rodando na porta ${PORT}`);
});