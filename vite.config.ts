/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/setupTests.ts'],
    // Placeholder contract IDs so modules that build the SDK singleton can be
    // imported in tests. No network calls are made against them.
    env: {
      VITE_SOROBAN_RPC_URL: 'https://soroban-testnet.stellar.org',
      VITE_NETWORK_PASSPHRASE: 'Test SDF Network ; September 2015',
      VITE_ESCROW_CONTRACT_ID: 'CTESTESCROW',
      VITE_RESOLVER_CONTRACT_ID: 'CTESTRESOLVER',
      VITE_PAYOUT_CONTRACT_ID: 'CTESTPAYOUT',
    },
  },
})
