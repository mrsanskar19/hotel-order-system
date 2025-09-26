"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AppHeader, Footer, BottomNav } from "@/components/layout";

export default function Hotel() {
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('All');

  // Extract unique categories
  const categories = ['All', ...new Set(hotel?.menuItems?.map(item => item.category))];

  // Filter items based on selected category
  const filteredItems =
    selectedCategory === 'All'
      ? hotel?.menuItems
      : hotel?.menuItems?.filter(item => item.category === selectedCategory);

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const response = await fetch(`/api/hotels/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setHotel(data);
      } catch (error) {
        console.error("Error fetching hotel:", error);
      } finally {
        
      }
    };

    fetchHotel();
  }, [id]); // Added id as a dependency

  if (!hotel) {
 return (
 <div className="flex flex-col justify-center items-center h-screen text-center">
 <h2 className="text-2xl font-bold mb-4">Hotel not found</h2>
 <p className="text-gray-700 mb-6">
 It seems the QR code or link you used is incorrect or expired.
 </p>
 <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={() => window.location.reload()}>Please try rescanning the QR code.</button>
 </div>);
  }

  return (
  <>
  
     <div className="container mx-auto p-4">
      {/* Category Filter */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        {categories?.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              selectedCategory === category
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-blue-100'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems?.length > 0 ? (
          filteredItems?.map(item => (
            <div key={item.id} className="border p-4 rounded shadow bg-white">
              <h2 className="text-xl font-semibold mb-2">{item.name}</h2>
              <p className="text-gray-600 mb-2">{item.description}</p>
              <div className="text-lg font-bold text-green-700">${item.price.toFixed(2)}</div>
              <p className="text-sm text-gray-500 mt-1">Category: {item.category}</p>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">No items found in this category.</p>
        )}
      </div>
    </div>
    </>
  );
}
