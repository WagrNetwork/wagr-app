import { useState } from 'react';
import { useQueries } from '@tanstack/react-query';
import { sdk } from '../lib/sdk';
import { getMyMatches } from '../lib/matchStore';
import { useWallet } from '../lib/WalletContext';

export default function History() {
  const { address } = useWallet();
  const [filter, setFilter] = useState<'all' | 'wins' | 'losses'>('all');
  const matchIds = getMyMatches();

  const matchQueries = useQueries({
    queries: matchIds.map((matchId) => ({
      queryKey: ['match', matchId],
      queryFn: () => sdk.getMatch(matchId),
    })),
  });

  const finalized = matchIds
    .map((matchId, i) => ({ matchId, match: matchQueries[i].data }))
    .filter((entry) => entry.match?.status === 'finalized');

  const filtered = finalized.filter((entry) => {
    if (filter === 'all') return true;
    const won = entry.match!.winner === address;
    return filter === 'wins' ? won : !won;
  });

  return (
    <div className="history card">
      <h1 className="text-2xl font-bold mb-4">Match History</h1>
      <div className="filters flex gap-2 mb-4">
        {(['all', 'wins', 'losses'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`btn ${filter === f ? 'btn-primary' : 'btn-secondary'}`}
          >
            {f}
          </button>
        ))}
      </div>
      <table className="w-full text-left">
        <thead>
          <tr>
            <th>Match</th>
            <th>Winner</th>
            <th>Result</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(({ matchId, match }) => (
            <tr key={matchId}>
              <td className="font-mono text-sm">{matchId}</td>
              <td className="font-mono text-sm">{match!.winner}</td>
              <td>{match!.winner === address ? 'win' : 'loss'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {filtered.length === 0 && <p className="text-gray-500 mt-4">No finalized matches yet.</p>}
    </div>
  );
}
