import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail, Lock, Eye, EyeOff, User,
  Home, BookOpen, Shield, CheckCircle
} from "lucide-react";
import { useApp } from "../context/AppContext";

const ROLES = [
  {
    id:    "USER",
    icon:  BookOpen,
    label: "Student / Tenant",
    desc:  "Browse and book PG accommodations",
    color: "from-purple-500 to-pink-500",
    perks: ["Browse verified PGs", "Book rooms online", "Track your bookings", "Chat with brokers"],
  },
  {
    id:    "OWNER",
    icon:  Home,
    label: "PG Owner",
    desc:  "List and manage your PG properties",
    color: "from-blue-500 to-cyan-500",
    perks: ["List your PGs", "Manage bookings", "Track earnings", "Get verified badge"],
  },
];

const Signup = () => {
  const { darkMode, signup } = useApp();
  const navigate = useNavigate();

  const [step,        setStep]        = useState(1); // 1=role, 2=details
  const [role,        setRole]        = useState("");
  const [name,        setName]        = useState("");
  const [email,       setEmail]       = useState("");
  const [password,    setPassword]    = useState("");
  const [confirm,     setConfirm]     = useState("");
  const [showPass,    setShowPass]    = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState("");
  const [success,     setSuccess]     = useState(false);

  const selectedRole = ROLES.find(r => r.id === role);

  const handleRoleSelect = (r) => {
    setRole(r);
    setStep(2);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    const result = await signup(name, email, password, role);
    setLoading(false);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        if (role === "OWNER")  navigate("/owner");
        else                   navigate("/dashboard");
      }, 2000);
    } else {
      setError(result.message || "Signup failed. Please try again.");
    }
  };

  const bg   = darkMode ? "bg-gray-900" : "bg-gray-50";
  const card = darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200";
  const txt  = darkMode ? "text-white" : "text-gray-900";
  const sub  = darkMode ? "text-gray-400" : "text-gray-500";
  const inp  = darkMode
    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
    : "bg-white border-gray-300 text-gray-900 placeholder-gray-400";

  // ── SUCCESS ──
  if (success) return (
    <div className={`min-h-screen flex items-center justify-center ${bg}`}>
      <div className={`max-w-md w-full mx-4 rounded-2xl border p-10 text-center ${card}`}>
        <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center
          justify-center mx-auto mb-4">
          <CheckCircle className="w-10 h-10 text-emerald-500" />
        </div>
        <h2 className={`text-2xl font-bold mb-2 ${txt}`}>
          Account Created!
        </h2>
        <p className={`text-sm ${sub}`}>
          Welcome to ComfortPG as{" "}
          <span className="text-purple-400 font-semibold">
            {selectedRole?.label}
          </span>.
          Redirecting to your dashboard...
        </p>
        {role === "OWNER" && (
          <div className="mt-4 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20
            text-blue-400 text-sm">
            You can now list your PGs. Each listing will be reviewed by admin before going live.
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen py-12 ${bg}`}>
      <div className="max-w-4xl mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600
            flex items-center justify-center mx-auto mb-4">
            <Home className="w-7 h-7 text-white" />
          </div>
          <h1 className={`text-3xl font-bold ${txt}`}>Join ComfortPG</h1>
          <p className={`mt-2 ${sub}`}>
            Create your account and get started
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-3 mb-8">
          {["Choose Role", "Your Details"].map((label, i) => (
            <React.Fragment key={label}>
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center
                  text-sm font-bold transition
                  ${step > i + 1
                    ? "bg-emerald-500 text-white"
                    : step === i + 1
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                    : darkMode ? "bg-gray-700 text-gray-400" : "bg-gray-200 text-gray-500"}`}>
                  {step > i + 1 ? <CheckCircle className="w-4 h-4" /> : i + 1}
                </div>
                <span className={`text-sm font-medium hidden sm:block
                  ${step === i + 1 ? "text-purple-500" : sub}`}>
                  {label}
                </span>
              </div>
              {i < 1 && (
                <div className={`w-12 h-0.5 transition
                  ${step > 1 ? "bg-purple-500" : darkMode ? "bg-gray-700" : "bg-gray-300"}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* ── STEP 1: Role selection ── */}
        {step === 1 && (
          <div>
            <h2 className={`text-xl font-semibold text-center mb-6 ${txt}`}>
              How will you use ComfortPG?
            </h2>
            <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              {ROLES.map(r => (
                <button key={r.id} onClick={() => handleRoleSelect(r.id)}
                  className={`rounded-2xl border p-6 text-left transition-all hover:scale-105
                    hover:shadow-xl group
                    ${darkMode
                      ? "bg-gray-800 border-gray-700 hover:border-purple-500/50"
                      : "bg-white border-gray-200 hover:border-purple-300"}`}>

                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${r.color}
                    flex items-center justify-center mb-4
                    group-hover:scale-110 transition`}>
                    <r.icon className="w-7 h-7 text-white" />
                  </div>

                  {/* Label */}
                  <h3 className={`text-xl font-bold mb-1 ${txt}`}>{r.label}</h3>
                  <p className={`text-sm mb-4 ${sub}`}>{r.desc}</p>

                  {/* Perks */}
                  <ul className="space-y-1.5">
                    {r.perks.map(p => (
                      <li key={p} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span className={sub}>{p}</span>
                      </li>
                    ))}
                  </ul>

                  <div className={`mt-5 w-full py-2.5 rounded-xl text-center text-sm
                    font-semibold text-white bg-gradient-to-r ${r.color}
                    group-hover:opacity-90 transition`}>
                    Register as {r.label} →
                  </div>
                </button>
              ))}
            </div>

            <p className={`text-center mt-6 text-sm ${sub}`}>
              Already have an account?{" "}
              <Link to="/login" className="text-purple-500 font-medium">Sign in</Link>
            </p>
          </div>
        )}

        {/* ── STEP 2: Details form ── */}
        {step === 2 && (
          <div className="max-w-md mx-auto">

            {/* Selected role banner */}
            <div className={`flex items-center gap-3 p-4 rounded-xl mb-6
              bg-gradient-to-r ${selectedRole?.color} text-white`}>
              {selectedRole && <selectedRole.icon className="w-5 h-5 shrink-0" />}
              <div>
                <p className="font-semibold text-sm">
                  Registering as {selectedRole?.label}
                </p>
                <p className="text-xs opacity-80">{selectedRole?.desc}</p>
              </div>
              <button onClick={() => { setStep(1); setError(""); }}
                className="ml-auto text-xs underline opacity-80 hover:opacity-100">
                Change
              </button>
            </div>

            {/* Owner notice */}
            {role === "OWNER" && (
              <div className={`mb-5 p-4 rounded-xl border text-sm
                ${darkMode
                  ? "bg-blue-500/10 border-blue-500/20 text-blue-400"
                  : "bg-blue-50 border-blue-200 text-blue-700"}`}>
                <p className="font-semibold mb-1">📋 Owner Registration</p>
                <p>After registering you can list your PGs. Each PG will be reviewed
                by our admin team before appearing to students — usually within 24 hours.</p>
              </div>
            )}

            <form onSubmit={handleSignup}
              className={`rounded-2xl border p-6 space-y-4 ${card}`}>

              {/* Name */}
              <div>
                <label className={`block text-sm font-medium mb-1.5
                  ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <input type="text" value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Enter your full name" required
                    className={`w-full pl-10 pr-3 py-2.5 rounded-xl border text-sm
                      focus:outline-none focus:ring-2 focus:ring-purple-500 ${inp}`} />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className={`block text-sm font-medium mb-1.5
                  ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <input type="email" value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Enter your email" required
                    className={`w-full pl-10 pr-3 py-2.5 rounded-xl border text-sm
                      focus:outline-none focus:ring-2 focus:ring-purple-500 ${inp}`} />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className={`block text-sm font-medium mb-1.5
                  ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <input type={showPass ? "text" : "password"} value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Min. 6 characters" required
                    className={`w-full pl-10 pr-10 py-2.5 rounded-xl border text-sm
                      focus:outline-none focus:ring-2 focus:ring-purple-500 ${inp}`} />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-3 text-gray-400">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm password */}
              <div>
                <label className={`block text-sm font-medium mb-1.5
                  ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <input type={showConfirm ? "text" : "password"} value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    placeholder="Re-enter password" required
                    className={`w-full pl-10 pr-10 py-2.5 rounded-xl border text-sm
                      focus:outline-none focus:ring-2 focus:ring-purple-500
                      ${confirm && password !== confirm
                        ? "border-red-500 focus:ring-red-500"
                        : confirm && password === confirm
                        ? "border-emerald-500 focus:ring-emerald-500"
                        : ""} ${inp}`} />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-3 text-gray-400">
                    {showConfirm
                      ? <EyeOff className="w-4 h-4" />
                      : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {confirm && password !== confirm && (
                  <p className="text-xs text-red-400 mt-1">Passwords do not match</p>
                )}
                {confirm && password === confirm && (
                  <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Passwords match
                  </p>
                )}
              </div>

              {/* Error */}
              {error && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20
                  text-red-400 text-sm">
                  {error}
                </div>
              )}

              {/* Submit */}
              <button type="submit" disabled={loading}
                className="w-full py-3 rounded-xl font-semibold text-white
                  bg-gradient-to-r from-purple-600 to-pink-600
                  hover:from-purple-700 hover:to-pink-700
                  transition disabled:opacity-60 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30
                      border-t-white rounded-full animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Create {selectedRole?.label} Account
                  </>
                )}
              </button>
            </form>

            <p className={`text-center mt-4 text-sm ${sub}`}>
              Already have an account?{" "}
              <Link to="/login" className="text-purple-500 font-medium">Sign in</Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Signup;