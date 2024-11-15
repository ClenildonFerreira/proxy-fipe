const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Middleware para log de requisições
app.use((req, res, next) => {
    console.log(`Requisição recebida - Método: ${req.method}, Rota: ${req.path}`);
    next();
});

// Rota principal do proxy (POST)
app.post("/proxy", async (req, res) => {
    const { placa, token } = req.body;

    console.log("Requisição recebida com:", { placa, token });

    if (!placa || !token) {
        return res.status(400).json({ error: "Placa e token são obrigatórios!" });
    }

    try {
        const response = await axios.post("https://api.placafipe.com.br/getplacafipe", { placa, token });
        console.log("Resposta da API externa:", response.data);
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
            placa: "SBC2H70",
            token: "5548C6220301814C17535EE11FC42D53E9BA471A0F7FA4812F7C9ADA6E22E9F6"
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

// Rota genérica para capturar erros de rotas não encontradas
app.all("*", (req, res) => {
    res.status(404).json({ error: "Rota não encontrada", method: req.method, url: req.url });
});

// Configuração da porta dinâmica
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
