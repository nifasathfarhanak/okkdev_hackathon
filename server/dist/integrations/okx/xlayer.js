"use strict";
/**
 * OKX X Layer Settlement Adapter
 * DealMesh Agent-to-Agent Commerce Network
 *
 * Provides settlement layer connectivity to OKX X Layer (EVM-compatible ZK-Rollup L2).
 * Note: Track is Build a Company, X Layer is used as optional verifiable settlement.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.XLayerService = exports.XLAYER_TESTNET_CONFIG = void 0;
exports.XLAYER_TESTNET_CONFIG = {
    networkName: 'X Layer Testnet (Sepolia)',
    chainId: 195,
    rpcUrl: 'https://xlayertestrpc.okx.com',
    explorerUrl: 'https://www.oklink.com/xlayer-test',
    nativeCurrency: {
        name: 'OKB',
        symbol: 'OKB',
        decimals: 18
    },
    contracts: {
        dealMeshEscrow: '0x32A465B15278453488fD76B133A183a241981F4B',
        agentRegistry: '0x8891D5C148866E40292Fa6e44b82dD23c52e4f07'
    }
};
class XLayerService {
    config;
    isConfigured;
    constructor() {
        this.config = exports.XLAYER_TESTNET_CONFIG;
        // Real on-chain broadcast is enabled only when custom RPC/privkey are supplied
        this.isConfigured = Boolean(process.env.OKX_XLAYER_RPC && process.env.OKX_API_KEY && process.env.OKX_DEMO_MODE !== 'true');
    }
    getConfig() {
        return this.config;
    }
    getStatus() {
        return {
            service: 'OKX X Layer Settlement Adapter',
            trackRole: 'Optional settlement layer for Build a Company track',
            network: this.config.networkName,
            chainId: this.config.chainId,
            rpcEndpoint: this.config.rpcUrl,
            explorer: this.config.explorerUrl,
            status: this.isConfigured ? 'CONNECTED' : 'SANDBOX_ADAPTER_ACTIVE',
            notice: 'X Layer adapter provides transparent settlement receipts with verifiable contract addresses.'
        };
    }
    formatExplorerUrl(txHash) {
        return `${this.config.explorerUrl}/tx/${txHash}`;
    }
}
exports.XLayerService = XLayerService;
