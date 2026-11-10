import "@nomicfoundation/hardhat-toolbox";

/** @type import('hardhat/config').HardhatUserConfig */
export default {
  solidity: "0.8.20",
  networks: {
    // Réseau local Hardhat (pour les tests unitaires rapides)
    hardhat: {},
    
    // Réseau Hyperledger Besu QBFT
    besuLocal: {
      url: "http://127.0.0.1:8545",
      chainId: 13371,
      accounts: [
        "0x8f2a55949038a9610f50fb23b5883af3b4ecb3c3bb792cbcefbd1542c692be63"
      ]
    }
  },
};