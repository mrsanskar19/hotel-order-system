"use client"
import { useState } from "react";
import { FaUtensils, FaBars, FaTimes, FaSearch } from "react-icons/fa";

export const AppHeader = ({name = "tset",table="01"}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header className="bg-white shadow-md w-full z-60">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left: Logo and Hotel Name */}
        <div className="flex items-center space-x-3">
          <FaUtensils className="text-red-500 text-2xl" />
          <h1 className="text-xl font-semibold text-gray-800">{name}</h1>
        </div>

        {/* Center: Search Bar (Hidden on small screens) */}
        <div className="hidden md:flex flex-1 mx-6">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search menu or orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-300"
            />
            <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
          </div>
        </div>

        {/* Right: Table ID and Menu Toggle */}
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-600 hidden sm:inline">
            Table <span className="font-semibold text-gray-800">{table}</span>
          </span>

          {/* Mobile Menu Button */}
          <button onClick={toggleMenu} className="md:hidden">
            {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile: Search and Nav */}
      {isOpen && (
        <div className="md:hidden px-4 pb-4 bg-gray-50 space-y-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-red-300"
            />
            <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
          </div>
          <div className="text-sm text-gray-600">
            Table: <span className="font-semibold text-gray-800">{table}</span>
          </div>
        </div>
      )}
    </header>
  );
};

