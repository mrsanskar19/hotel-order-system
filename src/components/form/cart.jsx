"use client"
import React from 'react';
import { useCart } from '@/hook/useCart';

export const CartForm = () => {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    getTotalPrice,
    submitCart
  } = useCart();

  return (
    <div>
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Cart is empty.</p>
      ) : (
        <form onSubmit={(e) => { e.preventDefault(); submitCart(); }}>
          <ul>
            {cartItems.map(item => (
              <li key={item.id}>
                <span>{item.name}</span>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) =>
                    updateQuantity(item.id, parseInt(e.target.value))
                  }
                />
                <button type="button" onClick={() => removeFromCart(item.id)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <h3>Total: ${getTotalPrice().toFixed(2)}</h3>
          <button type="submit">Submit Cart</button>
        </form>
      )}
    </div>
  );
};
