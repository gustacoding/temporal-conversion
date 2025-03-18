const express = require('express');
const router = express.Router();
const taxaConversaoController = require('../controllers/taxaConversaoController');

router.get('/', taxaConversaoController.getTaxaConversao);

module.exports = router;
