"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button"; // Assuming you still want Shadcn UI Button
import { useRouter } from "next/navigation";

const HotelsPage = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  const fetchHotels = async () => {
    try {
      const response = await fetch("/api/hotels"); // Assuming your API endpoint to get all hotels
      if (!response.ok) {
        throw new Error("Failed to fetch hotels");
      }
      const data = await response.json();
      setHotels(data);
    } catch (err) {
      setError(err.message);
      alert("Failed to load hotels."); // Using a simple alert
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  const handleDelete = async (hotelId) => {
    if (window.confirm("Are you sure you want to delete this hotel?")) {
      try {
        const response = await fetch(`/api/hotels/${hotelId}`, { // Assuming your API endpoint for deleting a hotel
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete hotel");
        }

        alert("Hotel deleted successfully."); // Using a simple alert
        fetchHotels(); // Refresh the list after deletion
      } catch (err) {
        console.error("Error deleting hotel:", err);
        alert(err.message || "Failed to delete hotel."); // Using a simple alert for error
      }
    }
  };

  if (loading) {
    return <div className="container mx-auto p-4 text-center">Loading hotels...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-center text-red-600">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Hotels</h1>
        <Link href="/admin/hotels/new">
          <Button>Add New Hotel</Button>
        </Link>
      </div>

      {hotels.length === 0 ? (
        <p>No hotels found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Address
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Active
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Verified
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {hotels.map((hotel) => (
                <tr key={hotel._id}> {/* Assuming _id is the unique identifier */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {hotel.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {hotel.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {hotel.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {hotel.address}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {hotel.is_active ? "Yes" : "No"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {hotel.is_verify ? "Yes" : "No"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Link href={`/admin/hotels/edit/${hotel._id}`}> {/* Link to edit page */}
                        <Button variant="outline" size="sm">Edit</Button> {/* Assuming you still want Shadcn Button */}
                      </Link>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(hotel._id)}> {/* Assuming you still want Shadcn Button */}
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default HotelsPage;
