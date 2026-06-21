import React from 'react';
import { Users, Home, Star, Calendar } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const StatsSection = () => {
  const { darkMode } = useApp();

  const stats = [
    {
      icon: Users,
      value: '5000+',
      label: 'Happy Residents',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Home,
      value: '200+',
      label: 'Available Rooms',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Star,
      value: '4.8',
      label: 'Average Rating',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: Calendar,
      value: '3+',
      label: 'Years Experience',
      color: 'from-purple-500 to-pink-500'
    }
  ];

  return (
    <section className={`relative py-20 overflow-hidden ${
      darkMode ? 'bg-gray-900' : 'bg-white'
    }`}>

      {/* Background glow */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/5 blur-3xl rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/5 blur-3xl rounded-full" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 text-center">

        {/* Heading */}
        <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Numbers That
          <span className="block mt-2 bg-gradient-to-r from-blue-600 to-sky-600 bg-clip-text text-transparent">
            Speak for Themselves
          </span>
        </h2>

        <p className={`text-xl max-w-3xl mx-auto mb-16 ${
          darkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          A trusted community of residents who rely on us for safe and comfortable living.
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className={`p-8 rounded-2xl text-center backdrop-blur-sm border transition transform hover:scale-105 group ${
                  darkMode
                    ? 'bg-gray-800/50 border-gray-700/50'
                    : 'bg-white/50 border-gray-200/50'
                }`}
              >
                {/* Icon */}
                <div
                  className={`w-20 h-20 mx-auto mb-6 flex items-center justify-center rounded-2xl bg-gradient-to-r ${stat.color} group-hover:scale-110 transition`}
                >
                  <Icon className="w-10 h-10 text-white" />
                </div>

                {/* Value */}
                <div className={`text-4xl md:text-5xl font-bold mb-2 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {stat.value}
                </div>

                {/* Label */}
                <div className={`text-lg ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {stat.label}
                </div>
              </div>
            );
          })}

        </div>
      </div>
    </section>
  );
};

export default StatsSection;