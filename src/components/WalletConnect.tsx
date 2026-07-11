import { useWallet } from '../lib/WalletContext';

/**
 * Wallet connection button backed by the Freighter browser extension.
 */
export default function WalletConnect() {
  const { address, isConnecting, error, connect, disconnect } = useWallet();

  if (address) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-white opacity-80">{address.slice(0, 6)}...{address.slice(-4)}</span>
        <button onClick={disconnect} className="btn btn-secondary">
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button onClick={connect} disabled={isConnecting} className="btn btn-primary">
        {isConnecting ? 'Connecting...' : 'Connect Freighter'}
      </button>
      {error && <div className="text-red-200 text-xs">{error}</div>}
    </div>
  );
}
