import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { fetchNotifications, markNotificationAsRead } from '../services/api';

const Notifications = () => {
  const { darkMode, user } = useApp();
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNotifications = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetchNotifications();
        setNotifications(response || []);
      } catch (err) {
        setError(err.message || 'Unable to load notifications');
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, [user]);

  const handleMarkRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      setNotifications((prev) => prev.map((item) => (
        item.id === id ? { ...item, read: true } : item
      )));
    } catch (err) {
      setError(err.message || 'Unable to update notification');
    }
  };

  if (!user) {
    return (
      <div className={`min-h-screen py-16 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Sign in to view notifications
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-16 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-5xl mx-auto px-4">
        <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Your Notifications
        </h1>
        <p className={`mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Stay updated on booking requests, payments, and owner responses.
        </p>

        {loading ? (
          <div className="mt-12 text-center text-gray-400">Loading notifications...</div>
        ) : error ? (
          <div className="mt-12 p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>
        ) : notifications.length === 0 ? (
          <div className="mt-12 p-6 rounded-3xl bg-white border border-dashed text-center text-gray-500">
            No notifications yet.
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`rounded-3xl p-6 border ${notification.read ? 'border-gray-700/10 bg-gray-900/5' : 'border-purple-500/20 bg-purple-50/80'} ${darkMode ? 'bg-gray-800 border-gray-700/60' : ''}`}
              >
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {notification.title || 'New Notification'}
                    </h2>
                    <p className={`mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {notification.message}
                    </p>
                  </div>
                  {!notification.read && (
                    <button
                      onClick={() => handleMarkRead(notification.id)}
                      className="rounded-full px-4 py-2 bg-purple-600 text-white"
                    >
                      Mark read
                    </button>
                  )}
                </div>
                <div className={`mt-3 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {notification.timestamp ? new Date(notification.timestamp).toLocaleString() : ''}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
