import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import WalletConnect from '../components/WalletConnect';
import { useWallet } from '../lib/WalletContext';

vi.mock('../lib/WalletContext', () => ({
  useWallet: vi.fn(),
}));

const mockedUseWallet = vi.mocked(useWallet);

beforeEach(() => {
  mockedUseWallet.mockReset();
});

describe('WalletConnect', () => {
  it('shows a connect button when no wallet is connected', () => {
    mockedUseWallet.mockReturnValue({
      address: null,
      signer: null,
      isConnecting: false,
      error: null,
      connect: vi.fn(),
      disconnect: vi.fn(),
    });

    render(<WalletConnect />);
    expect(screen.getByText('Connect Freighter')).toBeInTheDocument();
  });

  it('calls connect() when the button is clicked', () => {
    const connect = vi.fn();
    mockedUseWallet.mockReturnValue({
      address: null,
      signer: null,
      isConnecting: false,
      error: null,
      connect,
      disconnect: vi.fn(),
    });

    render(<WalletConnect />);
    fireEvent.click(screen.getByText('Connect Freighter'));
    expect(connect).toHaveBeenCalledOnce();
  });

  it('shows the truncated address and a disconnect button once connected', () => {
    mockedUseWallet.mockReturnValue({
      address: 'GABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890',
      signer: { publicKey: 'GABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890', signTransaction: vi.fn() },
      isConnecting: false,
      error: null,
      connect: vi.fn(),
      disconnect: vi.fn(),
    });

    render(<WalletConnect />);
    expect(screen.getByText('Disconnect')).toBeInTheDocument();
    expect(screen.getByText(/GABCDE/)).toBeInTheDocument();
  });
});
