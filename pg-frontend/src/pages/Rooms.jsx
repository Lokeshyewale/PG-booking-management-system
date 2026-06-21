import React, { useState, useEffect } from "react";
import SearchBar from "../components/Rooms/SearchBar";
import CategoryFilter from "../components/Rooms/CategoryFilter";
import RoomCard from "../components/Rooms/RoomCard";
import { fetchPGs } from "../services/api";
import { useApp } from "../context/AppContext";

const Rooms = () => {
  const { darkMode } = useApp();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filters, setFilters] = useState({
    priceRange: [0, 20000],
    roomType: "",
    amenities: [],
  });

  useEffect(() => {
    const loadRooms = async () => {
      setLoading(true);
      setError(null);

      try {
        const query = {
          q: searchQuery || undefined,
          category: selectedCategory !== "all" ? selectedCategory : undefined,
          roomType: filters.roomType || undefined,
          maxRent: filters.priceRange[1] || undefined,
          amenity: filters.amenities.length ? filters.amenities.join(",") : undefined,
        };

        const data = await fetchPGs(query);
        setRooms(data);
      } catch (err) {
        setError(err.message || "Unable to load rooms.");
      } finally {
        setLoading(false);
      }
    };

    loadRooms();
  }, [searchQuery, selectedCategory, filters]);

  return (
    <div
      className={`min-h-screen py-12 ${
        darkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1
            className={`text-4xl font-bold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Find Your Perfect
            <span
              className={`block text-transparent bg-clip-text bg-linear-to-r from-purple-600 to-pink-600`}
            >
              PG
            </span>
          </h1>

          <p
            className={`mt-4 text-lg ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Browse and book comfortable PG rooms easily.
          </p>
        </div>

        <div className="mb-8">
          <SearchBar onSearch={setSearchQuery} onFilterChange={setFilters} />
        </div>

        <CategoryFilter
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        <div className="mt-10">
          <h2
            className={`text-xl font-semibold mb-6 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {loading
              ? "Loading rooms..."
              : `${rooms.length} Room${rooms.length !== 1 ? "s" : ""} Found`}
          </h2>

          {error ? (
            <p className="text-center py-10 text-red-400">{error}</p>
          ) : loading ? (
            <p className="text-center py-10 text-gray-500">Fetching rooms from the backend...</p>
          ) : rooms.length === 0 ? (
            <p
              className={`text-center py-10 ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              No rooms found. Try changing filters.
            </p>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {rooms.map((room) => (
                <RoomCard key={room.id} room={room} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Rooms;
