import React from 'react';
import { useApp } from '../../context/AppContext';

const CategoryFilter = ({ selectedCategory, onCategoryChange }) => {
  const { darkMode } = useApp();

  const categories = [
    { id: 'all', name: 'All PGs', color: 'from-gray-500 to-gray-600' },
    { id: 'Boys PG', name: 'Boys PG', color: 'from-blue-500 to-cyan-500' },
    { id: 'Girls PG', name: 'Girls PG', color: 'from-pink-500 to-purple-500' },
    { id: 'Mixed PG', name: 'Mixed PG', color: 'from-green-500 to-emerald-500' },
  ];

  return (
    <div className="flex flex-wrap gap-3 mb-8">
      {categories.map((category) => {
        const isActive = selectedCategory === category.id;

        return (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 border ${
              isActive
                ? `bg-gradient-to-r ${category.color} text-white shadow-lg transform scale-105 border-transparent`
                : darkMode
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border-gray-700'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200'
            }`}
          >
            {category.name}
          </button>
        );
      })}
    </div>
  );
};

export default CategoryFilter;
