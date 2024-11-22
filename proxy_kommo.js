const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/kommo", async (req, res) => {
  const { leadId, customFields, token } = req.body;

  // Validação inicial dos parâmetros
  if (!leadId) {
    return res.status(400).json({ error: "ID da lead não fornecido." });
  }
  if (!customFields || !Array.isArray(customFields)) {
    return res.status(400).json({ error: "Campos personalizados inválidos ou ausentes." });
  }
  if (!token) {
    return res.status(400).json({ error: "Token ausente." });
  }

  // Conversão dos campos para o formato esperado pelo Kommo
  const customFieldsValues = customFields.map((field) => ({
    field_id: field.id,
    values: [{ value: field.value }]
  }));

  // Logs detalhados para debugging
  console.log("Payload enviado ao Kommo:", JSON.stringify({ custom_fields_values: customFieldsValues }, null, 2));
  console.log("URL:", `https://cearagpsv4.kommo.com/api/v4/leads/${leadId}`);
  console.log("Headers:", {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  });

  try {
    // Enviar os dados para a API do Kommo
    const response = await axios.patch(
      `https://cearagpsv4.kommo.com/api/v4/leads/${leadId}`,
      { custom_fields_values: customFieldsValues },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Retornar a resposta da API para o cliente
    res.json(response.data);
  } catch (error) {
    const statusCode = error.response ? error.response.status : 500;
    const errorMessage = error.response ? error.response.data : error.message;

    // Log detalhado do erro
    console.error("Erro ao atualizar a lead no Kommo:", errorMessage);

    // Retornar o erro detalhado para o cliente
    res.status(statusCode).json({ error: errorMessage });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Proxy do Kommo rodando em http://0.0.0.0:${PORT}`);
});