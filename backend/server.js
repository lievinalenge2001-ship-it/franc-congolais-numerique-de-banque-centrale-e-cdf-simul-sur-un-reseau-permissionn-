const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { ethers } = require('ethers');

// Chargement des variables d'environnement
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const RPC_URL = process.env.RPC_URL || 'http://127.0.0.1:8545';

// Middlewares
app.use(cors());
app.use(express.json());

// Connexion au provider Blockchain (Nœud Besu de la Banque Centrale)
const provider = new ethers.JsonRpcProvider(RPC_URL);

// Route de santé (Health Check)
app.get('/', async (req, res) => {
  try {
    const network = await provider.getNetwork();
    const blockNumber = await provider.getBlockNumber();
    
    res.json({
      status: 'online',
      message: 'API Backend e-CDF opérationnelle 🚀',
      blockchain: {
        chainId: network.chainId.toString(),
        latestBlock: blockNumber,
        rpcUrl: RPC_URL
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Impossible de contacter le nœud Besu local',
      error: error.message
    });
  }
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`=================================`);
  console.log(`🚀 Serveur Backend e-CDF démarré sur le port ${PORT}`);
  console.log(`🔗 Connexion RPC Blockchain : ${RPC_URL}`);
  console.log(`=================================`);
});