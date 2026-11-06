const blockchainService = require('../services/blockchain.service');

// POST /api/central-bank/mint
const mintECDF = async (req, res) => {
  try {
    const { contractAddress, toAddress, amount } = req.body;
    if (!contractAddress || !toAddress || !amount) {
      return res.status(400).json({ error: "Tous les champs (contractAddress, toAddress, amount) sont requis." });
    }
    const txHash = await blockchainService.mintTokens(contractAddress, toAddress, amount);
    res.json({ message: "Émission de e-CDF réussie 💸", txHash });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de l'émission", details: error.message });
  }
};

// POST /api/central-bank/burn
const burnECDF = async (req, res) => {
  try {
    const { contractAddress, fromAddress, amount } = req.body;
    if (!contractAddress || !fromAddress || !amount) {
      return res.status(400).json({ error: "Tous les champs sont requis." });
    }
    const txHash = await blockchainService.burnTokens(contractAddress, fromAddress, amount);
    res.json({ message: "Destruction de e-CDF réussie 🔥", txHash });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la destruction", details: error.message });
  }
};

// POST /api/central-bank/freeze
const toggleFreeze = async (req, res) => {
  try {
    const { contractAddress, userAddress, status } = req.body;
    const txHash = await blockchainService.freezeAccount(contractAddress, userAddress, status);
    res.json({ message: `Compte ${status ? 'gelé' : 'dégelé'} avec succès 🧊`, txHash });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors du gel du compte", details: error.message });
  }
};

// GET /api/central-bank/total-supply?contractAddress=0x...
const getTotalSupply = async (req, res) => {
  try {
    const { contractAddress } = req.query;
    if (!contractAddress) return res.status(400).json({ error: "L'adresse du contrat est requise." });
    const totalSupply = await blockchainService.getTotalSupply(contractAddress);
    res.json({ totalSupply });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la lecture de la masse monétaire", details: error.message });
  }
};

module.exports = { mintECDF, burnECDF, toggleFreeze, getTotalSupply };