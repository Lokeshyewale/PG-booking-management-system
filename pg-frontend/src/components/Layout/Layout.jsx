import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import LoadingScreen from './LoadingScreen';
import { useApp } from '../../context/AppContext';

const Layout = () => {
  const { darkMode, isLoading } = useApp();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className={`min-h-screen flex flex-col ${
      darkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>

      <Navbar />

      <main className="flex-1 pt-16">
        <Outlet />
      </main>

      <Footer />

    </div>
  );
};

export default Layout;