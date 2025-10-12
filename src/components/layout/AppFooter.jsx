'use client'
import { FaUtensils } from "react-icons/fa6";

export const AppFooter = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <FaUtensils className="text-red-500 text-3xl" />
            <h2 className="text-2xl font-semibold">FoodslinkX</h2>
          </div>
          <div className="text-center md:text-right">
            <p className="text-gray-400">&copy; {new Date().getFullYear()} FoodslinkX. All rights reserved.</p>
            <p className="text-gray-500">Your smart solution for hotel dining.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
