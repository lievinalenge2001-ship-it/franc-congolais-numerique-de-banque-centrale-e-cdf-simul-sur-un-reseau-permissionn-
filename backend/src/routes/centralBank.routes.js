const express = require('express');
const router = express.Router();
const { mintECDF, burnECDF, toggleFreeze, getTotalSupply } = require('../controllers/centralBank.controller');

router.post('/mint', mintECDF);
router.post('/burn', burnECDF);
router.post('/freeze', toggleFreeze);
router.get('/total-supply', getTotalSupply);

module.exports = router;