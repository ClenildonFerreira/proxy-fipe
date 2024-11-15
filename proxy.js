
const express = require('express');
const app = express();
const cors = require('cors');
const axios = require('axios');

app.use(cors());
app.use(express.json());

app.post('/proxy', async (req, res) => {
    const { placa, token } = req.body;

    if (!placa || !token) {
        return res.status(400).json({ error: 'Placa e token são obrigatórios!' });
    }

    try {
        const response = await axios.post('https://api.original-url.com', { placa, token });
        res.json(response.data);
    } catch (error) {
        console.error('Erro ao realizar a requisição:', error.message);
        res.status(500).json({ error: 'Erro ao processar a requisição' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Proxy rodando na porta ${PORT}`);
});
