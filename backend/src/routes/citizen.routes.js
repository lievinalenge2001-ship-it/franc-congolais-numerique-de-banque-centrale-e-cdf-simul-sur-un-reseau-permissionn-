const express = require('express');
const router = express.Router();
const { getWalletBalance } = require('../controllers/citizen.controller');

router.get('/balance', getWalletBalance);

module.exports = router;