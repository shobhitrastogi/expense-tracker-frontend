// src/components/ExpenseSummary.jsx
import { useState, useEffect } from 'react';

function ExpenseSummary({ token }) {
  const [summary, setSummary] = useState({
    all: null,
    weekly: null,
    monthly: null,
  });
  const [error, setError] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('all');

  const fetchSummary = async (period) => {
    try {
      const url = `http://localhost:5000/api/expenses/summary/all${period !== 'all' ? `?period=${period}` : ''}`;
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      console.log(`Fetched ${period} Summary:`, data);
      if (!response.ok) throw new Error(data.message || `Failed to fetch ${period} summary`);
      return data;
    } catch (err) {
      setError(err.message || `Failed to fetch ${period} summary`);
      console.error('Fetch Error:', err);
      return null;
    }
  };

  useEffect(() => {
    const loadSummaries = async () => {
      const allSummary = await fetchSummary('all');
      const weeklySummary = await fetchSummary('weekly');
      const monthlySummary = await fetchSummary('monthly');
      setSummary({
        all: allSummary,
        weekly: weeklySummary,
        monthly: monthlySummary,
      });
    };
    if (token) loadSummaries();
  }, [token]);

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
  };

  if (error) return <p className="text-red-500">{error}</p>;
  if (!summary.all) return <p className="text-gray-600">Loading summary...</p>;

  const currentSummary = summary[selectedPeriod];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold mb-4">Expense Summary</h2>
      
      {/* Period Selection */}
      <div className="mb-4">
        <button
          onClick={() => handlePeriodChange('all')}
          className={`mr-2 px-4 py-2 rounded ${selectedPeriod === 'all' ? 'bg-black text-white' : 'bg-white text-black'}`}
        >
          All Time
        </button>
        <button
          onClick={() => handlePeriodChange('weekly')}
          className={`mr-2 px-4 py-2 rounded ${selectedPeriod === 'weekly' ? 'bg-black text-white' : 'bg-white text-black'}`}
        >
          Weekly
        </button>
        <button
          onClick={() => handlePeriodChange('monthly')}
          className={`px-4 py-2 rounded ${selectedPeriod === 'monthly' ? 'bg-black text-white' : 'bg-white text-black'}`}
        >
          Monthly
        </button>
      </div>

      {/* Summary Display */}
      {currentSummary ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-700">
              Total Expenses: <span className="font-bold">${currentSummary.total || 0}</span>
            </p>
            {currentSummary.categories && (
              <ul className="mt-2">
                {Object.entries(currentSummary.categories).map(([category, amount]) => (
                  <li key={category} className="text-gray-600">
                    {category}: ${amount}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ) : (
        <p className="text-gray-600">No data available for this period.</p>
      )}
    </div>
  );
}

export default ExpenseSummary;