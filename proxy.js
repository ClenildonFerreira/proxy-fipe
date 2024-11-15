const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000; // Porta padrão 3000 ou definida pelo ambiente

// Middleware para habilitar CORS e suporte a JSON
app.use(cors());
app.use(express.json());

// Rota principal para o proxy
app.post("/proxy", async (req, res) => {
  const { placa, token } = req.body; // Recebe "placa" e "token" do cliente

  // Validação de entrada
  if (!placa || placa.length !== 7 || !token) {
    return res.status(400).json({ error: "Placa inválida ou token ausente." });
  }

  try {
    // Faz requisição para a API da FIPE
    const response = await axios.post(
      "https://api.placafipe.com.br/getplacafipe",
      { placa },
      {
        headers: {
          Authorization: `Bearer ${token}`, // Envia o token de autenticação
        },
      }
    );

    // Retorna a resposta da API FIPE ao cliente
    res.status(response.status).json(response.data);
  } catch (error) {
    // Captura erros e os retorna ao cliente
    const status = error.response ? error.response.status : 500;
    const errorMessage = error.response ? error.response.data : error.message;

    res.status(status).json({
      error: "Erro ao consultar a API FIPE.",
      details: errorMessage,
    });
  }
});

// Inicia o servidor na porta 0.0.0.0 para permitir acesso externo
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Proxy rodando em http://0.0.0.0:${PORT}`);
});
