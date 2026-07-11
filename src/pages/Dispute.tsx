import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { sdk } from '../lib/sdk';
import { useWallet } from '../lib/WalletContext';
import DisputeForm from '../components/DisputeForm';

interface DisputeSubmission {
  type: string;
  evidence: string;
  explanation: string;
}

export default function Dispute() {
  const { matchId } = useParams<{ matchId: string }>();
  const { signer } = useWallet();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const disputeMutation = useMutation({
    mutationFn: async (submission: DisputeSubmission) => {
      if (!signer) throw new Error('Connect your wallet first');
      // The resolver contract requires the recorded loser's own signature —
      // only the losing player can successfully dispute a result.
      const evidence = JSON.stringify(submission);
      const result = await sdk.disputeResult({ matchId: matchId!, evidence }, signer);
      if (result.status === 'failed') throw new Error(result.error);
    },
    onSuccess: () => navigate(`/match/${matchId}`),
    onError: (err) => setError(err instanceof Error ? err.message : String(err)),
  });

  return (
    <div className="card">
      <DisputeForm matchId={matchId!} onSubmit={(evidence) => disputeMutation.mutate(evidence)} />
      {disputeMutation.isPending && <p className="mt-4">Submitting dispute...</p>}
      {error && <p className="mt-4 text-red-600">{error}</p>}
    </div>
  );
}
