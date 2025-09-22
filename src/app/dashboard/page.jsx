'use client';

import { useState, useEffect } from 'react';
import { socket } from '@/lib/socket';
import Link from 'next/link';

export default function DashboardPage() {
  const [tableId, setTableId] = useState('');
  const [joinedTable, setJoinedTable] = useState(null);
  const [order, setOrder] = useState(null);
  const [newItem, setNewItem] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!socket) return;

    socket.on('connect', () => {
      setIsConnected(true);
      console.log('Client connected');
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Client disconnected');
    });

    socket.on('new_order', (newOrder) => {
      if (newOrder.tableId === joinedTable?.id) {
        setOrder(newOrder);
      }
    });

    socket.on('order_updated', (updatedOrder) => {
      if (updatedOrder.tableId === joinedTable?.id) {
        setOrder(updatedOrder);
      }
    });

    socket.on('order_closed', (closedOrderId) => {
      if (order?.id === closedOrderId) {
        setOrder(null);
      }
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('new_order');
      socket.off('order_updated');
      socket.off('order_closed');
    };
  }, [order, joinedTable]);

  const handleJoinTable = () => {
    if (tableId) {
      socket.emit('joinTable', tableId, (response) => {
        if (response.status === 'ok') {
          setJoinedTable(response.table);
        }
      });
    }
  };

  const handlePlaceOrder = () => {
    const orderData = {
      tableId: joinedTable.id,
      items: [{ name: 'Initial Item', quantity: 1, status: 'new' }],
      status: 'Pending',
    };
    socket.emit('placeOrder', orderData, (response) => {
      if (response.status === 'ok') {
        setOrder(response.order);
      }
    });
  };

  const handleAddItem = () => {
    if (newItem && order) {
      const itemData = {
        orderId: order.id,
        item: { name: newItem, quantity: 1, status: 'new' },
      };
      socket.emit('addItemToOrder', itemData, (response) => {
        if (response.status === 'ok') {
          setOrder(response.order);
          setNewItem('');
        }
      });
    }
  };

  const handleCloseOrder = () => {
    if (order) {
      socket.emit('closeOrder', order.id, (response) => {
        if (response.status === 'ok') {
          setOrder(null);
        }
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-center mb-6">Customer Dashboard</h1>
        <div className="flex justify-center items-center mb-6">
          <span className={`h-3 w-3 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
          <span className="text-sm">{isConnected ? 'Connected' : 'Disconnected'}</span>
        </div>

        <Link href="/admin">
          <button className="w-full py-2 px-4 bg-gray-500 text-white rounded-lg mb-4">Go to Admin Page</button>
        </Link>

        {!joinedTable ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={tableId}
              onChange={(e) => setTableId(e.target.value)}
              placeholder="Enter Table ID"
              className="flex-grow p-2 border rounded-lg"
            />
            <button onClick={handleJoinTable} className="px-4 py-2 bg-blue-600 text-white rounded-lg">
              Join Table
            </button>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Table: {joinedTable.id}</h2>
            {!order ? (
              <button onClick={handlePlaceOrder} className="w-full py-3 px-6 bg-green-600 text-white rounded-lg">
                Place New Order
              </button>
            ) : (
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold">Order ID: {order.id}</h3>
                  <p>Status: <span className="font-semibold">{order.status}</span></p>
                  <ul className="list-disc list-inside mt-2">
                    {order.items.map((item, index) => (
                      <li key={index}>{item.name} x{item.quantity} - <span className="text-sm">{item.status}</span></li>
                    ))}
                  </ul>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    placeholder="New Item"
                    className="flex-grow p-2 border rounded-lg"
                  />
                  <button onClick={handleAddItem} className="px-4 py-2 bg-blue-500 text-white rounded-lg">
                    Add Item
                  </button>
                </div>
                <button onClick={handleCloseOrder} className="w-full py-2 px-4 bg-red-600 text-white rounded-lg">
                  Close Order
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
