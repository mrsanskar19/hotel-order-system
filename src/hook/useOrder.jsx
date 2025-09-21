"use client"
import React, { createContext, useContext, useState, useEffect } from 'react';
import { socket } from '@/lib/socket';

const OrderContext = createContext();
export const useOrder = () => useContext(OrderContext);

export const OrderProvider = ({ children }) => {
  const [tempOrder, setTempOrder] = useState(null); // draft order before submit
  const [finalOrder, setFinalOrder] = useState(null); // saved to DB
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 1️⃣ Create TEMP ORDER locally or on server
  const createTempOrder = (orderDetails, cartItems) => {
    const temp = {
      id: Date.now(), // temp ID
      details: orderDetails,
      items: cartItems.map(item => ({
        ...item,
        status: 'pending' // per-item status
      })),
      createdAt: new Date().toISOString(),
    };
    setTempOrder(temp);
    setStatus('draft');
  };

  // 2️⃣ Submit to real DB (Close the Order)
  const closeOrder = async () => {
    if (!tempOrder) {
      setError("No order to submit");
      return;
    }

    setLoading(true);
    try {
      const resp = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tempOrder),
      });

      if (!resp.ok) throw new Error('Failed to close order');

      const data = await resp.json();
      setFinalOrder(data);
      setStatus(data.status || 'submitted');
      setTempOrder(null); // clear temp

      // Connect socket
      if (!socket.connected) socket.connect();

      socket.emit('joinOrderRoom', { orderId: data.id });

      socket.on('orderStatusUpdated', (update) => {
        if (update.orderId === data.id) {
          setStatus(update.status);
        }
      });

    } catch (err) {
      console.error(err);
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  // 3️⃣ Add new item to temp order
  const addItemToOrder = (newItem) => {
    if (!tempOrder) return;

    setTempOrder(prev => ({
      ...prev,
      items: [
        ...prev.items,
        { ...newItem, status: 'pending' }
      ]
    }));
  };

  // 4️⃣ Update item status (locally and optionally via API)
  const updateItemStatus = (itemId, newStatus) => {
    if (!tempOrder) return;

    setTempOrder(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.id === itemId ? { ...item, status: newStatus } : item
      )
    }));

    // Optional: sync with backend
    if (finalOrder) {
      socket.emit('updateItemStatus', {
        orderId: finalOrder.id,
        itemId,
        status: newStatus
      });
    }
  };

  // Clean up socket
  useEffect(() => {
    return () => {
      socket.off('orderStatusUpdated');
      if (finalOrder) {
        socket.emit('leaveOrderRoom', { orderId: finalOrder.id });
      }
    };
  }, [finalOrder]);

  return (
    <OrderContext.Provider value={{
      tempOrder,
      finalOrder,
      status,
      loading,
      error,
      createTempOrder,
      closeOrder,
      addItemToOrder,
      updateItemStatus
    }}>
      {children}
    </OrderContext.Provider>
  );
};
