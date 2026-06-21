import React from 'react';
import { Star, Quote } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const TestimonialsSection = () => {
  const { darkMode } = useApp();

  const testimonials = [
    {
      id: 1,
      name: 'Arjun Sharma',
      role: 'Software Engineer',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsbpujGiaaPEovRao89kU7HcUg--GGph-Xjg&s',
      rating: 5,
      comment:
        'Amazing PG with modern amenities. Great staff and perfect location for office commute.'
    },
    {
      id: 2,
      name: 'Priya Patel',
      role: 'CA Student',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsbpujGiaaPEovRao89kU7HcUg--GGph-Xjg&s',
      rating: 5,
      comment:
        'Clean rooms, good food, and top-notch security. Very comfortable stay.'
    },
    {
      id: 3,
      name: 'Rohit Kumar',
      role: 'Marketing Manager',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsbpujGiaaPEovRao89kU7HcUg--GGph-Xjg&s',
      rating: 5,
      comment:
        'Best PG experience ever. Professional management and great community.'
    },
    {
      id: 4,
      name: 'Sneha Reddy',
      role: 'MBA Student',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsbpujGiaaPEovRao89kU7HcUg--GGph-Xjg&s',
      rating: 5,
      comment:
        'Affordable, safe, and well-connected location near metro station.'
    }
  ];

  return (
    <section className={`py-20 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 text-center">

        {/* Heading */}
        <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          What Our Residents
          <span className="block mt-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Say About Us
          </span>
        </h2>

        <p className={`text-xl max-w-3xl mx-auto mb-16 ${
          darkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          Real feedback from residents who trust us for safe and comfortable living.
        </p>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {testimonials.map((t) => (
            <div
              key={t.id}
              className={`relative p-8 rounded-2xl border transition-all duration-300 hover:scale-105 group ${
                darkMode
                  ? 'bg-gray-900 border-gray-700'
                  : 'bg-white border-gray-200'
              }`}
            >
              {/* Quote icon */}
              <div className="absolute top-4 right-4 opacity-10">
                <Quote className="w-14 h-14 text-purple-500" />
              </div>

              {/* Profile */}
              <div className="flex items-center mb-6 text-left">
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-14 h-14 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className={`font-semibold ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {t.name}
                  </h4>
                  <p className="text-sm text-gray-500">{t.role}</p>
                </div>
              </div>

              {/* Rating */}
              <div className="flex mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 text-yellow-400 fill-current"
                  />
                ))}
              </div>

              {/* Comment */}
              <p className={`text-sm leading-relaxed ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                "{t.comment}"
              </p>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;