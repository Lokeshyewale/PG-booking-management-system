import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Star, MapPin, Wifi, Car, Utensils,
  Shield, Zap, Clock, CheckCircle, Send,
  ShoppingCart, IndianRupee, AlertCircle
} from "lucide-react";
import {
  fetchPGById, fetchReviewsByPg, addReview,
  createRazorpayOrder, verifyRazorpayPayment
} from "../services/api";
import { useApp } from "../context/AppContext";

const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_XXXXXXXXXXXXXXXX";

const amenityIcons = {
  "Wi-Fi": Wifi, AC: Zap, Parking: Car, Meals: Utensils,
  Security: Shield, "Flexible Timing": Clock,
};

const StarPicker = ({ value, onChange }) => (
  <div className="flex gap-1">
    {[1,2,3,4,5].map(n => (
      <button key={n} type="button" onClick={() => onChange(n)}>
        <Star className={`w-6 h-6 ${n <= value ? "text-yellow-400 fill-current" : "text-gray-400"}`} />
      </button>
    ))}
  </div>
);

// Inject Razorpay script into page head
const loadRazorpayScript = () =>
  new Promise((resolve) => {
    // Already loaded
    if (window.Razorpay) { resolve(true); return; }
    const existing = document.getElementById("razorpay-script");
    if (existing) {
      existing.onload = () => resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.id    = "razorpay-script";
    script.src   = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload  = () => { console.log("Razorpay loaded"); resolve(true); };
    script.onerror = () => { console.error("Razorpay failed to load"); resolve(false); };
    document.head.appendChild(script);
  });

const RoomDetails = () => {
  const { id }    = useParams();
  const { darkMode, addToCart, user } = useApp();
  const navigate  = useNavigate();

  const [room, setRoom]         = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [imgIdx, setImgIdx]     = useState(0);
  const [checkIn,  setCheckIn]  = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [paying,   setPaying]   = useState(false);
  const [payMsg,   setPayMsg]   = useState({ type: "", text: "" });
  const [reviews,   setReviews]  = useState([]);
  const [myRating,  setMyRating] = useState(5);
  const [myComment, setMyComment]= useState("");
  const [reviewMsg, setReviewMsg]= useState("");

  // Pre-load Razorpay script as soon as page opens
  useEffect(() => { loadRazorpayScript(); }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const [pgData, reviewData] = await Promise.all([
          fetchPGById(id),
          fetchReviewsByPg(id),
        ]);
        setRoom(pgData);
        setReviews(reviewData || []);
      } catch (err) {
        setError(err.message || "Room not found");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handlePayment = async () => {
    if (!user)          { navigate("/login"); return; }
    if (!checkIn)       { setPayMsg({ type:"err", text:"Please select a check-in date." }); return; }
    if (!checkOut)      { setPayMsg({ type:"err", text:"Please select a check-out date." }); return; }
    if (checkOut <= checkIn) { setPayMsg({ type:"err", text:"Check-out must be after check-in." }); return; }

    setPaying(true);
    setPayMsg({ type:"", text:"" });

    try {
      // 1 — Make sure Razorpay is loaded
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        setPayMsg({ type:"err", text:"Could not load Razorpay. Please check your internet connection." });
        setPaying(false);
        return;
      }

      // 2 — Create order on backend
      console.log("Creating order for PG:", id, checkIn, checkOut);
      const order = await createRazorpayOrder(id, checkIn, checkOut);
      console.log("Order created:", order);

      // 3 — Open Razorpay popup
      const options = {
        key:         RAZORPAY_KEY,
        amount:      Math.round(order.amount * 100),
        currency:    "INR",
        name:        "ComfortPG",
        description: `Booking: ${order.pgName}`,
        order_id:    order.orderId,
        prefill:     { name: user.name, email: user.email },
        theme:       { color: "#7c3aed" },

        handler: async (response) => {
          console.log("Payment response:", response);
          try {
            const result = await verifyRazorpayPayment({
              razorpayOrderId:   response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              bookingId:         String(order.bookingId),
            });
            setPayMsg({ type:"ok", text:"✅ " + result.message });
            setPaying(false);
            setTimeout(() => navigate("/my-bookings"), 2500);
          } catch (err) {
            setPayMsg({ type:"err", text: err.message });
            setPaying(false);
          }
        },

        modal: {
          ondismiss: () => {
            setPayMsg({ type:"err", text:"Payment cancelled. Your booking is saved — pay anytime from My Bookings." });
            setPaying(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (response) => {
        setPayMsg({ type:"err", text: "Payment failed: " + response.error.description });
        setPaying(false);
      });
      rzp.open();

    } catch (err) {
      console.error("Payment error:", err);
      setPayMsg({ type:"err", text: err.message });
      setPaying(false);
    }
  };

  const handleAddToCart = () => {
    if (!room) return;
    addToCart(
      room,
      checkIn  || new Date().toISOString().split("T")[0],
      checkOut || new Date(Date.now()+30*24*60*60*1000).toISOString().split("T")[0]
    );
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!user) { navigate("/login"); return; }
    try {
      const rev = await addReview(Number(id), myRating, myComment);
      setReviews(prev => [rev.data || rev, ...prev]);
      setMyComment(""); setMyRating(5);
      setReviewMsg("Review submitted!");
    } catch (err) { setReviewMsg(err.message); }
  };

  const bg   = darkMode ? "bg-gray-900" : "bg-gray-50";
  const card = darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200";
  const txt  = darkMode ? "text-white" : "text-gray-900";
  const sub  = darkMode ? "text-gray-400" : "text-gray-500";
  const inp  = darkMode
    ? "bg-gray-700 border-gray-600 text-white"
    : "bg-white border-gray-300 text-gray-900";

  if (loading) return (
    <div className={`min-h-screen flex items-center justify-center ${bg}`}>
      <p className={sub}>Loading room details...</p>
    </div>
  );

  if (error || !room) return (
    <div className={`min-h-screen flex items-center justify-center ${bg}`}>
      <div className="text-center">
        <h1 className={`text-2xl font-bold mb-4 ${txt}`}>Room not found</h1>
        <Link to="/rooms" className="text-purple-500">← Back to rooms</Link>
      </div>
    </div>
  );

  const price  = room.price ?? room.rent ?? 0;
  const imgs   = room.images?.length ? room.images : room.primaryImage ? [room.primaryImage] : [];
  const imgUrl = imgs[imgIdx] || room.primaryImage || "";

  return (
    <div className={`min-h-screen py-12 ${bg}`}>
      <div className="max-w-7xl mx-auto px-4">

        <Link to="/rooms" className={`inline-flex items-center gap-2 mb-8 ${sub} hover:text-purple-500`}>
          <ArrowLeft className="w-4 h-4" /> Back to rooms
        </Link>

        <div className="grid lg:grid-cols-2 gap-10 mb-12">

          {/* Images */}
          <div>
            <img src={imgUrl} alt={room.name}
              className="w-full h-96 object-cover rounded-2xl" />
            {imgs.length > 1 && (
              <div className="grid grid-cols-6 gap-2 mt-3">
                {imgs.map((img, i) => (
                  <img key={i} src={img} alt="" onClick={() => setImgIdx(i)}
                    className={`h-16 w-full object-cover rounded-lg cursor-pointer
                      ${i === imgIdx ? "ring-2 ring-purple-500" : "opacity-60 hover:opacity-100"}`} />
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <h1 className={`text-3xl font-bold ${txt}`}>{room.name}</h1>

            <div className={`flex flex-wrap gap-3 mt-2 text-sm ${sub}`}>
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                {room.rating ?? 4.5} ({room.reviewCount ?? 0} reviews)
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />{room.city || "Location"}
              </span>
              <span className="px-2 py-0.5 rounded-full text-xs bg-purple-500/10 text-purple-400">
                {room.category}
              </span>
              <span className="px-2 py-0.5 rounded-full text-xs bg-blue-500/10 text-blue-400">
                {room.type}
              </span>
            </div>

            <p className={`text-3xl font-bold mt-4 ${txt}`}>
              ₹{price.toLocaleString()}
              <span className={`text-base font-normal ${sub}`}>/month</span>
            </p>

            <p className={`mt-4 text-sm leading-relaxed ${sub}`}>{room.description}</p>

            {/* Amenities */}
            <div className="mt-5 grid grid-cols-2 gap-2">
              {(room.amenities || []).map((a, i) => {
                const Icon = amenityIcons[a] || CheckCircle;
                return (
                  <div key={i} className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-green-500" />
                    <span className={`text-sm ${sub}`}>{a}</span>
                  </div>
                );
              })}
            </div>

            {/* Booking box */}
            <div className={`mt-8 rounded-2xl border p-5 ${card}`}>
              <h3 className={`font-semibold mb-1 ${txt}`}>Book this PG</h3>
              <p className={`text-xs mb-4 ${sub}`}>
                Secure payment via Razorpay. Booking confirmed instantly after payment.
              </p>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label className={`text-xs block mb-1 ${sub}`}>Check-in</label>
                  <input type="date" value={checkIn}
                    onChange={e => setCheckIn(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className={`w-full px-3 py-2 rounded-xl border text-sm
                      focus:outline-none focus:ring-2 focus:ring-purple-500 ${inp}`} />
                </div>
                <div>
                  <label className={`text-xs block mb-1 ${sub}`}>Check-out</label>
                  <input type="date" value={checkOut}
                    onChange={e => setCheckOut(e.target.value)}
                    min={checkIn || new Date().toISOString().split("T")[0]}
                    className={`w-full px-3 py-2 rounded-xl border text-sm
                      focus:outline-none focus:ring-2 focus:ring-purple-500 ${inp}`} />
                </div>
              </div>

              {/* Amount */}
              <div className={`flex justify-between items-center p-3 rounded-xl mb-4
                ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                <span className={`text-sm ${sub}`}>Monthly Rent</span>
                <span className={`font-bold text-lg ${txt}`}>
                  ₹{price.toLocaleString()}
                </span>
              </div>

              {/* Message */}
              {payMsg.text && (
                <div className={`flex items-start gap-2 p-3 rounded-xl mb-4 text-sm
                  ${payMsg.type === "ok"
                    ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                    : "bg-red-500/10 text-red-400 border border-red-500/20"}`}>
                  {payMsg.type === "ok"
                    ? <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    : <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />}
                  <span>{payMsg.text}</span>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={handlePayment}
                  disabled={paying}
                  className="flex-1 py-3 rounded-xl font-semibold text-white
                    bg-gradient-to-r from-purple-600 to-pink-600
                    hover:from-purple-700 hover:to-pink-700
                    transition disabled:opacity-60
                    flex items-center justify-center gap-2">
                  {paying ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30
                        border-t-white rounded-full animate-spin" />
                      Opening Razorpay...
                    </>
                  ) : (
                    <>
                      <IndianRupee className="w-4 h-4" />
                      Pay ₹{price.toLocaleString()} &amp; Book
                    </>
                  )}
                </button>
                <button onClick={handleAddToCart} title="Save to cart"
                  className={`p-3 rounded-xl border hover:border-purple-500/50 ${card}`}>
                  <ShoppingCart className={`w-5 h-5 ${txt}`} />
                </button>
              </div>

              {!user && (
                <p className={`text-xs text-center mt-3 ${sub}`}>
                  <Link to="/login" className="text-purple-400 font-medium">Login</Link> to book
                </p>
              )}

              <div className={`flex justify-center gap-4 mt-4 text-xs ${sub}`}>
                <span className="flex items-center gap-1">
                  <Shield className="w-3 h-3 text-green-500" /> Secure
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-blue-500" /> Instant confirmation
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className={`rounded-2xl border p-8 ${card}`}>
          <h2 className={`text-2xl font-bold mb-6 ${txt}`}>
            Reviews ({reviews.length})
          </h2>

          {user && (
            <form onSubmit={handleReview}
              className={`mb-8 p-5 rounded-xl border
                ${darkMode ? "bg-gray-700/50 border-gray-600" : "bg-gray-50 border-gray-200"}`}>
              <h3 className={`font-semibold mb-3 ${txt}`}>Write a Review</h3>
              <StarPicker value={myRating} onChange={setMyRating} />
              <textarea value={myComment} onChange={e => setMyComment(e.target.value)}
                required rows={3} placeholder="Share your experience..."
                className={`w-full mt-3 px-4 py-2.5 rounded-xl border text-sm
                  focus:ring-2 focus:ring-purple-500 ${inp}`} />
              {reviewMsg && <p className="text-sm text-purple-400 mt-2">{reviewMsg}</p>}
              <button type="submit"
                className="mt-3 flex items-center gap-2 px-5 py-2 rounded-xl
                  bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold">
                <Send className="w-4 h-4" /> Submit Review
              </button>
            </form>
          )}

          {reviews.length === 0 ? (
            <p className={sub}>No reviews yet. Be the first!</p>
          ) : (
            <div className="space-y-4">
              {reviews.map((r, i) => (
                <div key={r.id || i}
                  className={`p-5 rounded-xl border
                    ${darkMode ? "bg-gray-700/30 border-gray-700" : "bg-gray-50 border-gray-200"}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map(n => (
                        <Star key={n} className={`w-4 h-4
                          ${n <= r.rating ? "text-yellow-400 fill-current" : "text-gray-400"}`} />
                      ))}
                    </div>
                    <span className={`text-xs ${sub}`}>
                      {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ""}
                    </span>
                  </div>
                  <p className={`text-sm ${sub}`}>{r.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomDetails;