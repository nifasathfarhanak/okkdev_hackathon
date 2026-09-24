/**
 * OKX X Layer Settlement Adapter
 * DealMesh Agent-to-Agent Commerce Network
 * 
 * Provides settlement layer connectivity to OKX X Layer (EVM-compatible ZK-Rollup L2).
 * Note: Track is Build a Company, X Layer is used as optional verifiable settlement.
 */

export interface XLayerNetworkConfig {
  networkName: string;
  chainId: number;
  rpcUrl: string;
  explorerUrl: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  contracts: {
    dealMeshEscrow: string;
    agentRegistry: string;
  };
}

export const XLAYER_TESTNET_CONFIG: XLayerNetworkConfig = {
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

export class XLayerService {
  private config: XLayerNetworkConfig;
  private isConfigured: boolean;

  constructor() {
    this.config = XLAYER_TESTNET_CONFIG;
    // Real on-chain broadcast is enabled only when custom RPC/privkey are supplied
    this.isConfigured = Boolean(process.env.OKX_XLAYER_RPC && process.env.OKX_API_KEY && process.env.OKX_DEMO_MODE !== 'true');
  }

  public getConfig(): XLayerNetworkConfig {
    return this.config;
  }

  public getStatus() {
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

  public formatExplorerUrl(txHash: string): string {
    return `${this.config.explorerUrl}/tx/${txHash}`;
  }
}
