import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Trash2, CheckCircle, Clock, XCircle, MapPin, IndianRupee } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { fetchMyPGs, deletePG } from '../../services/api';

const verificationBadge = (status) => {
  if (status === 'APPROVED') return (
    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-500">
      <CheckCircle className="w-3 h-3" /> Verified
    </span>
  );
  if (status === 'REJECTED') return (
    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-500/10 text-red-500">
      <XCircle className="w-3 h-3" /> Rejected
    </span>
  );
  return (
    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-yellow-500/10 text-yellow-500">
      <Clock className="w-3 h-3" /> Pending Review
    </span>
  );
};

const MyPGs = () => {
  const { darkMode } = useApp();
  const [pgs, setPgs]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const res = await fetchMyPGs();
      setPgs(res || []);
    } catch (err) {
      setError(err.message || 'Unable to load PGs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await deletePG(id);
      setPgs(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const bg   = darkMode ? 'bg-gray-900' : 'bg-gray-50';
  const card = darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
  const txt  = darkMode ? 'text-white' : 'text-gray-900';
  const sub  = darkMode ? 'text-gray-400' : 'text-gray-500';

  return (
    <div className={`min-h-screen py-12 ${bg}`}>
      <div className="max-w-5xl mx-auto px-4">

        <div className="flex items-center justify-between mb-8">
          <h1 className={`text-3xl font-bold ${txt}`}>My PG Listings</h1>
          <Link to="/owner/add-pg"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium">
            <PlusCircle className="w-4 h-4" /> Add New
          </Link>
        </div>

        {loading ? (
          <p className={sub}>Loading your listings...</p>
        ) : error ? (
          <div className="p-4 bg-red-100 text-red-700 rounded-xl">{error}</div>
        ) : pgs.length === 0 ? (
          <div className={`rounded-2xl border border-dashed p-12 text-center ${card}`}>
            <p className={`text-lg ${sub}`}>You haven't listed any PGs yet.</p>
            <Link to="/owner/add-pg"
              className="inline-flex items-center gap-2 mt-4 px-6 py-2.5 rounded-xl
                bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium">
              <PlusCircle className="w-4 h-4" /> List Your First PG
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {pgs.map(pg => (
              <div key={pg.id} className={`rounded-2xl border p-5 flex gap-4 ${card}`}>
                <img
                  src={pg.primaryImage || pg.image || 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?w=400'}
                  alt={pg.name}
                  className="w-24 h-24 rounded-xl object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <h2 className={`text-lg font-semibold ${txt}`}>{pg.name}</h2>
                    {verificationBadge(pg.verificationStatus || 'PENDING')}
                  </div>
                  <div className={`flex items-center gap-1 text-sm mt-1 ${sub}`}>
                    <MapPin className="w-3.5 h-3.5" /> {pg.city}
                    &nbsp;·&nbsp; {pg.category} &nbsp;·&nbsp; {pg.type}
                  </div>
                  <div className={`flex items-center gap-1 text-sm mt-1 ${sub}`}>
                    <IndianRupee className="w-3.5 h-3.5" />
                    {Number(pg.rent).toLocaleString()}/month
                    &nbsp;·&nbsp; {pg.availableRooms} rooms available
                  </div>
                  {pg.verificationStatus === 'PENDING' && (
                    <p className="text-xs text-yellow-500 mt-2">
                      ⏳ Under admin review — not yet visible to students.
                    </p>
                  )}
                  {pg.verificationStatus === 'REJECTED' && (
                    <p className="text-xs text-red-400 mt-2">
                      ❌ Rejected by admin. Please delete and re-list with correct information.
                    </p>
                  )}
                </div>
                <button onClick={() => handleDelete(pg.id, pg.name)}
                  className="self-start p-2 rounded-lg text-red-400 hover:bg-red-500/10 transition">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPGs;