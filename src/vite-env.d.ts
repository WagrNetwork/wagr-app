/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SOROBAN_RPC_URL: string;
  readonly VITE_NETWORK_PASSPHRASE: string;
  readonly VITE_ESCROW_CONTRACT_ID: string;
  readonly VITE_RESOLVER_CONTRACT_ID: string;
  readonly VITE_PAYOUT_CONTRACT_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
