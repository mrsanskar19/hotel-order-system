"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);       
  const [token, setToken] = useState(null);     
  const [loading, setLoading] = useState(true); 
  const [hotelId, setHotelId] = useState(null);

  const router = useRouter();

  // 🔄 Load user & token from localStorage on first mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(parsedUser);
        setHotelId(parsedUser.hotel_id); // ✅ Now hotelId will be set correctly
      } catch (error) {
        console.error("Failed to parse user from localStorage", error);
        logout(); // fallback
      }
    }

    setLoading(false);
  }, []);

  // ✅ Login method
  const login = ({ token, user }) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setToken(token);
    setUser(user);
    setHotelId(user.hotel_id);
    router.push("/dashboard");
  };

  // ✅ Logout method
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    setHotelId(null);
    router.push("/login");
  };

  // ✅ Check auth method
  const checkAuth = () => {
    const currentToken = localStorage.getItem("token");
    const currentUser = localStorage.getItem("user");

    if (!currentToken || !currentUser) {
      logout();
      return false;
    }

    try {
      const parsedUser = JSON.parse(currentUser);
      setToken(currentToken);
      setUser(parsedUser);
      setHotelId(parsedUser.hotel_id);
      return true;
    } catch (error) {
      logout();
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, token, hotelId, loading, login, logout, checkAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Custom hook to access auth
export const useAuth = () => useContext(AuthContext);

