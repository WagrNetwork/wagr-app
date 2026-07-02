import React, { useState } from 'react';

export interface DisputeFormProps {
  matchId: string;
  onSubmit: (evidence: any) => void;
}

export default function DisputeForm({ matchId, onSubmit }: DisputeFormProps) {
  const [type, setType] = useState('screenshot');
  const [evidence, setEvidence] = useState('');
  const [explanation, setExplanation] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ type, evidence, explanation });
  };

  return (
    <form onSubmit={handleSubmit} className="dispute-form">
      <h2>File Dispute</h2>
      <select value={type} onChange={e => setType(e.target.value)}>
        <option value="screenshot">Screenshot</option>
        <option value="video">Video</option>
        <option value="move_log">Move Log</option>
      </select>
      <textarea
        value={evidence}
        onChange={e => setEvidence(e.target.value)}
        placeholder="Evidence URL or data"
      />
      <textarea
        value={explanation}
        onChange={e => setExplanation(e.target.value)}
        placeholder="Explain your dispute"
      />
      <button type="submit">Submit Dispute</button>
    </form>
  );
}
