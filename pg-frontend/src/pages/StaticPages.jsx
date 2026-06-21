import React from 'react';
import { useApp } from '../context/AppContext';

const StaticPage = ({ title, content }) => {
  const { darkMode } = useApp();

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} py-12`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl border p-8 md:p-12`}>
          <h1 className={`text-3xl md:text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-8`}>
            {title}
          </h1>
          <div className={`prose prose-lg max-w-none ${darkMode ? 'prose-invert' : ''}`}>
            {content}
          </div>
        </div>
      </div>
    </div>
  );
};

export const Privacy = () => {
  const { darkMode } = useApp();

  const content = (
    <div className="space-y-6">
      <p className={`${darkMode ? 'text-white/70' : 'text-gray-900'}`}>
        At ComfortPG, we are committed to protecting your privacy and ensuring the security of your personal information.
        This Privacy Policy explains how we collect, use, and safeguard your data when you use our services.
      </p>

      <h2 className={`text-2xl font-semibold mt-8 mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Information We Collect
      </h2>
      <p className={`${darkMode ? 'text-white/70' : 'text-gray-900'}`}>
        We collect information you provide directly to us, such as when you create an account, book a room, or contact us.
        This may include your name, email address, phone number, and payment information.
      </p>

      <h2 className={`text-2xl font-semibold mt-8 mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        How We Use Your Information
      </h2>
      <p className={`${darkMode ? 'text-white/70' : 'text-gray-900'}`}>
        We use the information we collect to provide, maintain, and improve our services, process transactions,
        communicate with you, and comply with legal obligations.
      </p>

      <h2 className={`text-2xl font-semibold mt-8 mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Data Security
      </h2>
      <p className={`${darkMode ? 'text-white/70' : 'text-gray-900'}`}>
        We implement appropriate technical and organizational measures to protect your personal information
        against unauthorized access, disclosure, or destruction.
      </p>

      <h2 className={`text-2xl font-semibold mt-8 mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Contact Us
      </h2>
      <p className={`${darkMode ? 'text-white/70' : 'text-gray-900'}`}>
        If you have any questions about this Privacy Policy, please contact us at privacy@comfortpg.com.
      </p>
    </div>
  );

  return <StaticPage title="Privacy Policy" content={content} />;
};

export const Terms = () => {
  const { darkMode } = useApp();

  const content = (
    <div className="space-y-6">
      <p className={`${darkMode ? 'text-white/70' : 'text-gray-900'}`}>
        Welcome to ComfortPG. These Terms and Conditions govern your use of our services.
        By accessing or using our platform, you agree to be bound by these terms.
      </p>

      <h2 className={`text-2xl font-semibold mt-8 mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Booking Terms
      </h2>
      <p className={`${darkMode ? 'text-white/70' : 'text-gray-900'}`}>
        All bookings are subject to availability and confirmation. Payment must be made according to the agreed terms.
      </p>

      <h2 className={`text-2xl font-semibold mt-8 mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        User Responsibilities
      </h2>
      <p className={`${darkMode ? 'text-white/70' : 'text-gray-900'}`}>
        You are responsible for maintaining the confidentiality of your account information and all activities under your account.
      </p>

      <h2 className={`text-2xl font-semibold mt-8 mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Prohibited Activities
      </h2>
      <p className={`${darkMode ? 'text-white/70' : 'text-gray-900'}`}>
        You may not use our services for illegal or unauthorized purposes or disrupt our platform.
      </p>

      <h2 className={`text-2xl font-semibold mt-8 mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Limitation of Liability
      </h2>
      <p className={`${darkMode ? 'text-white/70' : 'text-gray-900'}`}>
        We are not liable for indirect or consequential damages arising from use of our services.
      </p>
    </div>
  );

  return <StaticPage title="Terms & Conditions" content={content} />;
};

export const Funding = () => {
  const { darkMode } = useApp();

  const content = (
    <div className="space-y-6">
      <p className={`${darkMode ? 'text-white/70' : 'text-gray-900'}`}>
        ComfortPG is currently self-funded and supported by early investors.
      </p>

      <h2 className={`text-2xl font-semibold mt-8 mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Current Funding
      </h2>
      <p className={`${darkMode ? 'text-white/70' : 'text-gray-900'}`}>
        We use funds for platform development and expansion.
      </p>

      <h2 className={`text-2xl font-semibold mt-8 mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Investment Opportunities
      </h2>
      <p className={`${darkMode ? 'text-white/70' : 'text-gray-900'}`}>
        We are open to partnerships and investments aligned with our mission.
      </p>
    </div>
  );

  return <StaticPage title="Funding Information" content={content} />;
};

export const Partner = () => {
  const { darkMode } = useApp();

  const content = (
    <div className="space-y-6">
      <p className={`${darkMode ? 'text-white/70' : 'text-gray-900'}`}>
        Become a partner property owner with ComfortPG.
      </p>

      <h2 className={`text-2xl font-semibold mt-8 mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Benefits
      </h2>
      <ul className={`list-disc pl-6 space-y-2 ${darkMode ? 'text-white/70' : 'text-gray-900'}`}>
        <li>Property management</li>
        <li>Marketing support</li>
        <li>Guaranteed occupancy</li>
      </ul>
    </div>
  );

  return <StaticPage title="Partner with Us" content={content} />;
};

export const FAQ = () => {
  const { darkMode } = useApp();

  const faqs = [
    {
      question: "What is included in the room rent?",
      answer: "Accommodation, meals, Wi-Fi, electricity, and maintenance."
    },
    {
      question: "Is there a security deposit?",
      answer: "Yes, refundable deposit is required."
    },
    {
      question: "Can I visit before booking?",
      answer: "Yes, property visits are allowed."
    }
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} py-12`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-12">
          <h1 className={`text-3xl md:text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
            Frequently Asked Questions
          </h1>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl border p-6`}
            >
              <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-3`}>
                {faq.question}
              </h3>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {faq.answer}
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};