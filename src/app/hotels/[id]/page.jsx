"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AppHeader, Footer, BottomNav } from "@/components/layout";

export default function Hotel() {
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {hotel?.menuItems?.map((item) => (
          <div key={item.id} className="border p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-2">{item.name}</h2>
            <p className="text-gray-700 mb-2">{item.description}</p>
            <p className="text-lg font-bold">${item.price.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
    </>
  );
}
