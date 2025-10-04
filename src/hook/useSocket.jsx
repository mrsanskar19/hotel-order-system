"use client"

// Socket.IO React hook
import { useEffect, useRef, useState } from "react"
import { socket } from "@/lib/socket"

export function useSocket() {
  const [isConnected, setIsConnected] = useState(false)
  const socketRef = useRef(null)

  useEffect(() => {
    socketRef.current = socket.connect()

    const handleConnect = () => setIsConnected(true)
    const handleDisconnect = () => setIsConnected(false)

    socketRef.current.on("connect", handleConnect)
    socketRef.current.on("disconnect", handleDisconnect)

    return () => {
      if (socketRef.current) {
        socketRef.current.off("connect", handleConnect)
        socketRef.current.off("disconnect", handleDisconnect)
      }
    }
  }, [])

  const emit = (event, data) => {
    if (socketRef.current) {
      socketRef.current.emit(event, data)
    }
  }

  const on = (event, callback) => {
    if (socketRef.current) {
      socketRef.current.on(event, callback)
    }
  }

  const off = (event, callback) => {
    if (socketRef.current) {
      socketRef.current.off(event, callback)
    }
  }

  return { socket: socketRef.current, isConnected, emit, on, off }
}

export function useOrderSocket(hotelId) {
  const { socket, isConnected, emit, on, off } = useSocket()
  const [orders, setOrders] = useState([])
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    if (socket && isConnected && hotelId) {
      socket.emit("join-hotel", hotelId)

      const handleNewOrder = (orderData) => {
        setOrders((prev) => [orderData, ...prev])
        setNotifications((prev) => [
          ...prev,
          {
            id: Date.now(),
            type: "order",
            message: `New order #${orderData.id} received`,
            timestamp: new Date(),
          },
        ])
      }

      const handleOrderUpdate = (data) => {
        setOrders((prev) =>
          prev.map((order) => (order.id === data.orderId ? { ...order, status: data.status } : order)),
        )
      }

      on("order-received", handleNewOrder)
      on("order-status-changed", handleOrderUpdate)

      return () => {
        off("order-received", handleNewOrder)
        off("order-status-changed", handleOrderUpdate)
      }
    }
  }, [socket, isConnected, hotelId, on, off])

  const updateOrderStatus = (orderId, status) => {
    emit("order-status-update", { orderId, status, hotelId })
  }

  return { orders, notifications, updateOrderStatus }
}

