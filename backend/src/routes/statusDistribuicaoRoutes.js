const express = require('express');
const router = express.Router();
const statusDistribuicaoController = require('../controllers/statusDistribuicaoController');

router.get('/', statusDistribuicaoController.getStatusDistribuicao);

module.exports = router;
