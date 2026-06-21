import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Mail, Phone, MapPin, ExternalLink, Link2, MessageSquare, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const Footer = () => {
  const { darkMode } = useApp();

  const footerLinks = [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms & Conditions', href: '/terms' },
    { name: 'Funding Information', href: '/funding' },
    { name: 'Partner with Us', href: '/partner' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Contact', href: '/contact' }
  ];

  const socialLinks = [
    { icon: ExternalLink, href: '' },
    { icon: Link2, href: '' },
    { icon: MessageSquare, href: '' },
    { icon: User, href: '' }
  ];

  return (
    <footer className={`border-t ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
      <div className="max-w-7xl mx-auto px-4 py-12">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Logo + About */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                <Home className="w-6 h-6 text-white" />
              </div>
              <span className={`text-xl font-bold ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                ComfortPG
              </span>
            </Link>

            <p className={`text-sm max-w-md mb-4 ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Find affordable PG accommodations with modern amenities and safe living spaces.
            </p>

            {/* Social */}
            <div className="flex gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;

                return (
                  <a
                    key={social.href}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className={`transition ${
                      darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className={`text-sm font-bold uppercase mb-4 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Quick Links
            </h3>

            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className={`text-sm transition ${
                      darkMode
                        ? 'text-gray-400 hover:text-white'
                        : 'text-gray-600 hover:text-black'
                    }`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className={`text-sm font-bold uppercase mb-4 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Contact
            </h3>

            <div className="space-y-3 text-sm">

              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-500" />
                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                  info@comfortpg.com
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-500" />
                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                  +91 9999999999
                </span>
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                  pune, India
                </span>
              </div>

            </div>
          </div>

        </div>

        {/* Bottom */}
        <div className={`mt-8 pt-6 border-t flex flex-col md:flex-row justify-between items-center gap-4 ${
          darkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>

          <p className={`text-sm ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            © 2026 ComfortPG. All rights reserved.
          </p>

          <div className="flex gap-4 text-sm">
            <Link className={darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'} to="/privacy">
              Privacy
            </Link>
            <Link className={darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'} to="/terms">
              Terms
            </Link>
          </div>

        </div>

      </div>
    </footer>
  );
};

export default Footer;