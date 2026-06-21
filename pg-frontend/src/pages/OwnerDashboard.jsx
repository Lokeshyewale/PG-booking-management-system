import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { fetchOwnerDashboard } from '../services/api';

const OwnerDashboard = () => {
  const { darkMode, user } = useApp();
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetchOwnerDashboard();
        setDashboard(response);
      } catch (err) {
        setError(err.message || 'Unable to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [user]);

  return (
    <div className={`min-h-screen py-16 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Owner Dashboard
            </h1>
            <p className={`mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Manage listings, monitor bookings, and track earnings from your PG properties.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="mt-12 text-center text-gray-400">Loading dashboard...</div>
        ) : error ? (
          <div className="mt-12 p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>
        ) : !dashboard ? (
          <div className="mt-12 p-6 rounded-3xl bg-white border border-dashed text-center text-gray-500">
            No dashboard data available.
          </div>
        ) : (
          <div className="mt-10 space-y-8">
            <div className="grid gap-4 md:grid-cols-3">
              <div className={`rounded-3xl p-8 shadow-lg ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
                <p className="text-sm uppercase tracking-[0.2em] text-purple-600">Listings</p>
                <p className={`mt-4 text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{dashboard.totalPGs}</p>
              </div>
              <div className={`rounded-3xl p-8 shadow-lg ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
                <p className="text-sm uppercase tracking-[0.2em] text-purple-600">Bookings</p>
                <p className={`mt-4 text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{dashboard.totalBookings}</p>
              </div>
              <div className={`rounded-3xl p-8 shadow-lg ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
                <p className="text-sm uppercase tracking-[0.2em] text-purple-600">Earnings</p>
                <p className={`mt-4 text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>₹{dashboard.totalEarnings.toLocaleString()}</p>
            <div className={`rounded-3xl p-8 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
              <div className="flex items-center justify-between">
                <h2 className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Recent Booking Requests
                </h2>
              </div>

              {dashboard.recentBookings.length === 0 ? (
                <p className={`mt-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  No recent bookings yet.
                </p>
              ) : (
                <div className="mt-6 space-y-4">
                  {dashboard.recentBookings.map((booking) => (
                    <div key={booking.id} className={`rounded-3xl p-5 ${darkMode ? 'bg-gray-900 border border-gray-700' : 'bg-gray-50 border border-gray-200'}`}>
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className={`text-sm uppercase tracking-[0.2em] text-purple-600`}>Booking #{booking.id}</p>
                          <p className={`mt-2 text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            PG ID: {booking.pgId}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${booking.status === 'CONFIRMED' ? 'bg-emerald-500/15 text-emerald-500' : booking.status === 'REJECTED' ? 'bg-red-500/15 text-red-500' : 'bg-yellow-500/15 text-yellow-500'}`}>
                          {booking.status}
                        </span>
                      </div>
                      <div className={`mt-4 grid gap-4 sm:grid-cols-3 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        <div>
                          <strong>Check-in:</strong> {booking.checkInDate}
                        </div>
                        <div>
                          <strong>Check-out:</strong> {booking.checkOutDate}
                        </div>
                        <div>
                          <strong>Booked At:</strong> {booking.bookingDate}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerDashboard;
