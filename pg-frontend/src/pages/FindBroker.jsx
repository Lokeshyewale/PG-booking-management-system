import React, { useState, useMemo } from "react";
import { Search, Filter, Users, Star } from "lucide-react";
import BrokerCard from "../components/Brokers/BrokerCard";
import ChatModal from "../components/Brokers/ChatModal";
import { brokers } from "../data/brokers";
import { useApp } from "../context/AppContext";

const FindBroker = () => {
  const { darkMode } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedBroker, setSelectedBroker] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    minRating: 0,
    verified: false,
    minExperience: 0,
    specialty: "",
  });

  const cities = [...new Set(brokers.map((b) => b.city))];
  const specialties = [
    ...new Set(brokers.flatMap((b) => b.specialties)),
  ];

  const filteredBrokers = useMemo(() => {
    let filtered = brokers;

    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (b) =>
          b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.specialties.some((s) =>
            s.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    if (selectedCity) {
      filtered = filtered.filter((b) => b.city === selectedCity);
    }

    if (filters.minRating > 0) {
      filtered = filtered.filter((b) => b.rating >= filters.minRating);
    }

    if (filters.verified) {
      filtered = filtered.filter((b) => b.verified);
    }

    if (filters.minExperience > 0) {
      filtered = filtered.filter(
        (b) => b.experience >= filters.minExperience
      );
    }

    if (filters.specialty) {
      filtered = filtered.filter((b) =>
        b.specialties.includes(filters.specialty)
      );
    }

    return filtered.sort((a, b) => b.rating - a.rating);
  }, [searchQuery, selectedCity, filters]);

  const handleChatWithBroker = (broker) => {
    setSelectedBroker(broker);
    setIsChatOpen(true);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const avgRating =
    brokers.reduce((sum, b) => sum + b.rating, 0) / brokers.length;

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-gray-900" : "bg-gray-50"
      } py-12`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1
            className={`text-4xl md:text-5xl font-bold ${
              darkMode ? "text-white" : "text-gray-900"
            } mb-6`}
          >
            Find Your Perfect
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent block mt-2">
              PG Broker
            </span>
          </h1>

          <p
            className={`text-xl ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Connect with verified brokers and find the best PGs easily.
          </p>
        </div>

        {/* Search */}
        <div
          className={`rounded-2xl border p-6 mb-8 ${
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex flex-1 items-center space-x-2">
              <Search className="w-5 h-5" />
              <input
                placeholder="Search brokers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-3 rounded-lg border"
              />
            </div>

            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="p-3 rounded-lg border"
            >
              <option value="">All Cities</option>
              {cities.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-3 border rounded-lg flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="grid md:grid-cols-4 gap-4 mt-6">
              <select
                onChange={(e) =>
                  handleFilterChange("minRating", Number(e.target.value))
                }
              >
                <option value={0}>Any Rating</option>
                <option value={4.5}>4.5+</option>
                <option value={4}>4+</option>
              </select>

              <select
                onChange={(e) =>
                  handleFilterChange("minExperience", Number(e.target.value))
                }
              >
                <option value={0}>Any Experience</option>
                <option value={5}>5+ Years</option>
                <option value={3}>3+ Years</option>
              </select>

              <select
                onChange={(e) =>
                  handleFilterChange("specialty", e.target.value)
                }
              >
                <option value="">All Specialties</option>
                {specialties.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  onChange={(e) =>
                    handleFilterChange("verified", e.target.checked)
                  }
                />
                Verified Only
              </label>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="flex justify-between mb-6">
          <h2 className="text-xl font-bold">
            {filteredBrokers.length} Brokers Found
          </h2>

          <div className="flex gap-6 text-sm">
            <span>
              <Users className="inline w-4 h-4" /> {brokers.length} Total
            </span>
            <span>
              <Star className="inline w-4 h-4" /> Avg{" "}
              {avgRating.toFixed(1)}
            </span>
          </div>
        </div>

        {/* List */}
        {filteredBrokers.length === 0 ? (
          <p className="text-center text-gray-500">No brokers found</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {filteredBrokers.map((b) => (
              <BrokerCard
                key={b.id}
                broker={b}
                onChat={handleChatWithBroker}
              />
            ))}
          </div>
        )}

        {/* Chat */}
        {selectedBroker && (
          <ChatModal
            broker={selectedBroker}
            isOpen={isChatOpen}
            onClose={() => {
              setIsChatOpen(false);
              setSelectedBroker(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default FindBroker;