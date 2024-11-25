// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Importa o pacote CORS
require('dotenv').config();  // Carregar variáveis de ambiente

const app = express();

// Configurar o CORS
app.use(cors({
  origin: 'http://localhost:5173', // Permite apenas o frontend no localhost:5173
  methods: 'GET,POST,PUT,DELETE', // Permite os métodos que seu backend vai aceitar
  allowedHeaders: 'Content-Type,Authorization', // Permite os cabeçalhos que o frontend pode enviar
}));

// Middleware para parsing de JSON
app.use(express.json());

// Conectar ao MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Conectado ao MongoDB');
})
.catch((error) => {
  console.error('Erro ao conectar ao MongoDB:', error);
});

// Rota de exemplo
app.get('/', (req, res) => {
  res.send('Servidor Node.js conectado ao MongoDB');
});

// Porta para rodar o servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

const User = require('./models/User');

// Rota para cadastro de usuário
app.post('/cadastro', async (req, res) => {
  const { email, password } = req.body;
  try {
    const newUser = new User({ email, password });
    await newUser.save();
    res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao cadastrar usuário.' });
  }
});

app.get('/usuario', async (req, res) => {
  const { email, password } = req.query; // Usando query params ao invés de req.body em um GET
  try {
    // Caso o usuário queira buscar por email, faz-se uma consulta filtrada
    const usuario = await User.find({ email: email, password: password });

    if (usuario.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    res.status(200).json({ data: usuario });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao consultar usuário' });
  }
});
