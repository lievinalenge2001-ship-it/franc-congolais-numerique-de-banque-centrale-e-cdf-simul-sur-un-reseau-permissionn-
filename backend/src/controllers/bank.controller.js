const blockchainService = require('../services/blockchain.service');

// POST /api/bank/kyc
const updateCitizenKYC = async (req, res) => {
  try {
    const { contractAddress, citizenAddress, status } = req.body;
    if (!contractAddress || !citizenAddress || status === undefined) {
      return res.status(400).json({ error: "Tous les champs sont requis (contractAddress, citizenAddress, status)." });
    }
    const txHash = await blockchainService.updateKYC(contractAddress, citizenAddress, status);
    res.json({ message: `KYC mis à jour (${status ? 'Approuvé' : 'Révoqué'}) avec succès ✅`, txHash });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la mise à jour du KYC", details: error.message });
  }
};

// GET /api/bank/account-status?contractAddress=0x...&userAddress=0x...
const getAccountStatus = async (req, res) => {
  try {
    const { contractAddress, userAddress } = req.query;
    if (!contractAddress || !userAddress) {
      return res.status(400).json({ error: "L'adresse du contrat et l'adresse du citoyen sont requises." });
    }
    const status = await blockchainService.getAccountStatus(contractAddress, userAddress);
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération du statut du compte", details: error.message });
  }
};

module.exports = { updateCitizenKYC, getAccountStatus };