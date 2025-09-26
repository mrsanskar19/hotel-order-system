"use client"
import { useState } from "react";
import { FaUtensils, FaBars, FaThemeisle, FaSearchengin, FaBarsStaggered } from "react-icons/fa6";
import { useSidebar } from ".";


export const AppHeader = ({name = "tset",table="01"}) => {
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

        {/* Right: Table ID and Menu Toggle */}
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-600 hidden sm:inline">
            Table <span className="font-semibold text-gray-800">{table}</span>
          </span>

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

    {/* Table Info */}
    <div className="text-sm text-gray-600">
      Table: <span className="font-semibold text-gray-800">{table}</span>
    </div>
  </div>
)}

    </header>
  );
};


export const DashboardHeader = () => {
  const { setSidebarOpen } = useSidebar();

  return (
    <header className="bg-white shadow-md p-4 flex items-center justify-between">
      <div className="flex items-center">
        <button
          onClick={() => setSidebarOpen(true)}
          className="md:hidden mr-4"
        >
          <FaBarsStaggered className="h-6 w-6" />
        </button>
        <h1 className="text-xl font-semibold">Dashboard</h1>
      </div>
    </header>
  );
};
