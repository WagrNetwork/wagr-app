import { useState } from 'react'
import WalletConnect from './components/WalletConnect'
import MatchLobby from './components/MatchLobby'
import './App.css'

function App() {
  const [wallet, setWallet] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-purple-900">
      <header className="bg-black bg-opacity-50 text-white py-4 px-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold">
            ⚔️ Wagr Protocol
          </h1>
          <WalletConnect onConnect={setWallet} />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {wallet ? (
          <div className="space-y-6">
            <div className="card">
              <h2 className="text-2xl font-bold mb-2">Welcome, {wallet.slice(0, 10)}...</h2>
              <p className="text-gray-600">Create or join a wagering match</p>
            </div>

            <MatchLobby walletAddress={wallet} />
          </div>
        ) : (
          <div className="card text-center">
            <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
            <p className="text-gray-600">Use Freighter, Albedo, or Rabet to get started</p>
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
