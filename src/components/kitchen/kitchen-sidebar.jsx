'use client';

import { useSidebar } from './sidebar-provider';
import { Badge } from '../ui';

const ActiveOrder = ({ order, onClick }) => {
  return (
    <div className="p-4 mb-4 bg-white rounded-lg shadow cursor-pointer" onClick={onClick}>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-800">Order #{order.id}</h3>
        <Badge color={order.status === 'completed' ? 'green' : 'red'}>
          {order.status}
        </Badge>
      </div>
      <p className="text-gray-600">{order.items.length} items</p>
    </div>
  );
};

const KitchenSidebar = ({ activeOrders, onOrderClick }) => {
  const { isOpen, toggleSidebar } = useSidebar();

  return (
    <div
      className={`fixed top-0 left-0 h-full w-80 bg-gray-100 p-4 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <button onClick={toggleSidebar} className="text-red-500 mb-4">
        Close
      </button>
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Active Orders</h2>
      <div>
        {activeOrders.map((order) => (
          <ActiveOrder key={order.id} order={order} onClick={() => onOrderClick(order)} />
        ))}
      </div>
    </div>
  );
};

export { KitchenSidebar };
