import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft, CreditCard, Shield, CheckCircle,
  AlertCircle, IndianRupee, Lock, Loader
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { createRazorpayOrder, verifyRazorpayPayment } from "../services/api";

const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID;

// Inject Razorpay script
const loadRazorpayScript = () =>
  new Promise(resolve => {
    if (window.Razorpay) { resolve(true); return; }
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload  = () => resolve(true);
    s.onerror = () => resolve(false);
    document.head.appendChild(s);
  });

// Step indicator
const Step = ({ num, label, active, done }) => (
  <div className="flex items-center gap-2">
    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
      ${done  ? "bg-emerald-500 text-white"
      : active ? "bg-purple-600 text-white"
               : "bg-gray-300 text-gray-600"}`}>
      {done ? <CheckCircle className="w-4 h-4" /> : num}
    </div>
    <span className={`text-sm font-medium hidden sm:block
      ${active ? "text-purple-600" : "text-gray-500"}`}>
      {label}
    </span>
  </div>
);

const Payment = () => {
  const { darkMode, cartItems, clearCart, user } = useApp();
  const navigate  = useNavigate();
  const location  = useLocation();

  // Support both cart checkout and direct PG booking
  const bookingData = location.state || null;

  const [step, setStep]         = useState(1); // 1=details, 2=payment, 3=success
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [bookingResult, setBookingResult] = useState(null);

  const [form, setForm] = useState({
    name:  user?.name  || "",
    email: user?.email || "",
    phone: "",
    city:  "",
  });

  // Check if keys are configured
  const hasRazorpayKey = RAZORPAY_KEY && RAZORPAY_KEY !== "rzp_test_XXXXXXXXXXXXXXXX";

  const total = cartItems.reduce((sum, item) => sum + (item.room.price || item.room.rent || 0), 0);

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleProceedToPayment = e => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone) {
      setError("Please fill all required fields.");
      return;
    }
    setError("");
    setStep(2);
  };

  const handleRazorpayPayment = async (pgId, checkIn, checkOut, amount, pgName) => {
    setLoading(true);
    setError("");

    try {
      // Load script
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        setError("Could not load Razorpay. Check internet connection.");
        setLoading(false);
        return;
      }

      // Create order on backend
      const order = await createRazorpayOrder(pgId, checkIn, checkOut);

      // Open Razorpay checkout
      const options = {
        key:         RAZORPAY_KEY,
        amount:      Math.round(order.amount * 100),
        currency:    "INR",
        name:        "ComfortPG",
        description: `Booking: ${order.pgName || pgName}`,
        order_id:    order.orderId,
        prefill: {
          name:    form.name,
          email:   form.email,
          contact: form.phone,
        },
        notes: { address: form.city },
        theme: { color: "#7c3aed" },

        handler: async (response) => {
          try {
            const result = await verifyRazorpayPayment({
              razorpayOrderId:   response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              bookingId:         String(order.bookingId),
            });
            setBookingResult({
              bookingId:  order.bookingId,
              pgName:     order.pgName,
              amount:     order.amount,
              paymentId:  response.razorpay_payment_id,
            });
            clearCart();
            setStep(3);
          } catch (err) {
            setError("Payment verification failed: " + err.message);
          } finally {
            setLoading(false);
          }
        },

        modal: {
          ondismiss: () => {
            setError("Payment cancelled. You can try again.");
            setLoading(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", r => {
        setError("Payment failed: " + r.error.description);
        setLoading(false);
      });
      rzp.open();

    } catch (err) {
      setError(err.message || "Something went wrong");
      setLoading(false);
    }
  };

  // SUCCESS SCREEN
  if (step === 3) return (
    <div className={`min-h-screen flex items-center justify-center
      ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className={`max-w-md w-full mx-4 rounded-2xl border p-8 text-center
        ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
        <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center
          justify-center mx-auto mb-4">
          <CheckCircle className="w-10 h-10 text-emerald-500" />
        </div>
        <h1 className={`text-2xl font-bold mb-2
          ${darkMode ? "text-white" : "text-gray-900"}`}>
          Booking Confirmed!
        </h1>
        <p className={`text-sm mb-6 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
          Payment successful. Your booking for{" "}
          <strong>{bookingResult?.pgName}</strong> is confirmed.
        </p>
        {bookingResult && (
          <div className={`rounded-xl p-4 text-left text-sm mb-6
            ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
            <div className="flex justify-between mb-2">
              <span className={darkMode ? "text-gray-400" : "text-gray-500"}>Booking ID</span>
              <span className={`font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>
                #{bookingResult.bookingId}
              </span>
            </div>
            <div className="flex justify-between mb-2">
              <span className={darkMode ? "text-gray-400" : "text-gray-500"}>Amount Paid</span>
              <span className="font-medium text-emerald-500">
                ₹{Number(bookingResult.amount).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className={darkMode ? "text-gray-400" : "text-gray-500"}>Payment ID</span>
              <span className={`font-mono text-xs ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                {bookingResult.paymentId?.slice(0,20)}...
              </span>
            </div>
          </div>
        )}
        <div className="flex gap-3">
          <Link to="/my-bookings"
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600
              text-white font-semibold text-sm text-center">
            View My Bookings
          </Link>
          <Link to="/rooms"
            className={`flex-1 py-3 rounded-xl border font-semibold text-sm text-center
              ${darkMode
                ? "border-gray-600 text-gray-300"
                : "border-gray-300 text-gray-700"}`}>
            Browse More
          </Link>
        </div>
      </div>
    </div>
  );

  const bg   = darkMode ? "bg-gray-900" : "bg-gray-50";
  const card = darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200";
  const txt  = darkMode ? "text-white" : "text-gray-900";
  const sub  = darkMode ? "text-gray-400" : "text-gray-500";
  const inp  = darkMode
    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
    : "bg-white border-gray-300 text-gray-900 placeholder-gray-400";

  return (
    <div className={`min-h-screen py-12 ${bg}`}>
      <div className="max-w-4xl mx-auto px-4">

        {/* Back */}
        <Link to="/cart"
          className={`inline-flex items-center gap-2 mb-8 text-sm ${sub} hover:text-purple-500`}>
          <ArrowLeft className="w-4 h-4" /> Back to Cart
        </Link>

        <h1 className={`text-3xl font-bold mb-2 ${txt}`}>Checkout</h1>

        {/* Step indicator */}
        <div className="flex items-center gap-4 mb-8">
          <Step num={1} label="Your Details" active={step === 1} done={step > 1} />
          <div className={`flex-1 h-0.5 ${step > 1 ? "bg-purple-500" : "bg-gray-300"}`} />
          <Step num={2} label="Payment"      active={step === 2} done={step > 2} />
          <div className={`flex-1 h-0.5 ${step > 2 ? "bg-purple-500" : "bg-gray-300"}`} />
          <Step num={3} label="Confirmed"    active={step === 3} done={step > 3} />
        </div>

        {!hasRazorpayKey && (
          <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20
            text-amber-500 text-sm flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Razorpay not configured</p>
              <p className="mt-0.5">
                Add your Razorpay key to <code>.env</code>:
                {" "}<code>VITE_RAZORPAY_KEY_ID=rzp_test_...</code>
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20
            text-red-400 text-sm flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-8">

          {/* LEFT: form */}
          <div className="md:col-span-2">

            {/* STEP 1: Details form */}
            {step === 1 && (
              <form onSubmit={handleProceedToPayment}
                className={`rounded-2xl border p-6 ${card}`}>
                <h2 className={`text-lg font-semibold mb-5 ${txt}`}>
                  Your Details
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium mb-1.5 ${sub}`}>
                      Full Name *
                    </label>
                    <input name="name" value={form.name} onChange={handle}
                      required placeholder="Enter your full name"
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm
                        focus:outline-none focus:ring-2 focus:ring-purple-500 ${inp}`} />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1.5 ${sub}`}>
                      Email Address *
                    </label>
                    <input name="email" type="email" value={form.email} onChange={handle}
                      required placeholder="Enter your email"
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm
                        focus:outline-none focus:ring-2 focus:ring-purple-500 ${inp}`} />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1.5 ${sub}`}>
                      Phone Number *
                    </label>
                    <input name="phone" type="tel" value={form.phone} onChange={handle}
                      required placeholder="Enter 10-digit phone number"
                      maxLength={10}
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm
                        focus:outline-none focus:ring-2 focus:ring-purple-500 ${inp}`} />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1.5 ${sub}`}>
                      City
                    </label>
                    <input name="city" value={form.city} onChange={handle}
                      placeholder="Your current city"
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm
                        focus:outline-none focus:ring-2 focus:ring-purple-500 ${inp}`} />
                  </div>
                </div>

                <button type="submit"
                  className="w-full mt-6 py-3 rounded-xl font-semibold text-white
                    bg-gradient-to-r from-purple-600 to-pink-600
                    hover:from-purple-700 hover:to-pink-700 transition">
                  Continue to Payment →
                </button>
              </form>
            )}

            {/* STEP 2: Payment */}
            {step === 2 && (
              <div className={`rounded-2xl border p-6 ${card}`}>
                <h2 className={`text-lg font-semibold mb-2 ${txt}`}>
                  Payment
                </h2>
                <p className={`text-sm mb-6 ${sub}`}>
                  Click below to open the Razorpay secure payment window.
                </p>

                {/* Booking details summary */}
                <div className={`rounded-xl p-4 mb-6 text-sm
                  ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                  <p className={`font-semibold mb-2 ${txt}`}>Booking Details</p>
                  <div className={`space-y-1 ${sub}`}>
                    <p>Name: <span className={txt}>{form.name}</span></p>
                    <p>Email: <span className={txt}>{form.email}</span></p>
                    <p>Phone: <span className={txt}>{form.phone}</span></p>
                  </div>
                </div>

                {/* Cart items payment */}
                {cartItems.length > 0 && (
                  <div className="space-y-3 mb-6">
                    {cartItems.map(item => {
                      const price = item.room.price || item.room.rent || 0;
                      return (
                        <div key={item.room.id}
                          className={`rounded-xl border p-4 flex justify-between items-center
                            ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                          <div>
                            <p className={`font-medium text-sm ${txt}`}>{item.room.name}</p>
                            <p className={`text-xs mt-0.5 ${sub}`}>
                              {item.room.city} · {item.checkIn} → {item.checkOut}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className={`font-semibold text-sm ${txt}`}>
                              ₹{price.toLocaleString()}
                            </p>
                            <p className={`text-xs ${sub}`}>/month</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Pay button for each cart item */}
                {cartItems.map(item => {
                  const price = item.room.price || item.room.rent || 0;
                  return (
                    <button key={item.room.id}
                      onClick={() => handleRazorpayPayment(
                        item.room.id,
                        item.checkIn,
                        item.checkOut,
                        price,
                        item.room.name
                      )}
                      disabled={loading || !hasRazorpayKey}
                      className="w-full mb-3 py-3.5 rounded-xl font-semibold text-white
                        bg-gradient-to-r from-purple-600 to-pink-600
                        hover:from-purple-700 hover:to-pink-700
                        disabled:opacity-60 transition
                        flex items-center justify-center gap-2">
                      {loading ? (
                        <>
                          <Loader className="w-4 h-4 animate-spin" />
                          Opening Razorpay...
                        </>
                      ) : (
                        <>
                          <IndianRupee className="w-4 h-4" />
                          Pay ₹{price.toLocaleString()} for {item.room.name}
                        </>
                      )}
                    </button>
                  );
                })}

                <button onClick={() => setStep(1)}
                  className={`w-full py-2.5 rounded-xl text-sm border transition
                    ${darkMode
                      ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                      : "border-gray-300 text-gray-600 hover:bg-gray-50"}`}>
                  ← Edit Details
                </button>

                {/* Trust badges */}
                <div className={`flex justify-center gap-6 mt-4 text-xs ${sub}`}>
                  <span className="flex items-center gap-1">
                    <Lock className="w-3 h-3 text-green-500" /> SSL Secured
                  </span>
                  <span className="flex items-center gap-1">
                    <Shield className="w-3 h-3 text-blue-500" /> PCI Compliant
                  </span>
                  <span className="flex items-center gap-1">
                    <CreditCard className="w-3 h-3 text-purple-500" /> Razorpay
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Order summary */}
          <div>
            <div className={`rounded-2xl border p-6 sticky top-24 ${card}`}>
              <h2 className={`font-semibold mb-4 ${txt}`}>Order Summary</h2>

              {cartItems.length === 0 ? (
                <p className={`text-sm ${sub}`}>No items in cart.</p>
              ) : (
                <>
                  <div className="space-y-3 mb-4">
                    {cartItems.map(item => {
                      const price = item.room.price || item.room.rent || 0;
                      return (
                        <div key={item.room.id}>
                          <div className="flex justify-between">
                            <span className={`text-sm ${sub} truncate max-w-[140px]`}>
                              {item.room.name}
                            </span>
                            <span className={`text-sm font-medium ${txt}`}>
                              ₹{price.toLocaleString()}
                            </span>
                          </div>
                          <p className={`text-xs mt-0.5 ${sub}`}>
                            {item.checkIn} → {item.checkOut}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  <div className={`border-t pt-3 mt-3
                    ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                    <div className="flex justify-between mb-1">
                      <span className={`text-sm ${sub}`}>Subtotal</span>
                      <span className={`text-sm ${txt}`}>₹{total.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span className={`text-sm ${sub}`}>Platform fee (10%)</span>
                      <span className="text-sm text-orange-400">
                        ₹{Math.round(total * 0.1).toLocaleString()}
                      </span>
                    </div>
                    <div className={`flex justify-between font-bold text-lg mt-2 pt-2 border-t
                      ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                      <span className={txt}>Total</span>
                      <span className="text-purple-500">
                        ₹{total.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </>
              )}

              <div className={`mt-4 p-3 rounded-xl text-xs ${sub}
                ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                <p className="flex items-center gap-1 mb-1">
                  <Shield className="w-3 h-3 text-green-500" />
                  Your payment is 100% secure
                </p>
                <p className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-blue-500" />
                  Instant booking confirmation
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;