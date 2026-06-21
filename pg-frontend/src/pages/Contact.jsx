import React, { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { useApp } from "../context/AppContext";

const Contact = () => {
  const { darkMode } = useApp();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Form submitted:", formData);

    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-gray-900" : "bg-gray-50"
      } py-12`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1
            className={`text-4xl md:text-5xl font-bold ${
              darkMode ? "text-white" : "text-gray-900"
            } mb-6`}
          >
            Get in
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent block mt-2">
              Touch
            </span>
          </h1>

          <p
            className={`text-xl ${
              darkMode ? "text-gray-300" : "text-gray-600"
            } max-w-3xl mx-auto`}
          >
            We'd love to hear from you. Send us a message and we'll respond as
            soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <h2
              className={`text-2xl font-bold ${
                darkMode ? "text-white" : "text-gray-900"
              } mb-8`}
            >
              Contact Information
            </h2>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
                    Phone
                  </h3>
                  <p className={darkMode ? "text-gray-300" : "text-gray-600"}>
                    +91 9999999999
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
                    Email
                  </h3>
                  <p className={darkMode ? "text-gray-300" : "text-gray-600"}>
                    info@comfortpg.com
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
                    Address
                  </h3>
                  <p className={darkMode ? "text-gray-300" : "text-gray-600"}>
                    pune, India
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
                    Hours
                  </h3>
                  <p className={darkMode ? "text-gray-300" : "text-gray-600"}>
                    Mon - Fri: 9 AM - 6 PM
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div
            className={`rounded-2xl border p-8 ${
              darkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <h2
              className={`text-2xl font-bold ${
                darkMode ? "text-white" : "text-gray-900"
              } mb-8`}
            >
              Send Message
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full p-3 rounded-lg border"
                required
              />

              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full p-3 rounded-lg border"
                required
              />

              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone"
                className="w-full p-3 rounded-lg border"
              />

              <select
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full p-3 rounded-lg border"
                required
              >
                <option value="">Select Subject</option>
                <option value="booking">Booking</option>
                <option value="support">Support</option>
                <option value="feedback">Feedback</option>
              </select>

              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={5}
                className="w-full p-3 rounded-lg border"
                required
              />

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg flex items-center justify-center space-x-2"
              >
                <Send className="w-5 h-5" />
                <span>Send Message</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;