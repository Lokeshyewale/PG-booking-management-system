import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Info } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { addPG } from '../../services/api';

const Field = ({ label, darkMode, children }) => (
  <div>
    <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
      {label}
    </label>
    {children}
  </div>
);

const inputCls = (darkMode) =>
  `w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-purple-500 ${
    darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
             : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'}`;

const AddPG = () => {
  const { darkMode } = useApp();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name:'', address:'', city:'', rent:'', description:'',
    availableRooms:'', category:'Boys PG', type:'Single',
    size:'', primaryImage:'', amenities:'', images:''
  });

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addPG({
        ...form,
        rent: Number(form.rent),
        availableRooms: Number(form.availableRooms),
        amenities: form.amenities.split(',').map(a => a.trim()).filter(Boolean),
        images:    form.images.split(',').map(i => i.trim()).filter(Boolean),
      });
      alert('PG submitted for admin verification! It will appear on the site once approved.');
      navigate('/owner');
    } catch (err) {
      alert(err.message || 'Error adding PG');
    } finally {
      setLoading(false);
    }
  };

  const bg   = darkMode ? 'bg-gray-900' : 'bg-gray-50';
  const card = darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
  const txt  = darkMode ? 'text-white' : 'text-gray-900';

  return (
    <div className={`min-h-screen py-12 ${bg}`}>
      <div className="max-w-2xl mx-auto px-4">

        <div className="mb-8">
          <h1 className={`text-3xl font-bold ${txt}`}>List Your PG</h1>
          <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Fill in the details below. Your listing will go live after admin verification.
          </p>
        </div>

        {/* Verification notice */}
        <div className="flex items-start gap-3 mb-8 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
          <Info className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" />
          <p className="text-sm text-blue-400">
            All new PG listings are reviewed by our admin team before going live.
            This usually takes 24–48 hours and helps ensure student safety.
          </p>
        </div>

        <form onSubmit={handleSubmit}
          className={`rounded-2xl border p-8 space-y-5 ${card}`}>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="PG Name *" darkMode={darkMode}>
              <input name="name" value={form.name} onChange={handle} required
                placeholder="e.g. Sunrise Boys PG" className={inputCls(darkMode)} />
            </Field>
            <Field label="City *" darkMode={darkMode}>
              <input name="city" value={form.city} onChange={handle} required
                placeholder="e.g. Mumbai" className={inputCls(darkMode)} />
            </Field>
          </div>

          <Field label="Full Address *" darkMode={darkMode}>
            <input name="address" value={form.address} onChange={handle} required
              placeholder="Street, Area, Landmark" className={inputCls(darkMode)} />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <Field label="Monthly Rent (₹) *" darkMode={darkMode}>
              <input name="rent" type="number" value={form.rent} onChange={handle} required
                placeholder="9000" className={inputCls(darkMode)} />
            </Field>
            <Field label="Available Rooms *" darkMode={darkMode}>
              <input name="availableRooms" type="number" value={form.availableRooms} onChange={handle} required
                placeholder="4" className={inputCls(darkMode)} />
            </Field>
            <Field label="Room Size" darkMode={darkMode}>
              <input name="size" value={form.size} onChange={handle}
                placeholder="120 sq ft" className={inputCls(darkMode)} />
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Category *" darkMode={darkMode}>
              <select name="category" value={form.category} onChange={handle} className={inputCls(darkMode)}>
                <option>Boys PG</option>
                <option>Girls PG</option>
                <option>Mixed PG</option>
              </select>
            </Field>
            <Field label="Room Type *" darkMode={darkMode}>
              <select name="type" value={form.type} onChange={handle} className={inputCls(darkMode)}>
                <option>Single</option>
                <option>Double</option>
                <option>Shared</option>
              </select>
            </Field>
          </div>

          <Field label="Description *" darkMode={darkMode}>
            <textarea name="description" value={form.description} onChange={handle} required
              rows={3} placeholder="Describe your PG, location benefits, nearby places..."
              className={inputCls(darkMode)} />
          </Field>

          <Field label="Primary Image URL" darkMode={darkMode}>
            <input name="primaryImage" value={form.primaryImage} onChange={handle}
              placeholder="https://..." className={inputCls(darkMode)} />
          </Field>

          <Field label="Amenities (comma-separated)" darkMode={darkMode}>
            <input name="amenities" value={form.amenities} onChange={handle}
              placeholder="Wi-Fi, AC, Meals, Parking, Laundry" className={inputCls(darkMode)} />
          </Field>

          <Field label="Additional Image URLs (comma-separated)" darkMode={darkMode}>
            <input name="images" value={form.images} onChange={handle}
              placeholder="https://..., https://..." className={inputCls(darkMode)} />
          </Field>

          <button type="submit" disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl
              bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold
              hover:from-purple-700 hover:to-pink-700 transition disabled:opacity-60">
            <PlusCircle className="w-5 h-5" />
            {loading ? 'Submitting...' : 'Submit for Verification'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPG;