const express = require('express');
const cors = require('cors');
const path = require('path');
const { errors } = require('celebrate');
const routes = require('./routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));
app.use(routes);
app.use(errors());

// Middleware para tratar rotas não encontradas
app.use((req, res, next) => {
  res.status(404).json({ error: 'Rota não encontrada' })
});

module.exports = app
