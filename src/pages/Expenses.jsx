// src/pages/Expenses.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseSummary from '../components/ExpenseSummary';

function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState('');
  const [editingExpense, setEditingExpense] = useState(null);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    limit: 10,
    page: 1,
  });
  const { token } = useAuth();

  const fetchExpenses = async () => {
    try {
      const query = new URLSearchParams(filters).toString();
      const response = await fetch(`http://localhost:5000/api/expenses?${query}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      console.log('Fetched Expenses:', data);
      if (!response.ok) throw new Error(data.message || 'Failed to fetch expenses');
      setExpenses(data.expenses || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch expenses');
      console.error('Fetch Error:', err);
    }
  };

  const fetchExpenseById = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/expenses/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      console.log('Fetched Single Expense:', data);
      if (!response.ok) throw new Error(data.message || 'Failed to fetch expense');
      setSelectedExpense(data.expense);
    } catch (err) {
      setError(err.message || 'Failed to fetch expense by ID');
      console.error('Fetch Error:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) return;
    try {
      const response = await fetch(`http://localhost:5000/api/expenses/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to delete expense');
      fetchExpenses();
    } catch (err) {
      setError(err.message || 'Failed to delete expense');
    }
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
  };

  const handleView = (id) => {
    fetchExpenseById(id);
  };

  const handleExpenseUpdated = () => {
    setEditingExpense(null);
    fetchExpenses();
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = () => {
    fetchExpenses();
  };

  useEffect(() => {
    if (token) fetchExpenses();
  }, [token]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Expenses</h1>

      {/* Summary Section */}
      {/* <ExpenseSummary token={token} /> */}

      {/* Filter Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Filter Expenses</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-gray-700 mb-2" htmlFor="category">Category</label>
            <input
              type="text"
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded"
              placeholder="e.g., Food"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2" htmlFor="limit">Items per page</label>
            <input
              type="number"
              name="limit"
              value={filters.limit}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded"
              min="1"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2" htmlFor="page">Page</label>
            <input
              type="number"
              name="page"
              value={filters.page}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded"
              min="1"
            />
          </div>
        </div>
        <button
          onClick={applyFilters}
          className="mt-4 bg-black text-white p-2 rounded hover:bg-white hover:text-black"
        >
          Apply Filters
        </button>
      </div>

      <ExpenseForm
        onExpenseAdded={fetchExpenses}
        expenseToEdit={editingExpense}
        onExpenseUpdated={handleExpenseUpdated}
      />

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="mt-6">
        {expenses.length > 0 ? (
          <table className="w-full bg-white shadow-md rounded-lg">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-left">Amount</th>
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Notes</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense.id} className="border-b">
                  <td className="p-3">{expense.id}</td>
                  <td className="p-3">{expense.title}</td>
                  <td className="p-3">${expense.amount}</td>
                  <td className="p-3">{expense.category}</td>
                  <td className="p-3">{new Date(expense.date).toLocaleDateString()}</td>
                  <td className="p-3">{expense.notes || '-'}</td>
                  <td className="p-3">
                    <button
                      onClick={() => handleView(expense.id)}
                      className="text-green-500 hover:text-green-700 mr-2"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleEdit(expense)}
                      className="text-black hover:text-white mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(expense.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-600">No expenses found. Add some above!</p>
        )}
      </div>

      {selectedExpense && (
        <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Expense Details</h2>
          <p><strong>ID:</strong> {selectedExpense.id}</p>
          <p><strong>Title:</strong> {selectedExpense.title}</p>
          <p><strong>Amount:</strong> ${selectedExpense.amount}</p>
          <p><strong>Category:</strong> {selectedExpense.category}</p>
          <p><strong>Date:</strong> {new Date(selectedExpense.date).toLocaleDateString()}</p>
          <p><strong>Notes:</strong> {selectedExpense.notes || '-'}</p>
          <button
            onClick={() => setSelectedExpense(null)}
            className="mt-4 bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}

export default Expenses;