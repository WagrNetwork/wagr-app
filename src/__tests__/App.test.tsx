import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from '../App';
import { WalletProvider } from '../lib/WalletContext';

function renderApp() {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <WalletProvider>
        <MemoryRouter>
          <App />
        </MemoryRouter>
      </WalletProvider>
    </QueryClientProvider>,
  );
}

describe('App', () => {
  it('renders the header and prompts to connect a wallet when disconnected', () => {
    renderApp();
    expect(screen.getByText('⚔️ Wagr Protocol')).toBeInTheDocument();
    expect(screen.getByText('Connect Your Wallet')).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    renderApp();
    expect(screen.getByText('Lobby')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Fees')).toBeInTheDocument();
  });
});
