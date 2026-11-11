const express = require('express');
const router = express.Router();
const citizenController = require('../controllers/citizen.controller');

// Route pour effectuer un transfert P2P d'e-CDF
router.post('/transfer', citizenController.transferTokens);

// (Il y a peut-être aussi d'autres routes comme pour consulter le solde)
router.get('/balance/:address', citizenController.getBalance);

module.exports = router;