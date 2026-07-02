export interface WalletConfig {
  type: 'freighter' | 'albedo' | 'rabet';
  network: 'testnet' | 'mainnet';
}

export class WalletService {
  private config: WalletConfig;
  private isConnected: boolean = false;

  constructor(config: WalletConfig) {
    this.config = config;
  }

  async connect(): Promise<string> {
    const pubKey = await this.getPublicKey();
    this.isConnected = true;
    return pubKey;
  }

  async disconnect(): Promise<void> {
    this.isConnected = false;
  }

  async getPublicKey(): Promise<string> {
    if (this.config.type === 'freighter') {
      return (window as any).freighter?.getPublicKey?.() || '';
    }
    if (this.config.type === 'albedo') {
      return (window as any).albedo?.getPublicKey?.() || '';
    }
    return '';
  }

  async signTransaction(tx: string): Promise<string> {
    return '';
  }

  isConnectedTo(): boolean {
    return this.isConnected;
  }
}
