import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { connectFreighter, freighterSigner, getFreighterAddress, isFreighterInstalled } from './freighter';
import type { WalletSigner } from '@wagrnetwork/wagr-sdk';

interface WalletContextValue {
  address: string | null;
  signer: WalletSigner | null;
  isConnecting: boolean;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextValue | null>(null);

const STORAGE_KEY = 'wagr:lastConnectedWallet';

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY) !== 'freighter') return;
    getFreighterAddress().then((addr) => {
      if (addr) setAddress(addr);
    });
  }, []);

  const connect = useCallback(async () => {
    setIsConnecting(true);
    setError(null);
    try {
      const installed = await isFreighterInstalled();
      if (!installed) {
        throw new Error('Freighter wallet extension not found. Install it from freighter.app.');
      }
      const addr = await connectFreighter();
      setAddress(addr);
      localStorage.setItem(STORAGE_KEY, 'freighter');
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setAddress(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const networkPassphrase = import.meta.env.VITE_NETWORK_PASSPHRASE;
  const signer = address ? freighterSigner(address, networkPassphrase) : null;

  return (
    <WalletContext.Provider value={{ address, signer, isConnecting, error, connect, disconnect }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet(): WalletContextValue {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error('useWallet must be used within a WalletProvider');
  return ctx;
}
