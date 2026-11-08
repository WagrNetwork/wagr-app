import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'

const REQUIRED_ENV = [
  'VITE_SOROBAN_RPC_URL',
  'VITE_NETWORK_PASSPHRASE',
  'VITE_ESCROW_CONTRACT_ID',
  'VITE_RESOLVER_CONTRACT_ID',
  'VITE_PAYOUT_CONTRACT_ID',
] as const

const root = ReactDOM.createRoot(document.getElementById('root')!)
const missing = REQUIRED_ENV.filter((key) => !import.meta.env[key])

if (missing.length > 0) {
  // Show a readable setup message instead of a blank page when .env is missing.
  root.render(
    <main style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 560, margin: '64px auto', padding: 16 }}>
      <h1>Wagr is not configured</h1>
      <p>Copy <code>.env.example</code> to <code>.env</code> and set the missing values:</p>
      <ul>
        {missing.map((key) => (
          <li key={key}>
            <code>{key}</code>
          </li>
        ))}
      </ul>
    </main>,
  )
} else {
  // Imported lazily so the SDK singleton is only built once config is present.
  Promise.all([import('./App.tsx'), import('./lib/WalletContext')]).then(
    ([{ default: App }, { WalletProvider }]) => {
      const queryClient = new QueryClient()
      root.render(
        <React.StrictMode>
          <QueryClientProvider client={queryClient}>
            <WalletProvider>
              <BrowserRouter>
                <App />
              </BrowserRouter>
            </WalletProvider>
          </QueryClientProvider>
        </React.StrictMode>,
      )
    },
  )
}
