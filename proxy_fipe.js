const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/proxy", async (req, res) => {
  const { placa, token } = req.body;

  // Valida se o token e a placa foram fornecidos
  if (!placa || placa.length !== 7) {
    return res.status(400).json({ error: "Placa inválida." });
  }
  if (!token) {
    return res.status(400).json({ error: "Token ausente." });
  }

  try {
    const response = await axios.post("https://api.placafipe.com.br/getplacafipe", {
      placa: placa,
      token: token
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.response ? error.response.data : error.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Proxy rodando em http://0.0.0.0:${PORT}`);
});