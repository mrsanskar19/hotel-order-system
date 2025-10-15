'use client';

import { createContext, useContext } from 'react';
import { useSocket } from '@/hook/useSocket'; // Your base socket hook

// 1. Create a generic context for socket access
const SocketContext = createContext(null);

// 2. Create the main provider component
export const SocketProvider = ({ children }) => {
  // useSocket handles the core connection logic
  const { socket, isConnected, emit, on, off } = useSocket();

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        emit,
        on,
        off,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

// 3. Create a custom hook for easy context consumption
export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocketContext must be used within a SocketProvider');
  }
  return context;
};

// 4. Create a reusable UI component to display the connection status
export const ConnectionStatusIndicator = () => {
  const { isConnected } = useSocketContext();

  return (
    <div className="flex items-center space-x-2" title={isConnected ? 'Live Connection' : 'Disconnected'}>
      <span 
        className={`h-3 w-3 rounded-full transition-colors ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}
      />
      <span className="text-sm font-medium text-gray-800">
        {isConnected ? 'Connected' : 'Disconnected'}
      </span>
    </div>
  );
};
