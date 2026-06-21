import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Home, PlusCircle, List, TrendingUp, Users,
  CheckCircle, XCircle, Clock, IndianRupee
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { fetchOwnerDashboard, updateBookingStatus } from '../../services/api';

const statusColor = (s) => {
  if (s === 'CONFIRMED') return 'text-emerald-500 bg-emerald-500/10';
  if (s === 'REJECTED')  return 'text-red-500 bg-red-500/10';
  return 'text-yellow-500 bg-yellow-500/10';
};

const OwnerDashboard = () => {
  const { darkMode, user } = useApp();
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  const load = async () => {
    try {
      const res = await fetchOwnerDashboard();
      setData(res);
    } catch (err) {
      setError(err.message || 'Unable to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleStatus = async (bookingId, status) => {
    try {
      await updateBookingStatus(bookingId, status);
      load(); // refresh
    } catch (err) {
      alert(err.message);
    }
  };

  const bg  = darkMode ? 'bg-gray-900' : 'bg-gray-50';
  const card = darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
  const txt  = darkMode ? 'text-white' : 'text-gray-900';
  const sub  = darkMode ? 'text-gray-300' : 'text-gray-600';

  return (
    <div className={`min-h-screen py-12 ${bg}`}>
      <div className="max-w-6xl mx-auto px-4">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <div>
            <h1 className={`text-3xl font-bold ${txt}`}>Owner Dashboard</h1>
            <p className={`mt-1 ${sub}`}>Welcome back, {user?.name}</p>
          </div>
          <div className="flex gap-3">
            <Link to="/owner/add-pg"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium">
              <PlusCircle className="w-4 h-4" /> Add PG
            </Link>
            <Link to="/owner/my-pgs"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-medium ${card} ${txt}`}>
              <List className="w-4 h-4" /> My PGs
            </Link>
          </div>
        </div>

        {loading ? (
          <p className={sub}>Loading dashboard...</p>
        ) : error ? (
          <div className="p-4 bg-red-100 text-red-700 rounded-xl">{error}</div>
        ) : (
          <>
            {/* Stats row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
              <div className={`rounded-2xl border p-6 ${card}`}>
                <div className="flex items-center gap-3 mb-2">
                  <Home className="w-5 h-5 text-purple-500" />
                  <span className="text-sm uppercase tracking-widest text-purple-500">Listings</span>
                </div>
                <p className={`text-4xl font-bold ${txt}`}>{data.totalPGs}</p>
              </div>
              <div className={`rounded-2xl border p-6 ${card}`}>
                <div className="flex items-center gap-3 mb-2">
                  <Users className="w-5 h-5 text-blue-500" />
                  <span className="text-sm uppercase tracking-widest text-blue-500">Bookings</span>
                </div>
                <p className={`text-4xl font-bold ${txt}`}>{data.totalBookings}</p>
              </div>
              <div className={`rounded-2xl border p-6 ${card}`}>
                <div className="flex items-center gap-3 mb-2">
                  <IndianRupee className="w-5 h-5 text-emerald-500" />
                  <span className="text-sm uppercase tracking-widest text-emerald-500">Earnings (90%)</span>
                </div>
                <p className={`text-4xl font-bold ${txt}`}>
                  ₹{Number(data.totalEarnings).toLocaleString()}
                </p>
                <p className={`text-xs mt-1 ${sub}`}>Platform keeps 10% fee</p>
              </div>
            </div>

            {/* Recent bookings */}
            <div className={`rounded-2xl border p-6 ${card}`}>
              <h2 className={`text-xl font-semibold mb-6 ${txt}`}>Recent Booking Requests</h2>

              {data.recentBookings.length === 0 ? (
                <p className={sub}>No bookings yet.</p>
              ) : (
                <div className="space-y-4">
                  {data.recentBookings.map((b) => (
                    <div key={b.id}
                      className={`rounded-xl border p-5 ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                          <p className={`font-semibold ${txt}`}>{b.pg?.name || `PG #${b.pg?.id}`}</p>
                          <p className={`text-sm ${sub}`}>
                            Student: {b.user?.name} &nbsp;·&nbsp;
                            {b.checkInDate} → {b.checkOutDate}
                          </p>
                          <p className={`text-sm ${sub}`}>
                            Amount: ₹{Number(b.totalAmount).toLocaleString()}
                            &nbsp;·&nbsp;
                            Your earnings: ₹{Number(b.ownerEarnings).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor(b.status)}`}>
                            {b.status}
                          </span>
                          {b.status === 'PENDING' && (
                            <>
                              <button onClick={() => handleStatus(b.id,'CONFIRMED')}
                                className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20">
                                <CheckCircle className="w-5 h-5" />
                              </button>
                              <button onClick={() => handleStatus(b.id,'REJECTED')}
                                className="p-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20">
                                <XCircle className="w-5 h-5" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OwnerDashboard;