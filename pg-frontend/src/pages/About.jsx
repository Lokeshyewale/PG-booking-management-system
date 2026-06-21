import React from 'react';
import { Shield, Users, Star, Award, Heart, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';

const About = () => {
  const { darkMode } = useApp();

  const values = [
    {
      icon: Shield,
      title: 'Safety First',
      description:
        'We prioritize the safety and security of all our residents with 24/7 security and CCTV surveillance.',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: Users,
      title: 'Community',
      description:
        'Building a vibrant community where residents can connect, network, and create lasting friendships.',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Star,
      title: 'Excellence',
      description:
        'Committed to providing excellent service and maintaining the highest standards in accommodation.',
      color: 'from-yellow-500 to-orange-500',
    },
    {
      icon: Award,
      title: 'Quality',
      description:
        'Premium amenities and well-maintained facilities to ensure a comfortable living experience.',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Heart,
      title: 'Care',
      description:
        'We care about our residents well-being and strive to create a home away from home.',
      color: 'from-red-500 to-pink-500',
    },
    {
      icon: Zap,
      title: 'Innovation',
      description:
        'Constantly innovating to provide modern solutions and enhance the living experience.',
      color: 'from-indigo-500 to-purple-500',
    },
  ];

  const team = [
    {
      name: 'Rajesh Kumar',
      role: 'Founder & CEO',
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsbpujGiaaPEovRao89kU7HcUg--GGph-Xjg&s',
      description:
        'Visionary leader with 10+ years in hospitality industry.',
    },
    {
      name: 'Priya Sharma',
      role: 'Operations Manager',
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsbpujGiaaPEovRao89kU7HcUg--GGph-Xjg&s',
      description:
        'Expert in operations management and customer service.',
    },
    {
      name: 'Amit Patel',
      role: 'Property Manager',
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsbpujGiaaPEovRao89kU7HcUg--GGph-Xjg&s',
      description:
        'Specializes in property maintenance and resident relations.',
    },
    {
      name: 'Sneha Reddy',
      role: 'Customer Success',
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsbpujGiaaPEovRao89kU7HcUg--GGph-Xjg&s',
      description:
        'Dedicated to ensuring the best experience for all residents.',
    },
  ];

  return (
    <div
      className={`min-h-screen ${
        darkMode ? 'bg-gray-900' : 'bg-gray-50'
      } py-12`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16 py-5">
          <h1
            className={`text-4xl md:text-5xl font-excon font-bold ${
              darkMode ? 'text-white' : 'text-gray-900'
            } mb-6`}
          >
            About
            <span className="bg-gradient-to-r from-blue-600 to-sky-600 bg-clip-text text-transparent block mt-2 font-excon">
              ComfortPG
            </span>
          </h1>

          <p
            className={`text-base ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            } max-w-4xl mx-auto leading-relaxed font-poppins`}
          >
            We are dedicated to providing comfortable, secure, and affordable
            accommodation solutions for students and professionals. Our mission
            is to create a home away from home where residents can thrive and
            build lasting connections.
          </p>
        </div>

        {/* Story Section */}
        <div className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2
                className={`text-3xl font-synonym ${
                  darkMode ? 'text-white' : 'text-gray-900'
                } mb-6 font-bold`}
              >
                Our Story
              </h2>

              <p
                className={`text-base ${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                } mb-6 font-satoshi`}
              >
                Founded in 2021, ComfortPG began with a simple vision: to
                revolutionize the paying guest accommodation industry by
                providing safe, comfortable, and affordable living spaces for
                students and working professionals.
              </p>

              <p
                className={`text-base ${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                } mb-6 font-satoshi`}
              >
                What started as a small venture with a handful of rooms has
                grown into a trusted network of premium PG accommodations across
                major cities. We've housed over 5,000 happy residents and
                continue to expand our services to meet the growing demand for
                quality accommodation.
              </p>

              <p
                className={`text-base font-satoshi ${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}
              >
                Today, we're proud to be a leading name in the PG industry,
                known for our commitment to excellence, innovation, and creating
                communities that feel like home.
              </p>
            </div>

            <div className="relative">
              <img
                src="https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Our Story"
                className="rounded-2xl shadow-2xl"
              />

              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center">
                <Award className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Rest of your JSX remains exactly the same */}

      </div>
    </div>
  );
};

export default About;