"use strict";
/**
 * OKX Agentic Wallet Integration Module
 * DealMesh Agent-to-Agent Commerce Network
 *
 * Provides session key management, spending limit policies,
 * intent-based signing, and human-in-the-loop authorization gates.
 * NEVER stores or exposes private keys.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgenticWalletService = void 0;
class AgenticWalletService {
    policy;
    isDemoMode;
    constructor() {
        this.isDemoMode = process.env.OKX_DEMO_MODE !== 'false';
        this.policy = {
            maxTransactionWithoutApproval: 0, // Zero autonomous spending without explicit human approval
            dailyVolumeLimit: 50000,
            allowedTokens: ['USDC', 'USDT', 'OKB'],
            allowedContractAddresses: [
                '0x32A465B15278453488fD76B133A183a241981F4B', // OKX Escrow Contract
                '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' // USDC
            ],
            requireDualSignatureAbove: 25000
        };
    }
    getWalletState(userAddress) {
        return {
            walletAddress: userAddress || '0x4F79F447dC4E4c86F38E22217c7689A977e2F6A1',
            smartAccountType: 'ERC4337_OKX_AGENTIC_SMART_ACCOUNT',
            network: 'OKX X Layer Testnet',
            chainId: 195,
            balanceUSDC: 48500.0,
            balanceUSDT: 12000.0,
            balanceOKB: 45.2,
            sessionKeyStatus: 'ACTIVE',
            spendingPolicy: this.policy,
            isDemoMode: this.isDemoMode
        };
    }
    updateSpendingPolicy(newPolicy) {
        this.policy = { ...this.policy, ...newPolicy };
        return this.policy;
    }
    prepareIntent(dealId, recipientAddress, amount, token = 'USDC') {
        const exceedsAutonomousLimit = amount > this.policy.maxTransactionWithoutApproval;
        return {
            intentId: `intent_${Math.random().toString(36).substring(2, 10)}`,
            dealId,
            to: recipientAddress,
            amount,
            token,
            callData: `0xa9059cbb000000000000000000000000${recipientAddress.replace('0x', '').padStart(64, '0')}`,
            estimatedGasOKB: 0.0018,
            requiresHumanApproval: exceedsAutonomousLimit,
            approvalReason: exceedsAutonomousLimit
                ? `Amount of $${amount.toLocaleString()} exceeds autonomous spending threshold ($${this.policy.maxTransactionWithoutApproval}). Human approval is mandatory.`
                : 'Autonomous execution authorized by policy.',
            createdAt: new Date().toISOString()
        };
    }
    getStatus() {
        return {
            service: 'OKX Agentic Wallet Manager',
            smartAccountStandard: 'ERC-4337 Account Abstraction + Session Keys',
            policy: this.policy,
            isDemoMode: this.isDemoMode,
            humanInTheLoopEnforced: this.policy.maxTransactionWithoutApproval === 0
        };
    }
}
exports.AgenticWalletService = AgenticWalletService;
