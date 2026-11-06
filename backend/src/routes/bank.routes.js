const express = require('express');
const router = express.Router();
const { updateCitizenKYC, getAccountStatus } = require('../controllers/bank.controller');

router.post('/kyc', updateCitizenKYC);
router.get('/account-status', getAccountStatus);

module.exports = router;