import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Layout from './components/Layout/Layout';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from './components/Layout/ProtectedRoute';

// Public pages
import Home from './pages/Home';
import Rooms from './pages/Rooms';
import RoomDetails from './pages/RoomDetails';
import About from './pages/About';
import Contact from './pages/Contact';
import FindBroker from './pages/FindBroker';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { Privacy, Terms, Funding, Partner, FAQ } from './pages/StaticPages';

// Authenticated pages (any role)
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import Cart from './pages/Cart';
import Payment from './pages/Payment';

// Student pages
import UserDashboard from './pages/UserDashboard';
import MyBookings from './pages/MyBooking';

// Owner pages
import OwnerDashboard from './pages/owner/OwnerDashboard';
import AddPg from './pages/owner/AddPg';
import MyPGs from './pages/owner/MyPGs';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';

// Smart redirect after login based on role
const RoleRedirect = () => {
  const { user } = useApp();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'ADMIN') return <Navigate to="/admin" replace />;
  if (user.role === 'OWNER') return <Navigate to="/owner" replace />;
  return <Navigate to="/dashboard" replace />;
};

function App() {
  return (
    <AppProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Layout />}>

            {/* Public */}
            <Route index element={<Home />} />
            <Route path="rooms" element={<Rooms />} />
            <Route path="room/:id" element={<RoomDetails />} />
            <Route path="find-broker" element={<FindBroker />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="privacy" element={<Privacy />} />
            <Route path="terms" element={<Terms />} />
            <Route path="funding" element={<Funding />} />
            <Route path="partner" element={<Partner />} />
            <Route path="faq" element={<FAQ />} />

            {/* Smart redirect after login */}
            <Route path="redirect" element={<RoleRedirect />} />

            {/* Any authenticated user */}
            <Route path="profile" element={
              <ProtectedRoute><Profile /></ProtectedRoute>
            } />
            <Route path="notifications" element={
              <ProtectedRoute><Notifications /></ProtectedRoute>
            } />
            <Route path="cart" element={
              <ProtectedRoute><Cart /></ProtectedRoute>
            } />
            <Route path="payment" element={
              <ProtectedRoute><Payment /></ProtectedRoute>
            } />

            {/* Student only */}
            <Route path="dashboard" element={
              <ProtectedRoute roles={['USER']}><UserDashboard /></ProtectedRoute>
            } />
            <Route path="my-bookings" element={
              <ProtectedRoute roles={['USER']}><MyBookings /></ProtectedRoute>
            } />

            {/* Owner only */}
            <Route path="owner" element={
              <ProtectedRoute roles={['OWNER', 'ADMIN']}><OwnerDashboard /></ProtectedRoute>
            } />
            <Route path="owner/add-pg" element={
              <ProtectedRoute roles={['OWNER', 'ADMIN']}><AddPG /></ProtectedRoute>
            } />
            <Route path="owner/my-pgs" element={
              <ProtectedRoute roles={['OWNER', 'ADMIN']}><MyPGs /></ProtectedRoute>
            } />

            {/* Admin only */}
            <Route path="admin" element={
              <ProtectedRoute roles={['ADMIN']}><AdminDashboard /></ProtectedRoute>
            } />

          </Route>
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;
