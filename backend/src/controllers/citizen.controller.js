// Exemple de fonction de transfert dans citizen.controller.js
exports.transferTokens = async (req, res) => {
    try {
        const { senderPrivateKey, recipientAddress, amount } = req.body;

        // Validation des champs reçus
        if (!senderPrivateKey || !recipientAddress || !amount) {
            return res.status(400).json({ error: "Paramètres manquants (senderPrivateKey, recipientAddress, amount)" });
        }

        // Connexion au réseau blockchain et chargement du contrat avec le portefeuille de l'expéditeur
        const provider = new ethers.JsonRpcProvider(process.env.RPC_URL || "http://127.0.0.1:8545");
        const wallet = new ethers.Wallet(senderPrivateKey, provider);
        
        // Charger le contrat ECDFToken (assure-toi d'importer ton ABI et ton adresse de contrat)
        const contractAddress = process.env.CONTRACT_ADDRESS;
        const ECDFTokenArtifact = require('../../../smart-contracts/artifacts/contracts/ECDFToken.sol/ECDFToken.json');
        const contractABI = ECDFTokenArtifact.abi;
        
        const ecdfContract = new ethers.Contract(contractAddress, contractABI, wallet);

        // Appel de la fonction de transfert Solidity
        // Le smart contract va automatiquement vérifier le KYC et le gel via _update !
        const tx = await ecdfContract.transfer(recipientAddress, ethers.parseUnits(amount.toString(), 18));
        await tx.wait(); // Attendre la confirmation sur la blockchain

        return res.status(200).json({
            success: true,
            message: "Transfert P2P réussi avec succès !",
            txHash: tx.hash
        });

    } catch (error) {
        // Récupérer le message d'erreur du smart contract (ex: "Sender must pass KYC", etc.)
        console.error("Erreur lors du transfert P2P :", error);
        return res.status(500).json({
            error: error.reason || error.message || "Erreur interne du serveur lors du transfert"
        });
    }
};