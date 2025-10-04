"use client"

// Socket.IO context provider
import { createContext, useContext, useEffect, useState } from "react"
import { useSocket } from "@/hook/useSocket"

const SocketContext = createContext()

export function SocketProvider({ children }) {
  const { socket, isConnected, emit, on, off } = useSocket()
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    if (socket && isConnected) {
      const handleNotification = (notification) => {
        setNotifications((prev) => [
          ...prev,
          {
            ...notification,
            id: Date.now(),
            timestamp: new Date(),
          },
        ])
      }

      on("notification", handleNotification)

      return () => {
        off("notification", handleNotification)
      }
    }
  }, [socket, isConnected, on, off])

  const clearNotifications = () => {
    setNotifications([])
  }

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        emit,
        on,
        off,
        notifications,
        clearNotifications,
        removeNotification,
      }}
    >
      {children}
    </SocketContext.Provider>
  )
}

export const useSocketContext = () => {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error("useSocketContext must be used within a SocketProvider")
  }
  return context
}
