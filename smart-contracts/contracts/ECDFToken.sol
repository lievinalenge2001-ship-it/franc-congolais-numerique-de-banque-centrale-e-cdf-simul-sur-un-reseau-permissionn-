// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title ECDFToken
 * @dev Monnaie Numérique de Banque Centrale (e-CDF)
 * Implémente ERC20, AccessControl, Pausable et les règles de conformité (KYC, Plafonds, Gel).
 */
contract ECDFToken is ERC20, ERC20Pausable, AccessControl {
    bytes32 public constant CENTRAL_BANK_ROLE = keccak256("CENTRAL_BANK_ROLE");
    bytes32 public constant COMMERCIAL_BANK_ROLE = keccak256("COMMERCIAL_BANK_ROLE");

    // Plafonds réglementaires (en centimes ou unités de e-CDF)
    uint256 public maxTransactionLimit;
    uint256 public maxHoldingLimit;

    // Listes de conformité
    mapping(address => bool) public kycApproved;
    mapping(address => bool) public frozenAccounts;

    event AccountKYCUpdated(address indexed account, bool status);
    event AccountFrozen(address indexed account, bool status);
    event LimitsUpdated(uint256 maxTx, uint256 maxHold);

    constructor(uint256 initialMaxTx, uint256 initialMaxHold) ERC20("Franc Congolais Digital", "e-CDF") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(CENTRAL_BANK_ROLE, msg.sender);

        maxTransactionLimit = initialMaxTx;
        maxHoldingLimit = initialMaxHold;
    }

    // Validation KYC par la Banque Centrale ou une Banque Commerciale
    function setKYCStatus(address account, bool status) external {
        require(
            hasRole(CENTRAL_BANK_ROLE, msg.sender) || hasRole(COMMERCIAL_BANK_ROLE, msg.sender),
            "Caller must have banking role"
        );
        kycApproved[account] = status;
        emit AccountKYCUpdated(account, status);
    }

    // Gel ou dégel d'un compte citoyen (réservé à la Banque Centrale)
    function setAccountFrozen(address account, bool status) external {
        require(hasRole(CENTRAL_BANK_ROLE, msg.sender), "Only Central Bank can freeze accounts");
        frozenAccounts[account] = status;
        emit AccountFrozen(account, status);
    }

    // Émission (Mint) de e-CDF - Réservé exclusivement à la Banque Centrale
    function mint(address to, uint256 amount) external onlyRole(CENTRAL_BANK_ROLE) {
        require(kycApproved[to], "Recipient must pass KYC");
        require(!frozenAccounts[to], "Recipient account is frozen");
        _mint(to, amount);
    }

    // Destruction (Burn) de e-CDF - Réservé exclusivement à la Banque Centrale
    function burn(address from, uint256 amount) external onlyRole(CENTRAL_BANK_ROLE) {
        _burn(from, amount);
    }

    // Pause d'urgence globale - Réservé à la Banque Centrale
    function pause() external onlyRole(CENTRAL_BANK_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(CENTRAL_BANK_ROLE) {
        _unpause();
    }

    // Mise à jour des plafonds de transaction et de détention
    function setLimits(uint256 newMaxTx, uint256 newMaxHold) external onlyRole(CENTRAL_BANK_ROLE) {
        maxTransactionLimit = newMaxTx;
        maxHoldingLimit = newMaxHold;
        emit LimitsUpdated(newMaxTx, newMaxHold);
    }

    // Hook OpenZeppelin v5 pour intercepter et valider chaque transfert
    function _update(
        address from,
        address to,
        uint256 value
    ) internal virtual override(ERC20, ERC20Pausable) {
        super._update(from, to, value);

        // Si ce n'est ni un mint (from=0) ni un burn (to=0)
        if (from != address(0) && to != address(0)) {
            require(!frozenAccounts[from], "Sender account is frozen");
            require(!frozenAccounts[to], "Recipient account is frozen");
            require(kycApproved[from], "Sender must be KYC approved");
            require(kycApproved[to], "Recipient must be KYC approved");
            require(value <= maxTransactionLimit, "Transaction exceeds maximum limit");
            require(balanceOf(to) <= maxHoldingLimit, "Recipient exceeds maximum holding limit");
        }
    }
}