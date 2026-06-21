import React, { useEffect, useState } from "react";
import {
  Shield, CheckCircle, XCircle, Clock,
  Home, Users, IndianRupee, TrendingUp,
  BookOpen, Eye, RefreshCw, ChevronDown,
  ChevronUp, Building2, UserCheck
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import {
  fetchAdminDashboard, fetchAllBookings,
  fetchOwnerEarnings,  fetchPendingPGs,
  fetchAllUsers,       verifyPG
} from "../../services/api";

// ── Tabs ──
const TABS = ["Overview", "Bookings", "PG Verification", "Owners", "Users"];

// ── Status badge ──
const StatusBadge = ({ status }) => {
  const map = {
    CONFIRMED: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    PENDING:   "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    REJECTED:  "bg-red-500/10 text-red-500 border-red-500/20",
    CANCELLED: "bg-gray-500/10 text-gray-400 border-gray-500/20",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border
      ${map[status] || map.PENDING}`}>
      {status}
    </span>
  );
};

// ── Stat card ──
const StatCard = ({ icon: Icon, label, value, sub, color, darkMode }) => (
  <div className={`rounded-2xl border p-5
    ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
    <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-3`}>
      <Icon className="w-5 h-5 text-white" />
    </div>
    <p className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
      {value}
    </p>
    <p className={`text-sm mt-0.5 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
      {label}
    </p>
    {sub && (
      <p className={`text-xs mt-1 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
        {sub}
      </p>
    )}
  </div>
);

const AdminDashboard = () => {
  const { darkMode, user } = useApp();
  const [tab,       setTab]      = useState("Overview");
  const [stats,     setStats]    = useState(null);
  const [bookings,  setBookings] = useState([]);
  const [pending,   setPending]  = useState([]);
  const [owners,    setOwners]   = useState([]);
  const [users,     setUsers]    = useState([]);
  const [loading,   setLoading]  = useState(true);
  const [msg,       setMsg]      = useState({ type:"", text:"" });
  const [expanded,  setExpanded] = useState(null);

  const showMsg = (type, text) => {
    setMsg({ type, text });
    setTimeout(() => setMsg({ type:"", text:"" }), 3000);
  };

  const load = async () => {
    setLoading(true);
    try {
      const [s, b, p, o, u] = await Promise.all([
        fetchAdminDashboard(),
        fetchAllBookings(),
        fetchPendingPGs(),
        fetchOwnerEarnings(),
        fetchAllUsers(),
      ]);
      setStats(s);
      setBookings(b || []);
      setPending(p || []);
      setOwners(o  || []);
      setUsers(u   || []);
    } catch (err) {
      showMsg("err", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleVerify = async (id, action) => {
    try {
      const res = await verifyPG(id, action);
      showMsg("ok", res.message);
      load();
    } catch (err) {
      showMsg("err", err.message);
    }
  };

  const bg    = darkMode ? "bg-gray-900" : "bg-gray-50";
  const card  = darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200";
  const txt   = darkMode ? "text-white" : "text-gray-900";
  const sub   = darkMode ? "text-gray-400" : "text-gray-500";
  const row   = darkMode ? "bg-gray-900 border-gray-700" : "bg-gray-50 border-gray-200";
  const thead = darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600";

  return (
    <div className={`min-h-screen py-12 ${bg}`}>
      <div className="max-w-7xl mx-auto px-4">

        {/* Header */}
        <div className={`rounded-2xl border p-6 mb-6 ${card}`}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-red-500 to-orange-500
                flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className={`text-2xl font-bold ${txt}`}>Admin Dashboard</h1>
                <p className={`text-sm ${sub}`}>{user?.email}</p>
              </div>
            </div>
            <button onClick={load}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm ${card}`}>
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Message */}
        {msg.text && (
          <div className={`mb-4 p-4 rounded-xl text-sm flex items-center gap-2
            ${msg.type === "ok"
              ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
              : "bg-red-500/10 text-red-400 border border-red-500/20"}`}>
            {msg.type === "ok"
              ? <CheckCircle className="w-4 h-4" />
              : <XCircle className="w-4 h-4" />}
            {msg.text}
          </div>
        )}

        {/* Tabs */}
        <div className={`flex gap-1 p-1 rounded-xl mb-6 overflow-x-auto
          ${darkMode ? "bg-gray-800" : "bg-gray-200"}`}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition
                ${tab === t
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow"
                  : darkMode ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}>
              {t}
              {t === "PG Verification" && pending.length > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-xs
                  bg-red-500 text-white">
                  {pending.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1,2,3,4].map(i => (
              <div key={i} className={`rounded-2xl border p-5 animate-pulse h-28 ${card}`} />
            ))}
          </div>
        ) : (

          <>
            {/* ── OVERVIEW TAB ── */}
            {tab === "Overview" && stats && (
              <div className="space-y-6">

                {/* Stats grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <StatCard darkMode={darkMode} icon={IndianRupee}
                    label="Total Revenue"
                    value={`₹${Number(stats.totalRevenue || 0).toLocaleString()}`}
                    sub="From confirmed bookings"
                    color="bg-gradient-to-br from-purple-500 to-pink-500" />
                  <StatCard darkMode={darkMode} icon={TrendingUp}
                    label="Platform Earnings (10%)"
                    value={`₹${Number(stats.platformEarnings || 0).toLocaleString()}`}
                    sub="Admin income"
                    color="bg-gradient-to-br from-emerald-500 to-teal-500" />
                  <StatCard darkMode={darkMode} icon={BookOpen}
                    label="Total Bookings"
                    value={stats.totalBookings || 0}
                    sub={`${stats.confirmedBookings || 0} confirmed`}
                    color="bg-gradient-to-br from-blue-500 to-cyan-500" />
                  <StatCard darkMode={darkMode} icon={Home}
                    label="Total PGs"
                    value={stats.totalPGs || 0}
                    sub={`${stats.pendingPGs || 0} pending review`}
                    color="bg-gradient-to-br from-orange-500 to-red-500" />
                  <StatCard darkMode={darkMode} icon={Users}
                    label="Students"
                    value={stats.totalUsers || 0}
                    sub="Registered users"
                    color="bg-gradient-to-br from-indigo-500 to-purple-500" />
                  <StatCard darkMode={darkMode} icon={Building2}
                    label="Owners"
                    value={stats.totalOwners || 0}
                    sub="Property owners"
                    color="bg-gradient-to-br from-amber-500 to-orange-500" />
                  <StatCard darkMode={darkMode} icon={CheckCircle}
                    label="Verified PGs"
                    value={stats.verifiedPGs || 0}
                    sub="Live on platform"
                    color="bg-gradient-to-br from-green-500 to-emerald-500" />
                  <StatCard darkMode={darkMode} icon={IndianRupee}
                    label="Owner Payouts (90%)"
                    value={`₹${Number(stats.ownerPayouts || 0).toLocaleString()}`}
                    sub="Paid to owners"
                    color="bg-gradient-to-br from-rose-500 to-pink-500" />
                </div>

                {/* Recent bookings */}
                <div className={`rounded-2xl border p-6 ${card}`}>
                  <h2 className={`text-lg font-semibold mb-4 ${txt}`}>
                    Recent Bookings
                  </h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className={`${thead} text-left`}>
                          {["#","Student","PG","Owner","Amount","Status","Date"].map(h => (
                            <th key={h} className="px-3 py-2 font-medium">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700/20">
                        {(stats.recentBookings || []).map(b => (
                          <tr key={b.id} className={`${row} border-b`}>
                            <td className={`px-3 py-2.5 font-mono text-xs ${sub}`}>#{b.id}</td>
                            <td className={`px-3 py-2.5 ${txt}`}>
                              <p className="font-medium">{b.studentName}</p>
                              <p className={`text-xs ${sub}`}>{b.studentEmail}</p>
                            </td>
                            <td className={`px-3 py-2.5 ${txt}`}>
                              <p className="font-medium">{b.pgName}</p>
                              <p className={`text-xs ${sub}`}>{b.pgCity}</p>
                            </td>
                            <td className={`px-3 py-2.5 ${txt}`}>
                              <p className="font-medium">{b.ownerName}</p>
                              <p className={`text-xs ${sub}`}>{b.ownerEmail}</p>
                            </td>
                            <td className={`px-3 py-2.5 ${txt}`}>
                              <p className="font-medium">₹{Number(b.totalAmount).toLocaleString()}</p>
                              <p className={`text-xs ${sub}`}>
                                Fee: ₹{Number(b.platformFee).toLocaleString()}
                              </p>
                            </td>
                            <td className="px-3 py-2.5">
                              <StatusBadge status={b.status} />
                            </td>
                            <td className={`px-3 py-2.5 text-xs ${sub}`}>
                              {new Date(b.bookingDate).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {(!stats.recentBookings || stats.recentBookings.length === 0) && (
                      <p className={`text-center py-8 ${sub}`}>No bookings yet.</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ── BOOKINGS TAB ── */}
            {tab === "Bookings" && (
              <div className={`rounded-2xl border p-6 ${card}`}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className={`text-lg font-semibold ${txt}`}>
                    All Bookings ({bookings.length})
                  </h2>
                  <div className="flex gap-2 text-xs">
                    <span className="px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-500">
                      {bookings.filter(b => b.status === "CONFIRMED").length} Confirmed
                    </span>
                    <span className="px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-500">
                      {bookings.filter(b => b.status === "PENDING").length} Pending
                    </span>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className={`${thead} text-left`}>
                        {["#","Student","PG","Owner","Check-in","Check-out",
                          "Total","Platform Fee","Owner Gets","Status"].map(h => (
                          <th key={h} className="px-3 py-2 font-medium whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map(b => (
                        <tr key={b.id}
                          className={`border-b text-xs ${darkMode
                            ? "border-gray-700 hover:bg-gray-700/50"
                            : "border-gray-100 hover:bg-gray-50"}`}>
                          <td className={`px-3 py-3 font-mono ${sub}`}>#{b.id}</td>
                          <td className={`px-3 py-3 ${txt}`}>
                            <p className="font-medium">{b.studentName}</p>
                            <p className={sub}>{b.studentEmail}</p>
                          </td>
                          <td className={`px-3 py-3 ${txt}`}>
                            <p className="font-medium">{b.pgName}</p>
                            <p className={sub}>{b.pgCity} · {b.pgCategory}</p>
                          </td>
                          <td className={`px-3 py-3 ${txt}`}>
                            <p className="font-medium">{b.ownerName}</p>
                            <p className={sub}>{b.ownerEmail}</p>
                          </td>
                          <td className={`px-3 py-3 ${sub}`}>{b.checkInDate}</td>
                          <td className={`px-3 py-3 ${sub}`}>{b.checkOutDate}</td>
                          <td className={`px-3 py-3 font-semibold ${txt}`}>
                            ₹{Number(b.totalAmount).toLocaleString()}
                          </td>
                          <td className="px-3 py-3 text-orange-400">
                            ₹{Number(b.platformFee).toLocaleString()}
                          </td>
                          <td className="px-3 py-3 text-emerald-400">
                            ₹{Number(b.ownerEarnings).toLocaleString()}
                          </td>
                          <td className="px-3 py-3">
                            <StatusBadge status={b.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {bookings.length === 0 && (
                    <p className={`text-center py-8 ${sub}`}>No bookings yet.</p>
                  )}
                </div>
              </div>
            )}

            {/* ── PG VERIFICATION TAB ── */}
            {tab === "PG Verification" && (
              <div className={`rounded-2xl border p-6 ${card}`}>
                <h2 className={`text-lg font-semibold mb-6 ${txt}`}>
                  PGs Pending Verification ({pending.length})
                </h2>
                {pending.length === 0 ? (
                  <div className="text-center py-16">
                    <CheckCircle className="w-16 h-16 mx-auto mb-4 text-emerald-400" />
                    <p className={`text-lg font-medium ${txt}`}>All caught up!</p>
                    <p className={`text-sm mt-1 ${sub}`}>No PGs pending verification.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pending.map(pg => (
                      <div key={pg.id} className={`rounded-xl border p-5 ${row}`}>
                        <div className="flex flex-col lg:flex-row lg:items-start
                          lg:justify-between gap-4">
                          <div className="flex gap-4">
                            <img
                              src={pg.primaryImage || pg.image ||
                                "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?w=200"}
                              alt={pg.name}
                              className="w-24 h-24 rounded-xl object-cover shrink-0"
                            />
                            <div>
                              <h3 className={`font-semibold text-lg ${txt}`}>{pg.name}</h3>
                              <p className={`text-sm ${sub}`}>
                                {pg.city} · {pg.address}
                              </p>
                              <p className={`text-sm ${sub}`}>
                                {pg.category} · {pg.type} ·
                                ₹{Number(pg.rent).toLocaleString()}/month
                              </p>
                              <p className={`text-sm ${sub}`}>
                                {pg.availableRooms} rooms · {pg.size}
                              </p>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {(pg.amenities || []).map((a, i) => (
                                  <span key={i}
                                    className={`px-2 py-0.5 rounded-full text-xs
                                      ${darkMode
                                        ? "bg-gray-700 text-gray-300"
                                        : "bg-gray-200 text-gray-600"}`}>
                                    {a}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="lg:max-w-xs">
                            <p className={`text-sm mb-4 ${sub}`}>{pg.description}</p>
                            <div className="flex gap-2">
                              <button onClick={() => handleVerify(pg.id, "APPROVED")}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl
                                  bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20
                                  border border-emerald-500/20 text-sm font-medium transition">
                                <CheckCircle className="w-4 h-4" /> Approve
                              </button>
                              <button onClick={() => handleVerify(pg.id, "REJECTED")}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl
                                  bg-red-500/10 text-red-500 hover:bg-red-500/20
                                  border border-red-500/20 text-sm font-medium transition">
                                <XCircle className="w-4 h-4" /> Reject
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── OWNERS TAB ── */}
            {tab === "Owners" && (
              <div className={`rounded-2xl border p-6 ${card}`}>
                <h2 className={`text-lg font-semibold mb-6 ${txt}`}>
                  Owner Earnings Breakdown ({owners.length} owners)
                </h2>
                <div className="space-y-3">
                  {owners.length === 0 ? (
                    <p className={`text-center py-8 ${sub}`}>No owners yet.</p>
                  ) : owners.map((o, i) => (
                    <div key={i} className={`rounded-xl border p-4 ${row}`}>
                      <div className="flex flex-col sm:flex-row
                        sm:items-center sm:justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-r
                            from-blue-500 to-cyan-500
                            flex items-center justify-center shrink-0">
                            <UserCheck className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className={`font-semibold ${txt}`}>{o.ownerName}</p>
                            <p className={`text-xs ${sub}`}>{o.ownerEmail}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-4 gap-4 text-center text-xs">
                          <div>
                            <p className={sub}>PGs</p>
                            <p className={`font-bold text-base ${txt}`}>{o.totalPGs}</p>
                          </div>
                          <div>
                            <p className={sub}>Bookings</p>
                            <p className={`font-bold text-base ${txt}`}>{o.totalBookings}</p>
                          </div>
                          <div>
                            <p className={sub}>Confirmed</p>
                            <p className="font-bold text-base text-emerald-500">
                              {o.confirmedBookings}
                            </p>
                          </div>
                          <div>
                            <p className={sub}>Earnings</p>
                            <p className="font-bold text-base text-purple-400">
                              ₹{Number(o.totalEarnings).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── USERS TAB ── */}
            {tab === "Users" && (
              <div className={`rounded-2xl border p-6 ${card}`}>
                <h2 className={`text-lg font-semibold mb-4 ${txt}`}>
                  All Users ({users.length})
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className={`${thead} text-left`}>
                        {["#","Name","Email","Role"].map(h => (
                          <th key={h} className="px-3 py-2 font-medium">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(u => (
                        <tr key={u.id}
                          className={`border-b text-xs ${darkMode
                            ? "border-gray-700 hover:bg-gray-700/30"
                            : "border-gray-100 hover:bg-gray-50"}`}>
                          <td className={`px-3 py-3 font-mono ${sub}`}>{u.id}</td>
                          <td className={`px-3 py-3 font-medium ${txt}`}>{u.name}</td>
                          <td className={`px-3 py-3 ${sub}`}>{u.email}</td>
                          <td className="px-3 py-3">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold
                              ${u.role === "ADMIN"
                                ? "bg-red-500/10 text-red-400"
                                : u.role === "OWNER"
                                ? "bg-blue-500/10 text-blue-400"
                                : "bg-green-500/10 text-green-400"}`}>
                              {u.role}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;