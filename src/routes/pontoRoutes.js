const express = require('express');
const router = express.Router();
const pontoController = require('../controllers/pontoController');

router.post('/ponto', pontoController.registrarPonto);

module.exports = router;
