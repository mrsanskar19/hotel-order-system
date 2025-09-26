'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useCart } from '@/hook/useCart';
import { FaTimes } from 'react-icons/fa'; // Close icon

export const CartForm = ({isOpen,setIsOpen}) => {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    getTotalPrice,
    submitCart
  } = useCart();

  const [isDragging, setIsDragging] = useState(false);
  const startY = useRef(0);
  const currentY = useRef(0);

  // Lock background scroll when cart is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }

    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isOpen]);

  const handleTouchStart = (e) => {
    startY.current = e.touches[0].clientY;
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    currentY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = () => {
    const distance = currentY.current - startY.current;
    if (distance > 100) {
      // Close cart if dragged down enough
      setIsOpen(false);
    }
    setIsDragging(false);
  };

  return (
    <>
      {/* Overlay (background dimmer) */}
      
      {/* Cart Drawer */}
      {isOpen && (
        <div
          className={`
            fixed
            md:top-0 md:right-0 md:bottom-0 md:w-80
            bottom-6 left-0 right-0
            bg-white
            z-50
            p-4
            overflow-y-auto
            md:border-l
            max-h-[80vh] md:max-h-screen
            transition-transform duration-300 ease-in-out
            rounded-t-xl md:rounded-none
            shadow-2xl
          `}
          style={{ touchAction: 'none' }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Close Button */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <FaTimes size={18} />
          </button>

          {/* Drag handle (mobile only) */}
          <div className="md:hidden w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6 mt-2" />

          <h2 className="text-xl font-semibold mb-4">Your Cart</h2>

          {cartItems.length === 0 ? (
            <p className="text-gray-500">Cart is empty.</p>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submitCart();
              }}
              className="space-y-4 pb-20" // spacing for bottom nav
            >
              <ul className="space-y-4">
                {cartItems.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between gap-2 border-b pb-2"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.name}</p>
                      <input
                        type="number"
                        min="1"
                        className="mt-1 w-16 p-1 border rounded text-sm"
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(item.id, parseInt(e.target.value))
                        }
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 text-sm"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>

              <div className="flex justify-between items-center pt-4 border-t">
                <h3 className="text-lg font-bold">Total:</h3>
                <span className="text-lg font-semibold text-green-600">
                  ${getTotalPrice().toFixed(2)}
                </span>
              </div>

              <button
                type="submit"
                className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
              >
                Submit Cart
              </button>
            </form>
          )}
        </div>
      )}
    </>
  );
};

