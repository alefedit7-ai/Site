// index.js — site de status da Voltaris Store (hospedado no Render).
// Recebe os dados do bot via POST (o bot que envia) e exibe pro público via GET.

require('dotenv').config(); // sem efeito no Render (ele injeta as env vars direto), útil só pra testar local

const express = require('express');
const path = require('path');

const app = express();
const porta = process.env.PORT || 8080;
const SEGREDO = process.env.PUSH_SECRET;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let ultimoStatus = {
  online: false,
  botTag: null,
  uptimeMs: 0,
  servidores: 0,
  tickets: { total: 0, abertos: 0, fechados: 0, porCategoria: {} },
  quizRanking: [],
  reacaoRanking: [],
  atualizadoEm: null,
};

// O bot chama essa rota periodicamente pra atualizar os dados.
app.post('/api/push', (req, res) => {
  if (!SEGREDO || req.headers['x-push-secret'] !== SEGREDO) {
    return res.status(401).json({ erro: 'Segredo inválido.' });
  }
  ultimoStatus = { ...req.body, atualizadoEm: new Date().toISOString() };
  res.json({ ok: true });
});

// O site (visitantes) consultam essa rota pra exibir o painel.
app.get('/api/stats', (req, res) => {
  res.json(ultimoStatus);
});

app.listen(porta, () => {
  console.log(`[OK] Site de status rodando na porta ${porta}`);
});
