const hre = require("hardhat");

async function main() {
  console.log("🚀 Déploiement de la Monnaie Numérique de Banque Centrale (e-CDF)...");

  // Définition des plafonds réglementaires initiaux (ex: 1 000 000 pour les transactions, 10 000 000 pour la détention)
  const initialMaxTx = hre.ethers.parseUnits("1000000", 18);
  const initialMaxHold = hre.ethers.parseUnits("10000000", 18);

  // Récupération de la factory du contrat
  const ECDFToken = await hre.ethers.getContractFactory("ECDFToken");
  
  // Déploiement du contrat avec les arguments du constructeur
  const ecdfToken = await ECDFToken.deploy(initialMaxTx, initialMaxHold);

  await ecdfToken.waitForDeployment();

  const contractAddress = await ecdfToken.getAddress();
  console.log(`✅ Contrat ECDFToken déployé avec succès !`);
  console.log(`📍 Adresse du contrat : ${contractAddress}`);
}

main().catch((error) => {
  console.error("❌ Erreur lors du déploiement :", error);
  process.exitCode = 1;
});