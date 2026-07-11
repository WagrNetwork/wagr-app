import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Asset } from '@stellar/stellar-sdk';
import { sdk } from '../lib/sdk';
import { useWallet } from '../lib/WalletContext';
import { recordMatch, getMyMatches } from '../lib/matchStore';
import { analytics } from '../lib/analytics';

interface MatchLobbyProps {
  walletAddress: string;
}

const XLM_ASSET_ID = Asset.native().contractId(import.meta.env.VITE_NETWORK_PASSPHRASE);

/**
 * Match lobby for creating and joining escrow-staked matches.
 */
export default function MatchLobby({ walletAddress }: MatchLobbyProps) {
  const { signer } = useWallet();
  const [counterparty, setCounterparty] = useState('');
  const [amount, setAmount] = useState('1');
  const [gameType, setGameType] = useState<'lichess' | 'chesscom' | 'manual'>('lichess');
  const [gameId, setGameId] = useState('');
  const [myMatches, setMyMatches] = useState<string[]>(getMyMatches());
  const [lastError, setLastError] = useState<string | null>(null);

  const createMatch = useMutation({
    mutationFn: async () => {
      if (!signer) throw new Error('Connect your wallet first');
      const stroops = String(Math.round(parseFloat(amount) * 10_000_000));

      const result = await sdk.createMatch(
        {
          player1: walletAddress,
          player2: counterparty,
          amount: stroops,
          asset: XLM_ASSET_ID,
          gameType,
          gameId,
        },
        signer,
      );

      if (result.status === 'failed' || !result.data) {
        throw new Error(result.error ?? 'Match creation failed');
      }
      return result.data;
    },
    onSuccess: (match) => {
      recordMatch(match.matchId);
      setMyMatches(getMyMatches());
      analytics.track('match_created', { matchId: match.matchId, gameType });
      setCounterparty('');
      setAmount('1');
      setGameId('');
      setLastError(null);
    },
    onError: (err) => setLastError(err instanceof Error ? err.message : String(err)),
  });

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-2xl font-bold mb-6">Create Match</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            createMatch.mutate();
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-semibold mb-2">Counterparty Address</label>
            <input
              type="text"
              value={counterparty}
              onChange={(e) => setCounterparty(e.target.value)}
              placeholder="G..."
              className="input-field w-full"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Stake Amount (XLM)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0.1"
                step="0.1"
                className="input-field w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Game Type</label>
              <select
                value={gameType}
                onChange={(e) => setGameType(e.target.value as typeof gameType)}
                className="input-field w-full"
              >
                <option value="lichess">Lichess</option>
                <option value="chesscom">Chess.com</option>
                <option value="manual">Manual Report</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Game ID</label>
            <input
              type="text"
              value={gameId}
              onChange={(e) => setGameId(e.target.value)}
              placeholder={gameType === 'lichess' ? 'abc123def456' : 'game-id'}
              className="input-field w-full"
              required
            />
          </div>

          {lastError && <div className="text-red-600 text-sm">{lastError}</div>}

          <button type="submit" disabled={createMatch.isPending || !signer} className="btn btn-primary w-full">
            {!signer ? 'Connect wallet to create a match' : createMatch.isPending ? 'Staking...' : 'Create Match'}
          </button>
        </form>
      </div>

      {myMatches.length > 0 && (
        <div className="card">
          <h2 className="text-2xl font-bold mb-6">Your Matches</h2>
          <div className="space-y-4">
            {myMatches.map((matchId) => (
              <div
                key={matchId}
                className="border border-gray-200 rounded-lg p-4 flex justify-between items-center"
              >
                <p className="font-mono text-sm">{matchId}</p>
                <a href={`/match/${matchId}`} className="text-blue-600 hover:underline text-sm">
                  View
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
