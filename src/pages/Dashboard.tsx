import React, { useState, useEffect } from 'react';

export interface Match {
  id: string;
  opponent: string;
  status: 'active' | 'completed' | 'disputed';
  amount: string;
  createdAt: number;
}

export default function Dashboard() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    setLoading(true);
    try {
      // Fetch matches from API
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <h1>Your Matches</h1>
      {loading ? <div>Loading...</div> : <MatchList matches={matches} />}
    </div>
  );
}

function MatchList({ matches }: { matches: Match[] }) {
  return (
    <div className="match-list">
      {matches.map(m => (
        <div key={m.id} className="match-card">
          <p>vs {m.opponent}</p>
          <p>{m.amount} XLM</p>
          <span className={`status-${m.status}`}>{m.status}</span>
        </div>
      ))}
    </div>
  );
}
