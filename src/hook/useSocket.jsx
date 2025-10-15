'use client';

import { useEffect, useRef, useState } from "react";
import { socket } from "@/lib/socket";

export function useSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    // Connect to the socket server
    socketRef.current = socket.connect();

    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);

    socketRef.current.on("connect", handleConnect);
    socketRef.current.on("disconnect", handleDisconnect);

    return () => {
      if (socketRef.current) {
        socketRef.current.off("connect", handleConnect);
        socketRef.current.off("disconnect", handleDisconnect);
        socketRef.current.disconnect();
      }
    };
  }, []);

  // Wrapper for emitting events
  const emit = (event, data) => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit(event, data);
    }
  };

  // Wrapper for listening to events
  const on = (event, callback) => {
    if (socketRef.current) {
      socketRef.current.on(event, callback);
    }
  };

  // Wrapper for removing event listeners
  const off = (event, callback) => {
    if (socketRef.current) {
      socketRef.current.off(event, callback);
    }
  };

  // Function to get dashboard data
  const getDashboardData = () => {
    emit("dashboard:get-data");
  };

  // Function to get active orders
  const getActiveOrders = () => {
    emit("orders:get-active");
  };

  // Function to place a new order
  const placeOrder = (orderData) => {
    emit("orders:place-new", orderData);
  };

  // Function to update an existing order
  const updateOrder = (orderId, updates) => {
    emit("orders:update", { orderId, ...updates });
  };

  // Function to close an order
  const closeOrder = (orderId) => {
    emit("orders:close", { orderId });
  };

  return {
    socket: socketRef.current,
    isConnected,
    emit,
    on,
    off,
    getDashboardData,
    getActiveOrders,
    placeOrder,
    updateOrder,
    closeOrder,
  };
}
