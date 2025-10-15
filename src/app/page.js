'use client';
import Head from 'next/head';
import { AppHeader } from "@/components/layout/app-header";
import { Skeleton } from '@/components/ui/skeleton';
import HotelCard from '@/components/ui/hotel-card';
import { useEffect, useState } from 'react';

export default function Home() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHotels = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/hotels');
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Failed to parse error response' }));
          throw new Error(errorData.message || `API Error: ${response.status}`);
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Invalid data format from API. Expected an array.");
        }

        setHotels(data);

      } catch (err) {
        console.error('Failed to fetch hotels:', err);
        setError(err.message);
        setHotels([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen">
      <Head>
        <title>Explore Our Hotels</title>
        <meta name="description" content="Find and book amazing hotels" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AppHeader />

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Partner Hotels</h2>
          <p className="text-xl text-gray-600">Explore a world of comfort and luxury with our trusted partners.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {loading && (
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <Skeleton className="h-60 w-full" />
                <div className="p-6">
                  <Skeleton className="h-8 w-3/4 mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              </div>
            ))
          )}

          {error && !loading && (
            <div className="col-span-full text-center text-red-500">
              <p>Error: {error}</p>
              <p>Could not load hotel information. Please try again later.</p>
            </div>
          )}

          {!loading && !error && (
            hotels.length > 0 ? (
              hotels.map((hotel) => (
                <HotelCard key={hotel.id || hotel.hotel_id} hotel={hotel} />
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500">
                <p>No partner hotels found at the moment.</p>
              </div>
            )
          )}
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-red-700 text-white text-center">
        <h2 className="text-4xl font-bold mb-4">
          Experience the Thrill with Bet Hero
        </h2>
        <p className="text-xl mb-8">
          Discover exciting opportunities and elevate your experience.
        </p>
      </section>

      <footer className="bg-gray-800 text-white text-center py-8">
        <p>&copy; 2023 Hotel Booking. All rights reserved.</p>
      </footer>
    </div>
  );
}
