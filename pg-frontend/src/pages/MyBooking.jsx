import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Calendar, MapPin, IndianRupee, Clock,
  CheckCircle, XCircle, AlertCircle, Home,
  RefreshCw
} from "lucide-react";
import { fetchMyBookings } from "../services/api";
import { useApp } from "../context/AppContext";

const statusConfig = {
  PENDING:   {
    color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    icon:  Clock,
    label: "Pending",
    hint:  "Booking saved. Complete payment to confirm."
  },
  CONFIRMED: {
    color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    icon:  CheckCircle,
    label: "Confirmed",
    hint:  "Payment received! Contact PG owner to arrange move-in."
  },
  REJECTED:  {
    color: "bg-red-500/10 text-red-500 border-red-500/20",
    icon:  XCircle,
    label: "Rejected",
    hint:  "Booking rejected. Try a different PG."
  },
  CANCELLED: {
    color: "bg-gray-500/10 text-gray-400 border-gray-500/20",
    icon:  AlertCircle,
    label: "Cancelled",
    hint:  "This booking was cancelled."
  },
};

const MyBookings = () => {
  const { darkMode, user } = useApp();
  const [bookings, setBookings] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");

  const load = () => {
    setLoading(true);
    fetchMyBookings()
      .then(data => { setBookings(data || []); setError(""); })
      .catch(err  => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const bg   = darkMode ? "bg-gray-900" : "bg-gray-50";
  const card = darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200";
  const txt  = darkMode ? "text-white" : "text-gray-900";
  const sub  = darkMode ? "text-gray-400" : "text-gray-500";

  if (!user) return (
    <div className={`min-h-screen flex items-center justify-center ${bg}`}>
      <div className="text-center">
        <p className={`text-xl mb-4 ${txt}`}>Please login to view your bookings</p>
        <Link to="/login" className="text-purple-500 underline">Go to Login</Link>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen py-12 ${bg}`}>
      <div className="max-w-4xl mx-auto px-4">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className={`text-3xl font-bold ${txt}`}>My Bookings</h1>
            <p className={`mt-1 text-sm ${sub}`}>
              {bookings.length} booking{bookings.length !== 1 ? "s" : ""} found
            </p>
          </div>
          <button onClick={load}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm ${card}`}>
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1,2,3].map(i => (
              <div key={i} className={`rounded-2xl border p-6 animate-pulse ${card}`}>
                <div className={`h-4 w-48 rounded mb-3 ${darkMode ? "bg-gray-700" : "bg-gray-200"}`} />
                <div className={`h-3 w-32 rounded ${darkMode ? "bg-gray-700" : "bg-gray-200"}`} />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-4 bg-red-100 text-red-700 rounded-xl">{error}</div>
        ) : bookings.length === 0 ? (
          <div className={`rounded-2xl border border-dashed p-16 text-center ${card}`}>
            <Home className={`w-16 h-16 mx-auto mb-4 opacity-30 ${txt}`} />
            <p className={`text-lg font-semibold ${txt}`}>No bookings yet</p>
            <p className={`text-sm mt-1 ${sub}`}>Browse PGs and book one.</p>
            <Link to="/rooms"
              className="inline-block mt-5 px-6 py-2.5 rounded-xl
                bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium text-sm">
              Browse PGs
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map(b => {
              const cfg  = statusConfig[b.status] || statusConfig.PENDING;
              const Icon = cfg.icon;
              return (
                <div key={b.id} className={`rounded-2xl border p-6 ${card}`}>
                  <div className="flex flex-col sm:flex-row gap-4">

                    {/* Image */}
                    <img
                      src={
                        b.pg?.primaryImage || b.pg?.image ||
                        "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?w=200"
                      }
                      alt={b.pg?.name}
                      className="w-full sm:w-24 h-24 rounded-xl object-cover shrink-0"
                    />

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <h2 className={`text-lg font-semibold ${txt}`}>
                          {b.pg?.name || "PG Booking #" + b.id}
                        </h2>
                        <span className={`flex items-center gap-1.5 px-3 py-1
                          rounded-full text-xs font-semibold border ${cfg.color}`}>
                          <Icon className="w-3.5 h-3.5" />
                          {cfg.label}
                        </span>
                      </div>

                      <div className={`grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3 text-sm ${sub}`}>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />{b.pg?.city || "—"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {b.checkInDate} → {b.checkOutDate}
                        </span>
                        <span className="flex items-center gap-1">
                          <IndianRupee className="w-3.5 h-3.5" />
                          ₹{Number(b.totalAmount || 0).toLocaleString()}/month
                        </span>
                        <span className="flex items-center gap-1 col-span-2 sm:col-span-1">
                          <Clock className="w-3.5 h-3.5" />
                          {b.bookingDate
                            ? new Date(b.bookingDate).toLocaleDateString()
                            : "—"}
                        </span>
                      </div>

                      {/* Status hint */}
                      <p className={`text-xs mt-3 px-3 py-2 rounded-lg
                        ${b.status === "CONFIRMED"
                          ? "bg-emerald-500/10 text-emerald-500"
                          : b.status === "REJECTED"
                          ? "bg-red-500/10 text-red-400"
                          : darkMode ? "bg-gray-700 text-gray-400" : "bg-gray-100 text-gray-500"}`}>
                        {cfg.hint}
                      </p>

                      {/* Money breakdown for confirmed */}
                      {b.status === "CONFIRMED" && (
                        <div className="grid grid-cols-3 gap-2 mt-3 text-xs text-center">
                          {[
                            { label: "Total Paid",    val: b.totalAmount,    color: "text-purple-400" },
                            { label: "Platform Fee",  val: b.platformFee,    color: "text-orange-400" },
                            { label: "Owner Earns",   val: b.ownerEarnings,  color: "text-emerald-400" },
                          ].map(item => (
                            <div key={item.label}
                              className={`rounded-lg p-2 ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                              <p className={`${sub} mb-0.5`}>{item.label}</p>
                              <p className={`font-semibold ${item.color}`}>
                                ₹{Number(item.val || 0).toLocaleString()}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;