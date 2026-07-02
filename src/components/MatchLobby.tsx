import { useState } from 'react'

interface MatchLobbyProps {
  walletAddress: string
}

interface Match {
  id: string
  player1: string
  player2: string
  amount: string
  gameType: string
  gameId: string
  status: 'pending' | 'active' | 'completed'
}

/**
 * Match lobby for creating and browsing matches.
 */
export default function MatchLobby({ walletAddress }: MatchLobbyProps) {
  const [isCreating, setIsCreating] = useState(false)
  const [counterparty, setCounterparty] = useState('')
  const [amount, setAmount] = useState('1')
  const [gameType, setGameType] = useState<'lichess' | 'chesscom' | 'manual'>('lichess')
  const [gameId, setGameId] = useState('')
  const [matches, setMatches] = useState<Match[]>([])

  const handleCreateMatch = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsCreating(true)

    try {
      // Simulate match creation
      const newMatch: Match = {
        id: `match-${Date.now()}`,
        player1: walletAddress,
        player2: counterparty,
        amount: amount + ' XLM',
        gameType,
        gameId,
        status: 'pending',
      }

      setMatches([newMatch, ...matches])

      // Reset form
      setCounterparty('')
      setAmount('1')
      setGameId('')

      alert(`Match created! Waiting for ${counterparty} to join.`)
    } catch (err: any) {
      alert(`Error creating match: ${err.message}`)
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Create Match Form */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-6">Create Match</h2>
        <form onSubmit={handleCreateMatch} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Counterparty Address</label>
            <input
              type="text"
              value={counterparty}
              onChange={e => setCounterparty(e.target.value)}
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
                onChange={e => setAmount(e.target.value)}
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
                onChange={e => setGameType(e.target.value as any)}
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
              onChange={e => setGameId(e.target.value)}
              placeholder={gameType === 'lichess' ? 'abc123def456' : 'game-id'}
              className="input-field w-full"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isCreating}
            className="btn btn-primary w-full"
          >
            {isCreating ? 'Creating...' : 'Create Match'}
          </button>
        </form>
      </div>

      {/* Match List */}
      {matches.length > 0 && (
        <div className="card">
          <h2 className="text-2xl font-bold mb-6">Active Matches</h2>
          <div className="space-y-4">
            {matches.map(match => (
              <div
                key={match.id}
                className="border border-gray-200 rounded-lg p-4 flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">{match.gameType} Match</p>
                  <p className="text-sm text-gray-600">{match.amount}</p>
                  <p className="text-xs text-gray-500">vs {match.player2.slice(0, 10)}...</p>
                </div>
                <div className="text-right">
                  <span className="badge badge-warning">{match.status}</span>
                  <p className="text-sm mt-2">
                    <a href="#" className="text-blue-600 hover:underline">
                      View
                    </a>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
