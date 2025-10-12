"use client"
import { useState } from "react";
import { FaUtensils, FaBars, FaThemeisle, FaSearchengin, FaBarsStaggered } from "react-icons/fa6";
import Link from "next/link";


export const AppHeader = ({name = "FoodslinkX"}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header className="bg-white shadow-md w-full fixed top-0 left-0 z-50">
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
            <FaSearchengin className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
          </div>
        </div>

        {/* Right: Buttons and Menu Toggle */}
        <div className="flex items-center space-x-4">
            <Link href="/explore">
                <button className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">Explore</button>
            </Link>
            <button className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">Book our Smart Solution</button>
        
          {/* Mobile Menu Button */}
          <button onClick={toggleMenu} className="md:hidden">
            {isOpen ? <FaThemeisle size={20} /> : <FaBars size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile: Search and Nav */}
      {isOpen && (
        <div className="md:hidden fixed top-16 left-0 w-full z-40 bg-gray-50 px-4 pb-4 pt-4 space-y-4 shadow-md">
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-red-300"
            />
            <FaSearchengin className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
          </div>
        </div>
      )}
    </header>
  );
};
