import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Home, Calendar, Bell, Star, Search,
    MapPin, IndianRupee, Clock, CheckCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { fetchMyBookings, fetchNotifications } from '../services/api';

const statusColors = {
    PENDING: 'bg-yellow-500/10 text-yellow-500',
    CONFIRMED: 'bg-emerald-500/10 text-emerald-500',
    REJECTED: 'bg-red-500/10 text-red-500',
    CANCELLED: 'bg-gray-500/10 text-gray-400',
};

const UserDashboard = () => {
    const { darkMode, user } = useApp();
    const [bookings, setBookings] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const [b, n] = await Promise.all([fetchMyBookings(), fetchNotifications()]);
                setBookings(b || []);
                setNotifications((n || []).filter(n => !n.read).slice(0, 3));
            } catch (_) { }
            finally { setLoading(false); }
        };
        load();
    }, []);

    const bg = darkMode ? 'bg-gray-900' : 'bg-gray-50';
    const card = darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
    const txt = darkMode ? 'text-white' : 'text-gray-900';
    const sub = darkMode ? 'text-gray-400' : 'text-gray-500';

    const confirmed = bookings.filter(b => b.status === 'CONFIRMED').length;
    const pending = bookings.filter(b => b.status === 'PENDING').length;

    return (
        <div className={`min-h-screen py-12 ${bg}`}>
            <div className="max-w-5xl mx-auto px-4">

                {/* Welcome banner */}
                <div className="rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 p-6 mb-8 text-white">
                    <h1 className="text-2xl font-bold">Welcome back, {user?.name}! 👋</h1>
                    <p className="mt-1 opacity-90 text-sm">Find your perfect PG and track your bookings here.</p>
                    <div className="flex gap-3 mt-4">
                        <Link to="/rooms"
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-sm font-medium transition">
                            <Search className="w-4 h-4" /> Browse PGs
                        </Link>
                        <Link to="/my-bookings"
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-sm font-medium transition">
                            <Calendar className="w-4 h-4" /> My Bookings
                        </Link>
                    </div>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: 'Total Bookings', value: bookings.length, icon: Calendar, color: 'text-purple-500', bg: 'bg-purple-500/10' },
                        { label: 'Confirmed', value: confirmed, icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                        { label: 'Pending', value: pending, icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
                        { label: 'Unread Alerts', value: notifications.length, icon: Bell, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                    ].map(s => (
                        <div key={s.label} className={`rounded-2xl border p-4 ${card}`}>
                            <div className={`w-9 h-9 rounded-lg ${s.bg} flex items-center justify-center mb-3`}>
                                <s.icon className={`w-4 h-4 ${s.color}`} />
                            </div>
                            <p className={`text-2xl font-bold ${txt}`}>{s.value}</p>
                            <p className={`text-xs mt-0.5 ${sub}`}>{s.label}</p>
                        </div>
                    ))}
                </div>

                <div className="grid lg:grid-cols-2 gap-6">

                    {/* Recent bookings */}
                    <div className={`rounded-2xl border p-6 ${card}`}>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className={`font-semibold ${txt}`}>Recent Bookings</h2>
                            <Link to="/my-bookings" className="text-sm text-purple-500">View all</Link>
                        </div>
                        {loading ? <p className={`text-sm ${sub}`}>Loading...</p>
                            : bookings.length === 0 ? (
                                <div className="text-center py-8">
                                    <Home className={`w-12 h-12 mx-auto mb-3 ${sub}`} />
                                    <p className={`text-sm ${sub}`}>No bookings yet.</p>
                                    <Link to="/rooms" className="text-sm text-purple-500 mt-2 inline-block">
                                        Find a PG →
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {bookings.slice(0, 4).map(b => (
                                        <div key={b.id}
                                            className={`rounded-xl p-4 border ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className={`font-medium text-sm ${txt}`}>{b.pg?.name}</p>
                                                    <p className={`text-xs ${sub} flex items-center gap-1 mt-0.5`}>
                                                        <MapPin className="w-3 h-3" />{b.pg?.city}
                                                    </p>
                                                    <p className={`text-xs ${sub} flex items-center gap-1 mt-0.5`}>
                                                        <IndianRupee className="w-3 h-3" />
                                                        {Number(b.totalAmount).toLocaleString()}/month
                                                    </p>
                                                </div>
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[b.status]}`}>
                                                    {b.status}
                                                </span>
                                            </div>
                                            <p className={`text-xs mt-2 ${sub}`}>
                                                {b.checkInDate} → {b.checkOutDate}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                    </div>

                    {/* Unread notifications */}
                    <div className={`rounded-2xl border p-6 ${card}`}>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className={`font-semibold ${txt}`}>Notifications</h2>
                            <Link to="/notifications" className="text-sm text-purple-500">View all</Link>
                        </div>
                        {loading ? <p className={`text-sm ${sub}`}>Loading...</p>
                            : notifications.length === 0 ? (
                                <div className="text-center py-8">
                                    <Bell className={`w-12 h-12 mx-auto mb-3 ${sub}`} />
                                    <p className={`text-sm ${sub}`}>No new notifications.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {notifications.map(n => (
                                        <div key={n.id}
                                            className={`rounded-xl p-4 border-l-4 border-purple-500
                      ${darkMode ? 'bg-gray-900 border border-gray-700' : 'bg-purple-50 border border-purple-100'}`}>
                                            <p className={`font-medium text-sm ${txt}`}>{n.title}</p>
                                            <p className={`text-xs mt-1 ${sub}`}>{n.message}</p>
                                            <p className={`text-xs mt-1 ${sub}`}>
                                                {n.timestamp ? new Date(n.timestamp).toLocaleDateString() : ''}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                    </div>
                </div>

                {/* Quick actions */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                    {[
                        { label: 'Browse PGs', href: '/rooms', icon: Search, color: 'from-purple-500 to-pink-500' },
                        { label: 'My Bookings', href: '/my-bookings', icon: Calendar, color: 'from-blue-500 to-cyan-500' },
                        { label: 'Notifications', href: '/notifications', icon: Bell, color: 'from-amber-500 to-orange-500' },
                        { label: 'Find Broker', href: '/find-broker', icon: Star, color: 'from-green-500 to-teal-500' },
                    ].map(a => (
                        <Link key={a.label} to={a.href}
                            className={`rounded-2xl p-5 bg-gradient-to-br ${a.color} text-white text-center
                hover:opacity-90 transition`}>
                            <a.icon className="w-6 h-6 mx-auto mb-2" />
                            <p className="text-sm font-medium">{a.label}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;