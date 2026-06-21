import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu, X, Sun, Moon, Home, MapPin, User,
  ShoppingCart, LogIn, Bell, Shield, BookOpen,
  LayoutDashboard, PlusCircle, List
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { darkMode, toggleDarkMode, cartItems, user, logout } = useApp();
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  // Role-specific navigation
  const publicNav = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Rooms', href: '/rooms', icon: MapPin },
    { name: 'Find Broker', href: '/find-broker', icon: User },
    { name: 'About', href: '/about', icon: User },
  ];

  const studentNav = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'My Bookings', href: '/my-bookings', icon: BookOpen },
    { name: 'Notifications', href: '/notifications', icon: Bell },
  ];

  const ownerNav = [
    { name: 'Dashboard', href: '/owner', icon: LayoutDashboard },
    { name: 'Add PG', href: '/owner/add-pg', icon: PlusCircle },
    { name: 'My PGs', href: '/owner/my-pgs', icon: List },
  ];

  const adminNav = [
    { name: 'Admin Panel', href: '/admin', icon: Shield },
  ];

  const getRoleNav = () => {
    if (!user) return [];
    if (user.role === 'ADMIN') return adminNav;
    if (user.role === 'OWNER') return ownerNav;
    return studentNav;
  };

  const navigation = [...publicNav, ...getRoleNav()];

  const roleBadgeColor = {
    ADMIN: 'bg-red-500/20 text-red-400',
    OWNER: 'bg-blue-500/20 text-blue-400',
    USER: 'bg-green-500/20 text-green-400',
  };

  const linkCls = (href) =>
    `flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition ${isActive(href)
      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
      : darkMode
        ? 'text-gray-300 hover:text-white hover:bg-gray-800'
        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'}`;

  return (
    <nav className={`fixed w-full top-0 z-50 backdrop-blur-md border-b
      ${darkMode ? 'bg-gray-900/90 border-gray-700' : 'bg-white/90 border-gray-200'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 shrink-0">
            <div className="w-9 h-9 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              ComfortPG
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center space-x-1 overflow-x-auto">
            {navigation.map(item => (
              <Link key={item.name} to={item.href} className={linkCls(item.href)}>
                <item.icon className="w-4 h-4 shrink-0" />
                <span className="whitespace-nowrap">{item.name}</span>
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center space-x-2">
            {/* Cart (students only) */}
            {(!user || user.role === 'USER') && (
              <Link to="/cart"
                className={`relative p-2 rounded-lg ${darkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}>
                <ShoppingCart className="w-5 h-5" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
              </Link>
            )}

            {/* User info */}
            <div className="hidden md:flex items-center">
              {user ? (
                <div className="flex items-center gap-2">
                  <Link to="/profile"
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm
                      ${darkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}>
                    <User className="w-4 h-4" />
                    <span className="max-w-[100px] truncate">{user.name}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium
                      ${roleBadgeColor[user.role] || roleBadgeColor.USER}`}>
                      {user.role}
                    </span>
                  </Link>
                  <button onClick={logout}
                    className={`px-3 py-1.5 rounded-lg text-sm
                      ${darkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}>
                    Logout
                  </button>
                </div>
              ) : (
                <Link to="/login"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm
                    bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium">
                  <LogIn className="w-4 h-4" /> Login
                </Link>
              )}
            </div>

            {/* Dark mode */}
            <button onClick={toggleDarkMode}
              className={`p-2 rounded-lg ${darkMode ? 'text-yellow-400 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'}`}>
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Mobile hamburger */}
            <button onClick={() => setIsOpen(!isOpen)}
              className={`md:hidden p-2 rounded-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className={`md:hidden border-t ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="px-4 py-3 space-y-1">
            {navigation.map(item => (
              <Link key={item.name} to={item.href} onClick={() => setIsOpen(false)}
                className={`flex items-center space-x-2 px-3 py-2.5 rounded-lg text-sm
                  ${isActive(item.href)
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                    : darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'}`}>
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            ))}
            <div className="border-t pt-2 mt-2 border-gray-700/30">
              {user ? (
                <>
                  <div className={`px-3 py-2 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {user.email} · {user.role}
                  </div>
                  <button onClick={() => { logout(); setIsOpen(false); }}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-400`}>
                    <LogIn className="w-4 h-4" /> Logout
                  </button>
                </>
              ) : (
                <Link to="/login" onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-purple-500">
                  <LogIn className="w-4 h-4" /> Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;