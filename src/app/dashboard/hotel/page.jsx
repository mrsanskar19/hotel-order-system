'use client';

import { useState } from 'react';
import { HotelItemForm } from '@/components/form/hotel-item-form';
import { CategoryForm } from '@/components/form/category-form';

const HotelDashboardPage = () => {
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Dummy data for now
  const hotelItems = [
    { id: 1, name: 'Standard Room', description: 'A cozy room with a queen-sized bed.', price: 100, category: 'Rooms' },
    { id: 2, name: 'Deluxe Room', description: 'A spacious room with a king-sized bed and a view.', price: 150, category: 'Rooms' },
    { id: 3, name: 'Breakfast Buffet', description: 'A delicious breakfast buffet.', price: 25, category: 'Food' },
  ];

  const handleCreateItem = () => {
    setEditingItem(null);
    setIsItemModalOpen(true);
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setIsItemModalOpen(true);
  };

  const handleItemFormSubmit = (data) => {
    if (editingItem) {
      // Handle update
    } else {
      // Handle create
    }
    setIsItemModalOpen(false);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Hotel Management</h1>

      <div className="mb-4 flex space-x-2">
        <button onClick={handleCreateItem} className="bg-blue-500 text-white px-4 py-2 rounded">Create Hotel Item</button>
        <button onClick={() => setIsCategoryModalOpen(true)} className="bg-green-500 text-white px-4 py-2 rounded">Create Category</button>
      </div>

      {/* Add table with search and sort here */}
      <div className="bg-white shadow rounded-lg p-4">
        <p>Table with search and sort will be here.</p>
      </div>

      {isItemModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <HotelItemForm initialData={editingItem} onSubmit={handleItemFormSubmit} />
            <button onClick={() => setIsItemModalOpen(false)} className="mt-4 bg-gray-500 text-white px-4 py-2 rounded">Close</button>
          </div>
        </div>
      )}

      {isCategoryModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <CategoryForm />
            <button onClick={() => setIsCategoryModalOpen(false)} className="mt-4 bg-gray-500 text-white px-4 py-2 rounded">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelDashboardPage;
