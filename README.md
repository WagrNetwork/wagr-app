# Wagr App

[![React](https://img.shields.io/badge/react-18-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/typescript-5.0-blue)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/build-vite-purple)](https://vitejs.dev/)

[![CI](https://github.com/WagrNetwork/wagr-app/actions/workflows/ci.yml/badge.svg)](https://github.com/WagrNetwork/wagr-app/actions/workflows/ci.yml)

Reference web app for Wagr Protocol: trustless escrow and settlement for competitive matches on Stellar. Lock stakes in a Soroban escrow, track oracle-reported results and disputes, and withdraw settled payouts, using [wagr-sdk](https://github.com/WagrNetwork/wagr-sdk).

**Live demo (Stellar testnet):** https://wagrnetwork.github.io/wagr-app/ — connect Freighter set to Testnet.

`npm install` pulls the SDK straight from GitHub, so no sibling checkout is needed. If `.env` is missing, the app shows which settings to fill in instead of a blank page.

## Overview

- **Match Lobby** (`/`) — create a match (stakes into escrow) and join existing ones
- **Dashboard** (`/dashboard`) — matches you've created/joined, live-refreshed via on-chain events
- **Match Detail** (`/match/:matchId`) — join, dispute, finalize, withdraw
- **Dispute** (`/match/:matchId/dispute`) — file a dispute (only the recorded loser can succeed, enforced on-chain)
- **Fees** (`/fees`) — view/withdraw accumulated protocol fees (withdrawal succeeds only for the payout contract's fee collector)
- **History** (`/history`) — your finalized matches, win/loss
- **Settings** (`/settings`) — theme, local prefs

Wallet connection is via the [Freighter](https://freighter.app) browser extension only. Freighter never exposes your private key — it signs transactions itself and hands back signed XDR — so the SDK accepts a `WalletSigner` (a `{ publicKey, signTransaction }` pair) anywhere it needs a signer, in addition to a raw `Keypair` for server-side/oracle use.

The app has no backend of its own: match/result/dispute state lives entirely in the three Soroban contracts. Since escrow has no reverse index of "which matches is this player in," the app tracks match IDs the current browser has created/joined in `localStorage` (`src/lib/matchStore.ts`) and queries live state per match ID.

## Quick Start

### Prerequisites

- Node.js 18+
- [Freighter](https://freighter.app) browser extension, for actually connecting a wallet

### Install

```bash
npm install
```

### Configure

`.env.example` already points at the live [testnet deployment](https://github.com/WagrNetwork/wagr-contracts#testnet-deployment), so this is enough to run against testnet:

```bash
cp .env.example .env
```

To use your own deployment, replace the three contract IDs with yours.

### Run

```bash
npm run dev
```

Open http://localhost:5173

### Build

```bash
npm run build
npm run preview
```

## Project structure

```
src/
├── components/
│   ├── WalletConnect.tsx   — Freighter connect/disconnect button
│   ├── MatchLobby.tsx      — create/list matches
│   └── DisputeForm.tsx     — evidence submission form
├── pages/
│   ├── Dashboard.tsx       — your matches, live via subscribeToEvents
│   ├── MatchDetail.tsx     — join / finalize / withdraw for one match
│   ├── Dispute.tsx         — wraps DisputeForm, submits via the SDK
│   ├── Fees.tsx            — fee balance + withdrawal
│   ├── History.tsx         — finalized matches, win/loss
│   └── Settings.tsx        — theme + local prefs
├── lib/
│   ├── sdk.ts              — WagrSDK singleton, configured from env vars
│   ├── freighter.ts        — Freighter API adapter → WagrSDK WalletSigner
│   ├── WalletContext.tsx   — React context wrapping the connected wallet
│   ├── matchStore.ts       — localStorage-backed "my matches" index
│   └── analytics.ts        — shared AnalyticsService instance
├── hooks/
│   ├── useDarkMode.ts
│   └── useRealtimeUpdates.ts
├── App.tsx                 — routes + nav
└── main.tsx                — providers: React Query, WalletProvider, BrowserRouter
```

## Testing

```bash
npm test
```

Uses Vitest + React Testing Library + jsdom. `WalletConnect` and `App` tests mock `useWallet` to exercise the connected/disconnected states without a real extension.

## Deploy

```bash
npm run build
```

Artifacts in `dist/` — deploy to any static host (Vercel, Netlify, S3 + CloudFront, etc). There's no server-side component.

## Security

- The app never handles private keys — Freighter signs everything, the app only ever sees public keys and signed XDR
- All contract-mutating actions are signed by the connected wallet; the contracts themselves enforce authorization (e.g. only the recorded loser can dispute, only the payout contract's arbiter can settle)
- Contract IDs come from build-time env vars, not user input

## Related

- [wagr-contracts](https://github.com/WagrNetwork/wagr-contracts) — Core Soroban smart contracts
- [wagr-sdk](https://github.com/WagrNetwork/wagr-sdk) — TypeScript SDK and adapters
