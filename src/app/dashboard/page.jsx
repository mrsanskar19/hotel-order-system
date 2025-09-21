"use client";

import { useState, useEffect } from 'react';
import { socket } from "@/lib/socket"

// Function to generate a unique ID for a new order
const generateOrderId = () => {
  return 'ORD-' + Math.random().toString(36).substring(2, 9).toUpperCase();
};

export default function HomePage() {
  const [orders, setOrders] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const connectSocket = async () => {
      // await fetch('/api/socket');

      socket.on('connect', () => {
        setIsConnected(true);
        console.log('Client connected to Socket.IO server.');
      });

      // Listen for a disconnect event
      socket.on('disconnect', () => {
        setIsConnected(false);
        console.log('Client disconnected from Socket.IO server.');
      });

      // Listen for the 'new_order' event from the server
      socket.on('new_order', (newOrder) => {
        console.log('New order received from server:', newOrder);
        setOrders((prevOrders) => [newOrder, ...prevOrders]);
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

  // Function to simulate a new order from the client
  const placeOrder = () => {
    const orderData = {
      id: generateOrderId(),
      item: `Coffee`, // Example item
      quantity: Math.floor(Math.random() * 5) + 1, // Random quantity
    };
    if (socket && isConnected) {
      // Emit the 'place_order' event to the server
      socket.emit('place_order', orderData);
    } else {
      console.error('Socket not connected. Cannot place order.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-center mb-6">Real-time Order System</h1>
        <div className="flex justify-center items-center mb-6">
          <span className={`h-3 w-3 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
          <span className="text-sm">{isConnected ? 'Connected to Server' : 'Disconnected'}</span>
        </div>
        <button
          onClick={placeOrder}
          className="w-full py-3 px-6 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200 mb-6"
        >
          Place New Order
        </button>

        <h2 className="text-2xl font-semibold mb-4">Live Orders</h2>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {orders.length > 0 ? (
            orders.map((order) => (
              <div key={order.id} className="bg-gray-50 p-4 rounded-lg shadow-sm">
                <p className="font-bold text-lg">{order.item} x{order.quantity}</p>
                <p className="text-sm text-gray-500">Order ID: {order.id}</p>
                <p className="text-sm text-gray-500">Status: <span className="font-semibold text-orange-500">{order.status}</span></p>
                <p className="text-xs text-gray-400 mt-1">{new Date(order.timestamp).toLocaleString()}</p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-400">No orders yet. Place one to see it appear here.</p>
          )}
        </div>
      </div>
    </div>
  );
}

