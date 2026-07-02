import { useState } from 'react'

interface WalletConnectProps {
  onConnect: (address: string) => void
}

/**
 * Wallet connection component supporting Freighter, Albedo, and Rabet.
 */
export default function WalletConnect({ onConnect }: WalletConnectProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const connectFreighter = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // @ts-ignore - Freighter is injected into window
      if (!window.freighter) {
        throw new Error('Freighter wallet not found')
      }

      // @ts-ignore
      const publicKey = await window.freighter.getPublicKey()
      onConnect(publicKey)
      setIsConnected(true)
      localStorage.setItem('connectedWallet', 'freighter')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const connectAlbedo = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // @ts-ignore - Albedo is injected into window
      if (!window.albedo) {
        throw new Error('Albedo wallet not found')
      }

      // @ts-ignore
      const publicKey = await window.albedo.getPublicKey()
      onConnect(publicKey)
      setIsConnected(true)
      localStorage.setItem('connectedWallet', 'albedo')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const disconnect = () => {
    setIsConnected(false)
    localStorage.removeItem('connectedWallet')
    onConnect('')
  }

  if (isConnected) {
    return (
      <button onClick={disconnect} className="btn btn-secondary">
        Disconnect
      </button>
    )
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={connectFreighter}
        disabled={isLoading}
        className="btn btn-primary"
        title="Connect Freighter wallet"
      >
        {isLoading ? 'Connecting...' : 'Freighter'}
      </button>
      <button
        onClick={connectAlbedo}
        disabled={isLoading}
        className="btn btn-secondary"
        title="Connect Albedo wallet"
      >
        {isLoading ? 'Connecting...' : 'Albedo'}
      </button>
      {error && <div className="text-red-500 text-sm">{error}</div>}
    </div>
  )
}
