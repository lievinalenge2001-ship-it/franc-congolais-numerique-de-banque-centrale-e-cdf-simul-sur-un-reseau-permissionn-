const blockchainService = require('../services/blockchain.service');

// GET /api/citizen/balance?contractAddress=0x...&userAddress=0x...
const getWalletBalance = async (req, res) => {
  try {
    const { contractAddress, userAddress } = req.query;
    if (!contractAddress || !userAddress) {
      return res.status(400).json({ error: "L'adresse du contrat et l'adresse du citoyen sont requises." });
    }
    const balance = await blockchainService.getBalance(contractAddress, userAddress);
    res.json({ balance, currency: "e-CDF" });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération du solde", details: error.message });
  }
};

module.exports = { getWalletBalance };