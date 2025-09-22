"use client";

import { useState, useEffect } from 'react';
import { socket } from "@/lib/socket"

// Function to generate a unique ID for a new order
const generateOrderId = () => {
  return 'ORD-' + Math.random().toString(36).substring(2, 9).toUpperCase();
};

export default function AdminPage() {
  const [orders, setOrders] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const connectSocket = async () => {
      // await fetch('/api/socket');

      socket.on('connect', () => {
        setIsConnected(true);
        console.log('Admin connected to Socket.IO server.');
      });

      // Listen for a disconnect event
      socket.on('disconnect', () => {
        setIsConnected(false);
        console.log('Admin disconnected from Socket.IO server.');
      });

      // Listen for the 'new_order' event from the server
      socket.on('new_order', (newOrder) => {
        console.log('New order received from server:', newOrder);
        setOrders((prevOrders) => [newOrder, ...prevOrders]);
      });
      
      socket.on('order_updated', (updatedOrder) => {
        console.log('Order updated from server:', updatedOrder);
        setOrders((prevOrders) => prevOrders.map(order => order.id === updatedOrder.id ? updatedOrder : order));
      });

      // Clean up the socket connection on unmount
      return () => {
        if (socket) {
          socket.disconnect();
          console.log('Socket disconnected on component unmount.');
        }
      };
    };

    if (!socket) {
      connectSocket();
    }
  }, []);

  const updateOrderStatus = (orderId, status) => {
    if (socket && isConnected) {
      socket.emit('update_order_status', { orderId, status });
    } else {
      console.error('Socket not connected. Cannot update order status.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-center mb-6">Admin - Order Status</h1>
        <div className="flex justify-center items-center mb-6">
          <span className={`h-3 w-3 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
          <span className="text-sm">{isConnected ? 'Connected to Server' : 'Disconnected'}</span>
        </div>

        <h2 className="text-2xl font-semibold mb-4">All Orders</h2>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {orders.length > 0 ? (
            orders.map((order) => (
              <div key={order.id} className="bg-gray-50 p-4 rounded-lg shadow-sm flex justify-between items-center">
                <div>
                  <p className="font-bold text-lg">{order.item} x{order.quantity}</p>
                  <p className="text-sm text-gray-500">Order ID: {order.id}</p>
                  <p className="text-xs text-gray-400 mt-1">{new Date(order.timestamp).toLocaleString()}</p>
                </div>
                <div>
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                    className="p-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Preparing">Preparing</option>
                    <option value="Ready">Ready</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-400">No orders yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
