const express = require('express');
const produtosRouter = require('./src/routes/produtos');
const usuariosRouter = require('./src/routes/usuarios');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

require('dotenv').config();
app.use(cors());
app.use(express.json());

app.use('/produtos', produtosRouter);
app.use('/usuarios', usuariosRouter);

app.get("/", (req, res) => {
  res.send("Rodando será aqui oi");
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
