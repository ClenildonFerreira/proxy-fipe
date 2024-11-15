const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

// Rota principal do proxy
app.post("/proxy", async (req, res) => {
    const { placa, token } = req.body;

    if (!placa || placa.length !== 7) {
        return res.status(400).json({ error: "Placa inválida. Deve conter 7 caracteres." });
    }

    if (!token) {
        return res.status(400).json({ error: "Token é obrigatório." });
    }

    try {
        console.log("Requisição recebida:", req.body);
        const response = await axios.post("https://api.placafipe.com.br/getplacafipe", { placa, token });
        res.json(response.data);
    } catch (error) {
        console.error("Erro ao acessar a API externa:", error.message);
        res.status(500).json({ error: "Erro ao processar a requisição.", details: error.message });
    }
});

// Rota de saúde para diagnóstico
app.get("/health", (req, res) => {
    res.json({ status: "Servidor funcionando corretamente" });
});

// Porta dinâmica
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Proxy rodando na porta ${PORT}`);
});