// src/pages/Profile.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

function Profile() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const { token } = useAuth();

  const fetchProfile = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      console.log('Fetched Profile:', data);
      if (!response.ok) throw new Error(data.message || 'Failed to fetch profile');
      setProfile(data.user); // Set profile to the nested 'user' object
    } catch (err) {
      setError(err.message || 'Failed to fetch profile');
      console.error('Fetch Error:', err);
    }
  };

  useEffect(() => {
    if (token) fetchProfile();
  }, [token]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Profile</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {profile ? (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Profile Details</h2>
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>ID:</strong> {profile.id}</p>
          <p><strong>Created At:</strong> {new Date(profile.createdAt).toLocaleString()}</p>
          <p><strong>Updated At:</strong> {new Date(profile.updatedAt).toLocaleString()}</p>
        </div>
      ) : (
        <p className="text-gray-600">Loading profile...</p>
      )}
    </div>
  );
}

export default Profile;