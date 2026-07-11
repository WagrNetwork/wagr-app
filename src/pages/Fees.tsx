import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Asset } from '@stellar/stellar-sdk';
import { sdk } from '../lib/sdk';
import { useWallet } from '../lib/WalletContext';

const XLM_ASSET_ID = Asset.native().contractId(import.meta.env.VITE_NETWORK_PASSPHRASE);

export default function Fees() {
  const { signer } = useWallet();
  const [asset] = useState(XLM_ASSET_ID);

  const feeBalance = useQuery({
    queryKey: ['feeBalance', asset],
    queryFn: () => sdk.getFeeBalance(asset),
    refetchInterval: 15_000,
  });

  const withdraw = useMutation({
    mutationFn: async () => {
      if (!signer) throw new Error('Connect your wallet first');
      const result = await sdk.withdrawFees(asset, signer);
      if (result.status === 'failed') throw new Error(result.error);
      return result.data;
    },
    onSuccess: () => feeBalance.refetch(),
  });

  const xlm = (stroops: string | undefined) => (stroops ? (Number(stroops) / 10_000_000).toFixed(2) : '0.00');

  return (
    <div className="fees card">
      <h1 className="text-2xl font-bold mb-6">Fee Management</h1>
      <div className="fee-stats grid grid-cols-2 gap-4 mb-6">
        <div className="stat">
          <h3 className="font-semibold">Accumulated Fees (XLM)</h3>
          <p className="amount text-2xl">{feeBalance.isLoading ? '...' : xlm(feeBalance.data)}</p>
        </div>
      </div>
      <button onClick={() => withdraw.mutate()} disabled={withdraw.isPending || !signer} className="btn btn-primary">
        {withdraw.isPending ? 'Processing...' : 'Withdraw Fees'}
      </button>
      <p className="text-sm text-gray-500 mt-2">
        Only the payout contract's configured fee collector can successfully withdraw.
      </p>
      {withdraw.isError && <p className="text-red-600 text-sm mt-2">{String(withdraw.error)}</p>}
      {withdraw.isSuccess && (
        <p className="text-green-600 text-sm mt-2">Withdrew {xlm(withdraw.data)} XLM</p>
      )}
    </div>
  );
}
