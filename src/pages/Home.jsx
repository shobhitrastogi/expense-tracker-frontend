// src/pages/Home.jsx
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

function Home() {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        {user ? `Welcome back, ${user.name}!` : 'Welcome to Expense Tracker'}
      </h1>
      
      {user ? (
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Manage your expenses efficiently
          </p>
          <Link
            to="/expenses"
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Go to Expenses
          </Link>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Please login or register to start tracking your expenses
          </p>
          <div className="space-x-4">
            <Link
              to="/login"
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
            >
              Register
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;