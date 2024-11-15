
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors()); // Permite CORS
app.use(express.json()); // Permite JSON no corpo da requisição

// Rota principal do proxy (POST)
app.post("/proxy", async (req, res) => {
    const { placa, token } = req.body;

    console.log("Body recebido:", req.body);

    if (!placa || !token) {
        return res.status(400).json({ error: "Placa e token são obrigatórios!" });
    }

    try {
        const response = await axios.post("https://api.placafipe.com.br/getplacafipe", { placa, token });
        res.json(response.data);
    } catch (error) {
        console.error("Erro ao comunicar com API externa:", error.message);
        res.status(500).json({ error: "Erro ao processar a requisição", details: error.message });
    }
});

// Rota de diagnóstico para testar conexão com API externa
app.get("/test-api", async (req, res) => {
    try {
        const response = await axios.post("https://api.placafipe.com.br/getplacafipe", {
            placa: "ABC1234",
            token: "56486C229830181C41F53EE1FC42D53E9BA471A0F7FA4812F7C9ADA62E29F6"
        });
        res.json(response.data);
    } catch (error) {
        console.error("Erro ao acessar API externa:", error.message);
        res.status(500).json({ error: "Erro ao acessar API externa", details: error.message });
    }
});

// Rota de diagnóstico para verificar o status do servidor
app.get("/health", (req, res) => {
    res.json({ status: "Servidor funcionando corretamente" });
});

// Configuração da porta dinâmica
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
