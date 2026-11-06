const { ethers } = require('ethers');
const dotenv = require('dotenv');

dotenv.config();

// ABI minimale du contrat ECDFToken pour interagir avec l'API
const ECDFTokenABI = [
  "function balanceOf(address account) external view returns (uint256)",
  "function totalSupply() external view returns (uint256)",
  "function kycApproved(address account) external view returns (bool)",
  "function frozenAccounts(address account) external view returns (bool)",
  "function setKYCStatus(address account, bool status) external",
  "function setAccountFrozen(address account, bool status) external",
  "function mint(address to, uint256 amount) external",
  "function burn(address from, uint256 amount) external",
  "function maxTransactionLimit() external view returns (uint256)",
  "function maxHoldingLimit() external view returns (uint256)"
];

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL || 'http://127.0.0.1:8545');

// Signer administrateur (Banque Centrale)
const adminWallet = process.env.CENTRAL_BANK_PRIVATE_KEY
  ? new ethers.Wallet(process.env.CENTRAL_BANK_PRIVATE_KEY, provider)
  : null;

/**
 * Obtenir une instance du contrat (lecture seule ou écriture)
 */
const getContract = (contractAddress, withSigner = false) => {
  if (withSigner) {
    if (!adminWallet) throw new Error("Clé privée Banque Centrale non configurée dans .env");
    return new ethers.Contract(contractAddress, ECDFTokenABI, adminWallet);
  }
  return new ethers.Contract(contractAddress, ECDFTokenABI, provider);
};

// --- SERVICES DE LECTURE ---

const getBalance = async (contractAddress, userAddress) => {
  const contract = getContract(contractAddress);
  const balance = await contract.balanceOf(userAddress);
  return ethers.formatUnits(balance, 18);
};

const getTotalSupply = async (contractAddress) => {
  const contract = getContract(contractAddress);
  const supply = await contract.totalSupply();
  return ethers.formatUnits(supply, 18);
};

const getAccountStatus = async (contractAddress, userAddress) => {
  const contract = getContract(contractAddress);
  const isKyc = await contract.kycApproved(userAddress);
  const isFrozen = await contract.frozenAccounts(userAddress);
  return { isKyc, isFrozen };
};

// --- SERVICES D'ÉCRITURE (RÉSERVÉS BANQUE CENTRALE / COMMERCIALES) ---

const mintTokens = async (contractAddress, toAddress, amount) => {
  const contract = getContract(contractAddress, true);
  const amountParsed = ethers.parseUnits(amount.toString(), 18);
  const tx = await contract.mint(toAddress, amountParsed);
  await tx.wait();
  return tx.hash;
};

const burnTokens = async (contractAddress, fromAddress, amount) => {
  const contract = getContract(contractAddress, true);
  const amountParsed = ethers.parseUnits(amount.toString(), 18);
  const tx = await contract.burn(fromAddress, amountParsed);
  await tx.wait();
  return tx.hash;
};

const updateKYC = async (contractAddress, userAddress, status) => {
  const contract = getContract(contractAddress, true);
  const tx = await contract.setKYCStatus(userAddress, status);
  await tx.wait();
  return tx.hash;
};

const freezeAccount = async (contractAddress, userAddress, status) => {
  const contract = getContract(contractAddress, true);
  const tx = await contract.setAccountFrozen(userAddress, status);
  await tx.wait();
  return tx.hash;
};

module.exports = {
  getBalance,
  getTotalSupply,
  getAccountStatus,
  mintTokens,
  burnTokens,
  updateKYC,
  freezeAccount
};