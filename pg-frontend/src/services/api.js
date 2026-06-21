const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8082";

const getAuthToken = () => localStorage.getItem("authToken");

const request = async (path, options = {}) => {
  const url     = `${API_BASE_URL}${path}`;
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  const token   = getAuthToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(url, { credentials: "include", ...options, headers });
  const json = await response.json();
  if (!response.ok) throw new Error(json?.message || response.statusText || "Request failed");
  return json;
};

// Auth
export const login  = (email, password) =>
  request("/api/auth/login",  { method:"POST", body: JSON.stringify({ email, password }) });
export const signup = (name, email, password, role="USER") =>
  request("/api/auth/signup", { method:"POST", body: JSON.stringify({ name, email, password, role }) });

// PGs
export const fetchPGs    = (query = {}) => {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([k,v]) => {
    if (v !== undefined && v !== null && v !== "") params.append(k, v);
  });
  return request(`/api/pgs/all?${params.toString()}`, { method:"GET" });
};
export const fetchPGById = (id) => request(`/api/pgs/${id}`, { method:"GET" });

// Owner
export const addPG               = (payload)    => request("/api/owner/pg/add",    { method:"POST",   body: JSON.stringify(payload) });
export const updatePG            = (id, data)   => request(`/api/owner/pg/${id}`,  { method:"PUT",    body: JSON.stringify(data) });
export const deletePG            = (id)         => request(`/api/owner/pg/${id}`,  { method:"DELETE" });
export const fetchMyPGs          = ()           => request("/api/owner/pg/my",     { method:"GET" });
export const fetchOwnerDashboard = ()           => request("/api/owner/dashboard", { method:"GET" });
export const updateBookingStatus = (id, status) =>
  request(`/api/owner/booking/${id}/status`, { method:"PUT", body: JSON.stringify({ status }) });

// Bookings
export const fetchMyBookings = () => request("/api/bookings/my", { method:"GET" });

// Payments
export const createRazorpayOrder  = (pgId, checkInDate, checkOutDate) =>
  request("/api/payments/create-order", {
    method: "POST",
    body: JSON.stringify({ pgId: String(pgId), checkInDate, checkOutDate })
  });
export const verifyRazorpayPayment = (data) =>
  request("/api/payments/verify", { method:"POST", body: JSON.stringify(data) });

// Reviews
export const fetchReviewsByPg = (pgId)                 => request(`/api/reviews/pg/${pgId}`, { method:"GET" });
export const addReview        = (pgId, rating, comment) =>
  request("/api/reviews/add", { method:"POST", body: JSON.stringify({ pgId, rating, comment }) });

// Notifications
export const fetchNotifications     = ()   => request("/api/notifications/me",          { method:"GET" });
export const markNotificationAsRead = (id) => request(`/api/notifications/${id}/read`,  { method:"PUT" });

// Bills
export const fetchMyBills = () => request("/api/bills/my", { method:"GET" });

// Admin
export const fetchAdminDashboard = ()           => request("/api/admin/dashboard",     { method:"GET" });
export const fetchAllBookings    = ()           => request("/api/admin/bookings",       { method:"GET" });
export const fetchAllUsers       = ()           => request("/api/admin/users",          { method:"GET" });
export const fetchOwnerEarnings  = ()           => request("/api/admin/owner-earnings", { method:"GET" });
export const fetchPendingPGs     = ()           => request("/api/admin/pgs/pending",    { method:"GET" });
export const verifyPG            = (id, action) =>
  request(`/api/admin/pgs/${id}/verify`, { method:"PUT", body: JSON.stringify({ action }) });