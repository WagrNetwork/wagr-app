import { Routes, Route, Link } from 'react-router-dom'
import WalletConnect from './components/WalletConnect'
import MatchLobby from './components/MatchLobby'
import Dashboard from './pages/Dashboard'
import Fees from './pages/Fees'
import History from './pages/History'
import Settings from './pages/Settings'
import MatchDetail from './pages/MatchDetail'
import Dispute from './pages/Dispute'
import { useWallet } from './lib/WalletContext'
import './App.css'

function Nav() {
  const linkClass = 'text-white opacity-80 hover:opacity-100'
  return (
    <nav className="flex gap-4">
      <Link to="/" className={linkClass}>Lobby</Link>
      <Link to="/dashboard" className={linkClass}>Dashboard</Link>
      <Link to="/history" className={linkClass}>History</Link>
      <Link to="/fees" className={linkClass}>Fees</Link>
      <Link to="/settings" className={linkClass}>Settings</Link>
    </nav>
  )
}

function App() {
  const { address } = useWallet()

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-purple-900">
      <header className="bg-black bg-opacity-50 text-white py-4 px-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center gap-6">
          <h1 className="text-3xl font-bold whitespace-nowrap">⚔️ Wagr Protocol</h1>
          <Nav />
          <WalletConnect />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {address ? (
          <div className="space-y-6">
            <div className="card">
              <h2 className="text-2xl font-bold mb-2">Welcome, {address.slice(0, 10)}...</h2>
              <p className="text-gray-600">Create or join a wagering match</p>
            </div>

            <Routes>
              <Route path="/" element={<MatchLobby walletAddress={address} />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/history" element={<History />} />
              <Route path="/fees" element={<Fees />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/match/:matchId" element={<MatchDetail />} />
              <Route path="/match/:matchId/dispute" element={<Dispute />} />
            </Routes>
          </div>
        ) : (
          <div className="card text-center">
            <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
            <p className="text-gray-600">Use Freighter to get started</p>
          </div>
        )}
      </main>

      <footer className="bg-black bg-opacity-50 text-white py-4 px-6 mt-12">
        <div className="max-w-6xl mx-auto text-center">
          <p>Wagr Protocol — Skill-based wagering on Soroban</p>
          <p className="text-gray-400 text-sm mt-2">
            <a href="https://github.com/WagrNetwork/wagr-protocol">GitHub</a> •{' '}
            <a href="https://wagr-protocol.github.io">Docs</a>
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
