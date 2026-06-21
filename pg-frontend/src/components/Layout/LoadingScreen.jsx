import React from 'react';
import { Home } from 'lucide-react';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 overflow-hidden">

      {/* Background blobs */}
      <div className="absolute inset-0">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full blur-3xl opacity-70 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full blur-3xl opacity-70 animate-pulse" />
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-blue-500 rounded-full blur-3xl opacity-70 animate-pulse" />
      </div>

      {/* Content */}
      <div className="relative text-center z-10">

        {/* Logo */}
        <div className="mb-8">
          <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 animate-bounce">
            <Home className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-4xl font-bold text-white">
            ComfortPG
          </h1>

          <p className="text-purple-200 mt-2">
            Find Your Perfect Home
          </p>
        </div>

        {/* Dots loader */}
        <div className="flex justify-center gap-2 mb-8">
          <span className="w-3 h-3 bg-white rounded-full animate-bounce" />
          <span className="w-3 h-3 bg-white rounded-full animate-bounce delay-150" />
          <span className="w-3 h-3 bg-white rounded-full animate-bounce delay-300" />
        </div>

        {/* Progress bar */}
        <div className="w-64 h-2 mx-auto bg-white/20 rounded-full overflow-hidden">
          <div className="h-full w-full bg-gradient-to-r from-purple-400 to-pink-400 animate-pulse" />
        </div>

        <p className="text-purple-200 mt-4 text-sm">
          Loading PG accommodations...
        </p>

      </div>
    </div>
  );
};

export default LoadingScreen;