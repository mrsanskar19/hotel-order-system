'use client';

import React, { useEffect, useState } from 'react';
import { AiOutlineHome, AiOutlineShoppingCart } from 'react-icons/ai';
import { MdOutlineListAlt } from 'react-icons/md';
import { useCart } from '@/hook/useCart';
import { useOrder } from '@/hook/useOrder';

export function BottomNav({ onOpenCart,hotelId }) {
  const { cartItems } = useCart();
  const { tempOrder } = useOrder();
  const totalItems = cartItems.length;
  const orders = tempOrder;

  const [pathname, setPathname] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const activeOrdersCount = isClient
    ? orders?.filter((o) => o.status === 'Active')?.length
    : 0;

  const menuLink = `/hotels/${hotelId}`;
  const ordersLink = `/hotels/${hotelId}/orders`;

  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 bg-white shadow-lg rounded-t-3xl z-50 md:hidden">
      <div className="max-w-md mx-auto h-full">
        <div className="grid grid-cols-3 items-center h-full text-center">

          {/* Menu Link */}
          <a
            href={menuLink}
            className={`flex flex-col items-center justify-center gap-1 h-full ${
              pathname === menuLink ? 'text-blue-600' : 'text-gray-500'
            }`}
          >
            <AiOutlineHome className="w-6 h-6" />
            <span className="text-xs font-medium">Menu</span>
          </a>

          {/* Cart Button */}
          <div className="relative flex justify-center">
            <button
              onClick={onOpenCart}
              className="absolute -top-8 flex flex-col items-center justify-center gap-1 bg-white rounded-full w-16 h-16 border-4 border-white shadow-lg"
            >
              <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-red-600 text-white">
                <AiOutlineShoppingCart className="w-6 h-6" />
                {isClient && totalItems > 0 && (
<span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full text-[10px] px-1 h-5 min-w-[20px] flex items-center justify-center font-mono">
                    {totalItems}
                  </span>
                )}
              </div>
            </button>
          </div>

          {/* Orders Link */}
 <a
            href={ordersLink}
            className={`flex flex-col items-center justify-center gap-1 h-full relative ${
              pathname === ordersLink ? 'text-blue-600' : 'text-gray-500'
            }`}
          >
            <MdOutlineListAlt className="w-6 h-6" />
            <span className="text-xs font-medium">Orders</span>
 {isClient && activeOrdersCount > 0 && (
              <span className="absolute top-2 right-5 bg-red-600 text-white rounded-full text-[10px] px-1 h-5 min-w-[20px] flex items-center justify-center font-mono">
                {activeOrdersCount}
              </span>
            )}
          </a>
        </div>
      </div>
    </div>
  );
}

