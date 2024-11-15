const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors()); // Permite CORS
app.use(express.json()); // Permite JSON no corpo da requisição

// Rota principal do proxy
app.post("/proxy", async (req, res) => {
    const { placa, token } = req.body;

    // Validações básicas
    if (!placa || !token) {
        return res.status(400).json({ error: "Placa e token são obrigatórios!" });
    }

    try {
        // Fazendo a requisição para a API externa
        const response = await axios.post("https://api.placafipe.com.br/getplacafipe", { placa, token });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Configuração da porta dinâmica
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
