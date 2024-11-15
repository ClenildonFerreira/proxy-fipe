const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors()); // Permite CORS
app.use(express.json()); // Permite JSON no corpo da requisição

// Rota principal do proxy (POST)
app.post("/proxy", async (req, res) => {
    const { placa, token } = req.body;

    // Logs para debug
    console.log("Body recebido:", req.body);

    // Validação dos parâmetros
    if (!placa || !token) {
        console.error("Erro: Parâmetros inválidos!");
        return res.status(400).json({ error: "Placa e token são obrigatórios!" });
    }

    try {
        // Fazendo a requisição para a API externa
        console.log("Requisição para API externa com:", { placa, token });
        const response = await axios.post("https://api.placafipe.com.br/getplacafipe", { placa, token });
        res.json(response.data);
    } catch (error) {
        console.error("Erro ao comunicar com API externa:", error.message);
        res.status(500).json({ error: "Erro ao processar a requisição" });
    }
});

// Rota GET para `/proxy` para fins de feedback
app.get("/proxy", (req, res) => {
    res.status(405).json({ message: "Use o método POST para acessar esta rota." });
});

// Rota de diagnóstico
app.get("/health", (req, res) => {
    res.json({ status: "Servidor funcionando corretamente" });
});

// Configuração da porta dinâmica
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
