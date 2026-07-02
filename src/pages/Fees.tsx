import React, { useState, useEffect } from 'react';

export default function Fees() {
  const [accumulated, setAccumulated] = useState('0');
  const [withdrawn, setWithdrawn] = useState('0');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFeeData();
  }, []);

  const fetchFeeData = async () => {
    // Load fee data from contract
    setAccumulated('125.50');
    setWithdrawn('500.00');
  };

  const handleWithdraw = async () => {
    setLoading(true);
    try {
      // Submit withdrawal transaction
      alert('Withdrawal processing...');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fees">
      <h1>Fee Management</h1>
      <div className="fee-stats">
        <div className="stat">
          <h3>Accumulated Fees</h3>
          <p className="amount">{accumulated} XLM</p>
        </div>
        <div className="stat">
          <h3>Total Withdrawn</h3>
          <p className="amount">{withdrawn} XLM</p>
        </div>
      </div>
      <button onClick={handleWithdraw} disabled={loading}>
        {loading ? 'Processing...' : 'Withdraw Fees'}
      </button>
    </div>
  );
}
