const express = require('express');
const router = express.Router();

const taxaConversaoRoutes = require('./taxaConversaoRoutes');
const statusDistribuicaoRoutes = require('./statusDistribuicaoRoutes');

router.use('/taxa-conversao', taxaConversaoRoutes);
router.use('/status-distribuicao', statusDistribuicaoRoutes);

router.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', timestamp: new Date() });
});

module.exports = router;
