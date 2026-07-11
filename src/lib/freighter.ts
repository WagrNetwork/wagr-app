import {
  isConnected as freighterIsConnected,
  requestAccess,
  getAddress,
  signTransaction as freighterSignTransaction,
} from '@stellar/freighter-api';
import type { WalletSigner } from '@wagrnetwork/wagr-sdk';

export async function isFreighterInstalled(): Promise<boolean> {
  const { isConnected } = await freighterIsConnected();
  return isConnected;
}

/** Prompt the user to grant this site access to their Freighter wallet, and return their address. */
export async function connectFreighter(): Promise<string> {
  const { address, error } = await requestAccess();
  if (error) throw new Error(error.message ?? 'Freighter access denied');
  return address;
}

/** Return the currently-authorized address, if the site already has access. */
export async function getFreighterAddress(): Promise<string | null> {
  const { address, error } = await getAddress();
  if (error || !address) return null;
  return address;
}

/**
 * Adapt Freighter's extension API into the `WalletSigner` shape WagrSDK
 * expects: Freighter signs and returns `{ signedTxXdr }`, but the SDK (and
 * the underlying `contract.Client`) just wants the signed XDR string back.
 */
export function freighterSigner(address: string, networkPassphrase: string): WalletSigner {
  return {
    publicKey: address,
    signTransaction: async (xdr) => {
      const { signedTxXdr, error } = await freighterSignTransaction(xdr, {
        networkPassphrase,
        address,
      });
      if (error) throw new Error(error.message ?? 'Freighter signing failed');
      return signedTxXdr;
    },
  };
}
