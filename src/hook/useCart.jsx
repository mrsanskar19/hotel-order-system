"use client"
import { createContext, useContext, useState, useEffect } from "react"

// Create context
const CartContext = createContext()

// Custom hook to use the cart context
export const useCart = () => useContext(CartContext)

// Provider
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([])
  const [favorites, setFavorites] = useState([])
  const [orderHistory, setOrderHistory] = useState([])

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    const savedFavorites = localStorage.getItem("favorites")
    const savedOrderHistory = localStorage.getItem("orderHistory")

    if (savedCart) {
      setCartItems(JSON.parse(savedCart))
    }
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites))
    }
    if (savedOrderHistory) {
      setOrderHistory(JSON.parse(savedOrderHistory))
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems))
  }, [cartItems])

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites))
  }, [favorites])

  useEffect(() => {
    localStorage.setItem("orderHistory", JSON.stringify(orderHistory))
  }, [orderHistory])

  // Add item to cart
  const addToCart = (product, quantity = 1) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === product.id)
      if (existingItem) {
        return prev.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item))
      } else {
        return [...prev, { ...product, quantity }]
      }
    })
  }

  // Remove item from cart
  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId))
  }

  // Update quantity
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId)
    } else {
      setCartItems((prev) => prev.map((item) => (item.id === productId ? { ...item, quantity } : item)))
    }
  }

  // Clear cart
  const clearCart = () => {
    setCartItems([])
  }

  // Get total price
  const getTotalPrice = () => {
    return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
  }

  // Get total items count
  const getTotalItems = () => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0)
  }

  const submitCart = async (customerInfo = {}) => {
    if (cartItems.length === 0) return null

    const order = {
      id: `ORD-${Date.now()}`,
      items: [...cartItems],
      total: getTotalPrice(),
      customerInfo,
      timestamp: new Date().toISOString(),
      status: "pending",
    }

    // Add to order history
    setOrderHistory((prev) => [order, ...prev])

    // Clear cart
    clearCart()

    console.log("Order submitted:", order)
    return order
  }

  const addToFavorites = (productId) => {
    setFavorites((prev) => (prev.includes(productId) ? prev : [...prev, productId]))
  }

  const removeFromFavorites = (productId) => {
    setFavorites((prev) => prev.filter((id) => id !== productId))
  }

  const toggleFavorite = (productId) => {
    setFavorites((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]))
  }

  const isFavorite = (productId) => {
    return favorites.includes(productId)
  }

  const value = {
    cartItems,
    cart: cartItems, // Alias for compatibility
    favorites,
    orderHistory,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
    submitCart,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
