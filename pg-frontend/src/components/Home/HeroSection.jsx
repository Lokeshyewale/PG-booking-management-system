import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Shield, Wifi, Car } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const HeroSection = () => {
  const { darkMode } = useApp();

  const features = [
    { icon: Shield, text: 'Secure & Safe' },
    { icon: Wifi, text: 'High-Speed WiFi' },
    { icon: Car, text: 'Parking Available' },
    { icon: Star, text: 'Top Rated' }
  ];

  const colors = [
    'from-purple-500 to-indigo-500',
    'from-pink-500 to-red-400',
    'from-blue-500 to-cyan-400',
    'from-yellow-500 to-orange-400'
  ];

  const animations = [
    'animate-bounce',
    'animate-pulse',
    'animate-spin',
    'animate-bounce'
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background overlay */}
      <div className={`absolute inset-0 ${darkMode ? 'bg-black/20' : 'bg-black/50'}`} />

      {/* Floating blobs */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
        {/* Heading */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
          Find Your Perfect
          <span className="block mt-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            PG Home
          </span>
        </h1>

        <p className="text-gray-200 text-lg md:text-xl mt-6 max-w-3xl mx-auto">
          Comfortable, affordable and modern PG accommodations with all essential amenities.
        </p>

        {/* Features */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.text}
                className={`rounded-xl p-6 backdrop-blur-md transition transform hover:scale-110 ${
                  darkMode ? 'bg-gray-800/60' : 'bg-white/80'
                }`}
              >
                <div
                  className={`w-14 h-14 mx-auto mb-3 flex items-center justify-center rounded-2xl bg-gradient-to-r ${colors[index]} text-white ${animations[index]}`}
                >
                  <Icon className="w-6 h-6" />
                </div>

                <p className={`text-sm ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  {feature.text}
                </p>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-12 flex flex-col items-center gap-6">
          <span className="px-4 py-1 text-sm rounded-full bg-green-700 text-white flex items-center gap-2">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-ping"></span>
            24/7 Available Support
          </span>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/rooms"
              className="px-8 py-4 rounded-full text-white font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:scale-105 transition"
            >
              Explore Rooms
            </Link>

            <Link
              to="/about"
              className={`px-8 py-4 rounded-full font-semibold border backdrop-blur-md transition hover:scale-105 ${
                darkMode
                  ? 'bg-white/10 text-white border-purple-400'
                  : 'bg-white/20 text-white border-white/30'
              }`}
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;