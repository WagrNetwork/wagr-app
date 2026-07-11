import { WagrSDK } from '@wagrnetwork/wagr-sdk';

/** Singleton SDK instance, configured from Vite env vars (see .env.example). */
export const sdk = new WagrSDK({
  escrowContractId: import.meta.env.VITE_ESCROW_CONTRACT_ID,
  resolverContractId: import.meta.env.VITE_RESOLVER_CONTRACT_ID,
  payoutContractId: import.meta.env.VITE_PAYOUT_CONTRACT_ID,
  rpcUrl: import.meta.env.VITE_SOROBAN_RPC_URL,
  networkPassphrase: import.meta.env.VITE_NETWORK_PASSPHRASE,
});
