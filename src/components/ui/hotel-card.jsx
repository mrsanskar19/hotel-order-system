'use client';
import Image from 'next/image';

const HotelCard = ({ hotel }) => {
  // Failsafe: If hotel is not a valid object, do not render the card.
  if (!hotel || typeof hotel !== 'object') {
    return null;
  }

  // Safely access the first image URL, whether `images` is a string or an array
  const imageUrl = Array.isArray(hotel.images) ? hotel.images[0] : hotel.images;

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition duration-300 transform hover:-translate-y-2">
      <div className="relative h-60 w-full overflow-hidden">
        <Image
          src={imageUrl || '/placeholder.jpg'} // Use the safe URL or a placeholder
          alt={hotel.name || 'Hotel'}
          layout="fill"
          objectFit="cover"
          className="transition-transform duration-300 hover:scale-110"
        />
      </div>
      <div className="p-6">
        <h3 className="text-2xl font-semibold text-gray-800 mb-3">{hotel.name || 'Unnamed Hotel'}</h3>
        <p className="text-gray-600 mb-4">Discover exquisite comfort and world-class service.</p>
        <button className="w-full bg-red-600 text-white py-2 rounded-md font-semibold hover:bg-red-700 transition duration-300">
          Explore Our Partners
        </button>
      </div>
    </div>
  );
};

export default HotelCard;
