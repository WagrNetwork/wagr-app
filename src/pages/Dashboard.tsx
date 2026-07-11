import { useEffect } from 'react';
import { useQueries, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { sdk } from '../lib/sdk';
import { getMyMatches } from '../lib/matchStore';

export default function Dashboard() {
  const matchIds = getMyMatches();
  const queryClient = useQueryClient();

  const matchQueries = useQueries({
    queries: matchIds.map((matchId) => ({
      queryKey: ['match', matchId],
      queryFn: () => sdk.getMatch(matchId),
    })),
  });

  // Live-refresh match state as on-chain events come in, instead of waiting
  // for the next poll interval.
  useEffect(() => {
    sdk.subscribeToEvents({ pollIntervalMs: 8000 });
    const onEvent = () => queryClient.invalidateQueries({ queryKey: ['match'] });
    sdk.on('event', onEvent);
    return () => {
      sdk.off('event', onEvent);
      sdk.stopEventSubscription();
    };
  }, [queryClient]);

  const loading = matchQueries.some((q) => q.isLoading);

  return (
    <div className="dashboard card">
      <h1 className="text-2xl font-bold mb-6">Your Matches</h1>
      {matchIds.length === 0 ? (
        <p className="text-gray-600">No matches yet — create one from the lobby.</p>
      ) : loading ? (
        <div>Loading...</div>
      ) : (
        <div className="space-y-3">
          {matchIds.map((matchId, i) => {
            const match = matchQueries[i].data;
            return (
              <Link
                key={matchId}
                to={`/match/${matchId}`}
                className="block border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
              >
                <p className="font-mono text-sm">{matchId}</p>
                <p className="text-sm text-gray-600">
                  {match ? `${match.players.length} player(s) — ${match.status}` : 'unavailable'}
                </p>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
