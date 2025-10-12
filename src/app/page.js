import Head from 'next/head';
import Image from 'next/image';
import {AppHeader} from "@/components/layout/AppHeader"

 
export default function Home({}) {
  

  const hotels = [
    { name: 'Luxury Hotel', image: '/luxury-hotel-exterior.png' },
    { name: 'Ocean Resort', image: '/ocean-resort.jpg' },
    { name: 'Cozy Lodge', image: '/cozy-mountain-lodge.png' },
    { name: 'Modern Stay', image: '/modern-hotel.png' },
  ];

  return (
    <div className="bg-gray-100 min-h-screen">
 
      <Head>
        <title>Explore Our Hotels</title>
        <meta name="description" content="Find and book amazing hotels" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Hero Section with basic animation using Tailwind utilities */}
      <AppHeader/>

      {/* Hotels Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Partner Hotels</h2>
          <p className="text-xl text-gray-600">Explore a world of comfort and luxury with our trusted partners.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {hotels.map((hotel, index) => {
 return (
              <div
                key={hotel.name}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition duration-300 transform hover:-translate-y-2"
              >
                <div className="relative h-60 w-full overflow-hidden">
                  <Image
                    src={hotel.image}
                    alt={hotel.name}
                    layout="fill"
                    objectFit="cover"
                    className="transition-transform duration-300 hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-3">{hotel.name}</h3>
                  <p className="text-gray-600 mb-4">Discover exquisite comfort and world-class service at {hotel.name}.</p>
                  <button className="w-full bg-red-600 text-white py-2 rounded-md font-semibold hover:bg-red-700 transition duration-300">
                    Explore Our Partners
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Bet Hero Section with basic animation using Tailwind utilities */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-red-700 text-white text-center">
        <h2
          className="text-4xl font-bold mb-4"

        >
          Experience the Thrill with Bet Hero
        </h2>
        <p
          className="text-xl mb-8"
        >
          Discover exciting opportunities and elevate your experience.
        </p>
        {/* Add more content related to Bet Hero here */}
      </section>

      {/* Footer Placeholder */}
      <footer className="bg-gray-800 text-white text-center py-8">
        <p>&copy; 2023 Hotel Booking. All rights reserved.</p>
      </footer>
    </div>
 
 );
}