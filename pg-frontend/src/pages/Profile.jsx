import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const Profile = () => {
  const { darkMode, user, logout } = useApp();

  if (!user) {
    return (
      <div className={`min-h-screen py-16 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            No profile found
          </h1>
          <p className={`mt-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Please log in to see your profile and access your dashboard.
          </p>
          <Link
            to="/login"
            className="mt-6 inline-flex px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-16 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-4xl mx-auto px-4">
        <div className={`rounded-3xl p-8 shadow-lg ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Welcome, {user.name}
          </h1>
          <p className={`mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Email: {user.email}
          </p>
          <p className={`mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Role: {user.role || 'USER'}
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <Link
              to={user.role === 'OWNER' || user.role === 'ADMIN' ? '/owner/dashboard' : '/rooms'}
              className="rounded-2xl px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center"
            >
              {user.role === 'OWNER' || user.role === 'ADMIN' ? 'Owner Dashboard' : 'Browse Rooms'}
            </Link>
            <Link
              to="/notifications"
              className={`rounded-2xl px-6 py-4 text-center ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}`}
            >
              View Notifications
            </Link>
          </div>

          <button
            onClick={logout}
            className="mt-8 rounded-full px-6 py-3 bg-gray-900 text-white hover:bg-gray-800"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
