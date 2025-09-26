"use client";
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for a token in local storage or a cookie
    const token = localStorage.getItem('token');
    if (token) {
      // Here you would typically validate the token with your backend
      // and fetch user data.
      // For this example, we'll just set a mock user.
      setUser({ name: 'Admin User' });
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    localStorage.setItem('token', 'some-dummy-token');
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
