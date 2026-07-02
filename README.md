# Wagr App

[![React](https://img.shields.io/badge/react-18-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/typescript-5.0-blue)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/build-vite-purple)](https://vitejs.dev/)

Frontend for Wagr Protocol — match lobby, staking UI, wallet connect, and settlement tracking.

## Overview

Wagr App provides:

1. **Match Lobby** — Create and join wagering matches
2. **Staking UI** — Approve tokens and stake XLM
3. **Wallet Connect** — Freighter, Albedo, and Rabet support
4. **Live Settlement** — Real-time result submission and dispute tracking
5. **Fee Dashboard** — Admin fee collection and withdrawal

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Install

```bash
npm install
```

### Configure

Create `.env.local`:

```
VITE_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org
VITE_NETWORK_PASSPHRASE=Test SDF Network ; September 2015
VITE_ESCROW_CONTRACT_ID=CA...
VITE_RESOLVER_CONTRACT_ID=CB...
VITE_PAYOUT_CONTRACT_ID=CC...
```

### Run Dev Server

```bash
npm run dev
```

Open http://localhost:5173

### Build

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── WalletConnect.tsx      — Connect/disconnect Freighter/Albedo
│   ├── MatchLobby.tsx         — Create/join/list matches
│   ├── StakingForm.tsx        — Approve and stake tokens
│   ├── LiveMatch.tsx          — Watch match, dispute/finalize
│   ├── FeeCollector.tsx       — Admin dashboard (withdraw fees)
│   └── ResultTracker.tsx      — Real-time result and dispute status
├── hooks/
│   ├── useWallet.ts           — Wallet connection state
│   ├── useContract.ts         — Contract interaction
│   ├── useMatch.ts            — Match lifecycle management
│   └── usePolling.ts          — Poll for updates
├── lib/
│   ├── sdk.ts                 — WagrSDK initialization
│   ├── adapters.ts            — Adapter registry
│   └── utils.ts               — Helpers (format, validation, etc)
├── pages/
│   ├── Home.tsx               — Lobby landing
│   ├── Match.tsx              — Individual match view
│   └── Admin.tsx              — Fee management
├── App.tsx
├── main.tsx
└── index.css
```

## Key Features

### Wallet Connect

```tsx
<WalletConnect onConnect={(wallet) => {
  console.log('Connected:', wallet.publicKey);
}} />
```

Supports Freighter, Albedo, and Rabet. Stores connected wallet in localStorage.

### Create Match

```tsx
<MatchLobby
  onCreateMatch={(match) => {
    console.log('Match created:', match.matchId);
  }}
/>
```

Form collects:
- Counterparty address
- Stake amount
- Game type (Lichess, Chess.com, Manual)
- Game ID (auto-filled for Lichess if username provided)

### Live Match Tracking

```tsx
<LiveMatch
  matchId="match-uuid"
  onResultSubmitted={() => console.log('Result in!')}
  onFinalized={(winner) => console.log('Winner:', winner)}
/>
```

Polls resolver contract for:
- Result submission status
- Dispute window countdown
- Finalization
- Payout status

### Admin Dashboard

```tsx
<FeeCollector
  feeBalanceStellar={19.5}
  onWithdraw={(txHash) => {
    console.log('Fees withdrawn:', txHash);
  }}
/>
```

Shows:
- Accumulated fees
- Withdrawal history
- Fee rate (and admin can update)

## Pages

### `/` — Home/Lobby

- List active matches
- Quick "Create Match" button
- Recent matches for logged-in player

### `/match/:matchId` — Match Detail

- Players' details
- Stake amounts
- Live result submission tracker
- Dispute form (if in window)
- Finalize button (if ready)

### `/admin` — Fee Management

- Current fee rate
- Accumulated balance
- Withdrawal button
- Withdrawal history

## Component Examples

### WalletConnect

```tsx
import { WalletConnect } from '@/components/WalletConnect';

export function Header() {
  return <WalletConnect />;
}
```

### Create Match

```tsx
import { MatchLobby } from '@/components/MatchLobby';

export function Home() {
  return (
    <div>
      <h1>Wagr Matches</h1>
      <MatchLobby />
    </div>
  );
}
```

### Live Tracking

```tsx
import { LiveMatch } from '@/components/LiveMatch';
import { useParams } from 'react-router';

export function MatchPage() {
  const { matchId } = useParams();
  return <LiveMatch matchId={matchId!} />;
}
```

## Hooks

### useWallet

```ts
const { wallet, connect, disconnect, isConnected } = useWallet();
```

Manages wallet connection and public key.

### useContract

```ts
const { sdk, callContract, queryContract } = useContract();
```

Initializes WagrSDK and provides typed wrappers for contract calls.

### useMatch

```ts
const {
  match,
  result,
  dispute,
  isLoading,
  error,
} = useMatch(matchId);
```

Fetches and subscribes to match state updates.

### usePolling

```ts
const { data, isLoading } = usePolling(
  async () => await sdk.getMatch(matchId),
  2000, // poll every 2s
);
```

Generic polling hook for live updates.

## Styling

Built with Tailwind CSS. Configuration in `tailwind.config.js`.

Key utilities:
- `btn` — Standard button
- `input-field` — Form input
- `card` — Card container
- `badge` — Status badge

Customize via `globals.css` or Tailwind config.

## Testing

```bash
npm run test
```

Tests use Vitest + React Testing Library.

```ts
import { render, screen } from '@testing-library/react';
import { MatchLobby } from '@/components/MatchLobby';

test('creates a match', () => {
  render(<MatchLobby />);
  expect(screen.getByText('Create Match')).toBeInTheDocument();
});
```

## Build & Deploy

### Development

```bash
npm run dev
```

### Staging

```bash
npm run build:staging
npm run preview
```

### Production

```bash
npm run build
```

Artifacts in `dist/`. Deploy to Vercel, Netlify, or S3.

### Environment-Specific Config

```env.development.local
VITE_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org
```

```env.production.local
VITE_SOROBAN_RPC_URL=https://soroban-mainnet.stellar.org
```

Vite auto-loads correct `.env.*.local` based on `NODE_ENV`.

## Real-time Updates

Uses Soroban event listeners (when available) or polling fallback:

```ts
// Listen for match created events
await sdk.watchMatchEvents('created', (event) => {
  console.log('New match:', event.matchId);
});

// Fallback: poll every 2s
const { data } = usePolling(() => sdk.getMatch(matchId), 2000);
```

## Security

- Never store private keys in app — always use wallet (Freighter, Albedo)
- Validate contract IDs on page load
- Sign all transactions with user's wallet
- HTTPS only in production

## Error Handling

Wrap contract calls in try/catch and show user-friendly errors:

```ts
try {
  const result = await sdk.createMatch(options, wallet);
  if (result.status === 'failed') {
    setError(result.error);
  }
} catch (err) {
  setError(`Connection error: ${err.message}`);
}
```

## Performance

- React Query for caching and background refetch
- Lazy load components (React.lazy)
- Code split by route
- Image optimization (next/image or similar)

Monitor with Lighthouse:
```bash
npm run lighthouse
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

MIT

## Related

- [wagr-contracts](https://github.com/stellar/wagr-contracts) — Core Soroban smart contracts
- [wagr-sdk](https://github.com/stellar/wagr-sdk) — TypeScript SDK and adapters
