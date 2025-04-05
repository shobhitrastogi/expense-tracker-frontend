// src/components/ExpenseForm.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

function ExpenseForm({ onExpenseAdded, expenseToEdit, onExpenseUpdated }) {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: '',
    date: '',
    notes: '',
  });
  const [error, setError] = useState('');
  const { token } = useAuth();

  // Sync formData with expenseToEdit when it changes
  useEffect(() => {
    if (expenseToEdit) {
      setFormData({
        title: expenseToEdit.title || '',
        amount: expenseToEdit.amount ? expenseToEdit.amount.toString() : '', // Convert to string for input
        category: expenseToEdit.category || '',
        date: expenseToEdit.date ? expenseToEdit.date.split('T')[0] : '', // Format date for input
        notes: expenseToEdit.notes || '',
      });
    } else {
      setFormData({
        title: '',
        amount: '',
        category: '',
        date: '',
        notes: '',
      });
    }
  }, [expenseToEdit]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = expenseToEdit
        ? `http://localhost:5000/api/expenses/${expenseToEdit.id}`
        : 'http://localhost:5000/api/expenses';
      const method = expenseToEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount), // Convert back to number for API
        }),
      });
      const data = await response.json();
      console.log('API Response:', data);
      if (!response.ok) throw new Error(data.message || 'API Error');

      // Reset form only if adding a new expense
      if (!expenseToEdit) {
        setFormData({
          title: '',
          amount: '',
          category: '',
          date: '',
          notes: '',
        });
      }
      expenseToEdit ? onExpenseUpdated() : onExpenseAdded();
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || `Failed to ${expenseToEdit ? 'update' : 'add'} expense`);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold mb-4">
        {expenseToEdit ? 'Edit Expense' : 'Add New Expense'}
      </h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 mb-2" htmlFor="title">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2" htmlFor="amount">Amount</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              min="0"
              step="0.01"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2" htmlFor="category">Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2" htmlFor="date">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-gray-700 mb-2" htmlFor="notes">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              rows="3"
            />
          </div>
        </div>
        <button
          type="submit"
          className="mt-4 w-full bg-black text-white p-2 rounded "
        >
          {expenseToEdit ? 'Update Expense' : 'Add Expense'}
        </button>
      </form>
    </div>
  );
}

export default ExpenseForm;