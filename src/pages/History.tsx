import React, { useState, useEffect } from 'react';

interface HistoryMatch {
  id: string;
  opponent: string;
  result: 'win' | 'loss' | 'draw';
  amount: string;
  date: number;
}

export default function History() {
  const [history, setHistory] = useState<HistoryMatch[]>([]);
  const [filter, setFilter] = useState<'all' | 'wins' | 'losses'>('all');

  useEffect(() => {
    loadHistory();
  }, [filter]);

  const loadHistory = async () => {
    // Load from localStorage or API
    const saved = localStorage.getItem('matchHistory');
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  };

  const filtered = history.filter(m =>
    filter === 'all' ? true : filter === 'wins' ? m.result === 'win' : m.result === 'loss'
  );

  return (
    <div className="history">
      <h1>Match History</h1>
      <div className="filters">
        {(['all', 'wins', 'losses'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} className={filter === f ? 'active' : ''}>
            {f}
          </button>
        ))}
      </div>
      <table>
        <thead>
          <tr>
            <th>Opponent</th>
            <th>Result</th>
            <th>Amount</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(m => (
            <tr key={m.id}>
              <td>{m.opponent}</td>
              <td className={`result-${m.result}`}>{m.result}</td>
              <td>{m.amount} XLM</td>
              <td>{new Date(m.date * 1000).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
