import { useParams, Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Asset } from '@stellar/stellar-sdk';
import { sdk } from '../lib/sdk';
import { useWallet } from '../lib/WalletContext';

const XLM_ASSET_ID = Asset.native().contractId(import.meta.env.VITE_NETWORK_PASSPHRASE);

export default function MatchDetail() {
  const { matchId } = useParams<{ matchId: string }>();
  const { address, signer } = useWallet();
  const queryClient = useQueryClient();

  const matchQuery = useQuery({
    queryKey: ['match', matchId],
    queryFn: () => sdk.getMatch(matchId!),
    enabled: !!matchId,
    refetchInterval: 10_000,
  });

  const joinMatch = useMutation({
    mutationFn: async () => {
      if (!signer || !address) throw new Error('Connect your wallet first');
      const amount = Object.values(matchQuery.data?.stakes ?? {})[0] ?? '10000000';
      const result = await sdk.joinMatch(matchId!, address, amount, XLM_ASSET_ID, signer);
      if (result.status === 'failed') throw new Error(result.error);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['match', matchId] }),
  });

  const finalizeMatch = useMutation({
    mutationFn: async () => {
      if (!signer) throw new Error('Connect your wallet first');
      return sdk.finalizeMatch(matchId!, signer);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['match', matchId] }),
  });

  const withdrawWinnings = useMutation({
    mutationFn: async () => {
      if (!signer || !address) throw new Error('Connect your wallet first');
      const result = await sdk.withdrawWinnings({ matchId: matchId!, player: address, asset: XLM_ASSET_ID }, signer);
      if (result.status === 'failed') throw new Error(result.error);
      return result.data;
    },
  });

  if (matchQuery.isLoading) return <div className="card">Loading match...</div>;
  if (matchQuery.isError) {
    return <div className="card text-red-600">Failed to load match: {String(matchQuery.error)}</div>;
  }

  const match = matchQuery.data!;
  const isParticipant = address ? match.players.includes(address) : false;

  return (
    <div className="card space-y-4">
      <h2 className="text-2xl font-bold">Match {matchId}</h2>
      <p>
        Status: <span className="badge badge-warning">{match.status}</span>
      </p>

      <div>
        <h3 className="font-semibold mb-2">Players &amp; Stakes</h3>
        <ul className="space-y-1">
          {match.players.map((player) => (
            <li key={player} className="font-mono text-sm">
              {player} — {(Number(match.stakes[player]) / 10_000_000).toFixed(2)} XLM
            </li>
          ))}
        </ul>
      </div>

      {match.winner && <p>Winner: <span className="font-mono">{match.winner}</span></p>}

      <div className="flex flex-wrap gap-3">
        {match.status === 'pending' && !isParticipant && (
          <button onClick={() => joinMatch.mutate()} disabled={joinMatch.isPending || !signer} className="btn btn-primary">
            {joinMatch.isPending ? 'Joining...' : 'Join Match'}
          </button>
        )}
        <Link to={`/match/${matchId}/dispute`} className="btn btn-secondary">
          File Dispute
        </Link>
        <button onClick={() => finalizeMatch.mutate()} disabled={finalizeMatch.isPending || !signer} className="btn btn-secondary">
          {finalizeMatch.isPending ? 'Finalizing...' : 'Finalize'}
        </button>
        <button
          onClick={() => withdrawWinnings.mutate()}
          disabled={withdrawWinnings.isPending || !signer}
          className="btn btn-primary"
        >
          {withdrawWinnings.isPending ? 'Withdrawing...' : 'Withdraw Winnings'}
        </button>
      </div>

      {(joinMatch.isError || finalizeMatch.isError || withdrawWinnings.isError) && (
        <p className="text-red-600 text-sm">
          {String(joinMatch.error || finalizeMatch.error || withdrawWinnings.error)}
        </p>
      )}
      {withdrawWinnings.isSuccess && (
        <p className="text-green-600 text-sm">
          Withdrew {(Number(withdrawWinnings.data) / 10_000_000).toFixed(2)} XLM
        </p>
      )}
    </div>
  );
}
