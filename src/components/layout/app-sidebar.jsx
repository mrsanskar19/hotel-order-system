'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AiOutlineHome, AiOutlineShoppingCart } from 'react-icons/ai';
import {
  MdOutlineListAlt,
  MdOutlineDashboard,
  MdOutlineTableRows,
  MdOutlineQrCode2,
  MdOutlineSecurity,
  MdOutlineGroup,
  MdOutlineSettings
} from 'react-icons/md';
import { useCart } from '@/hook/useCart';
import { useOrder } from '@/hook/useOrder';

export function HotelSidebar({ onOpenCart, hotelId }) {
  const { cartItems } = useCart();
  const { tempOrder } = useOrder();
  const totalItems = cartItems.length;
  const orders = tempOrder;

  const [pathname, setPathname] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setPathname(window.location.pathname);
  }, []);

  const activeOrdersCount = isClient
    ? orders?.filter((o) => o.status === 'Active')?.length
    : 0;

  const menuLink = `/hotels/${hotelId}`;
  const ordersLink = `/hotels/${hotelId}/orders`;

  return (
    <>
      {/* Sidebar for Desktop */}
      <div className="hidden md:flex md:flex-col md:fixed md:top-0 md:left-0 md:h-full md:w-20 bg-gray-800 text-white shadow-lg z-50">
        <div className="flex flex-col items-center py-6 space-y-8 h-full mt-10">
          <Link href={menuLink} className={`flex flex-col items-center gap-1 ${pathname === menuLink ? 'text-blue-400' : 'text-gray-300'} hover:text-blue-400`}>
            <AiOutlineHome className="w-6 h-6" />
            <span className="text-xs">Menu</span>
          </Link>
          <div className="relative flex flex-col items-center gap-1">
            <button onClick={onOpenCart} className="relative flex flex-col items-center text-gray-300 hover:text-blue-400">
              <AiOutlineShoppingCart className="w-6 h-6" />
              <span className="text-xs">Cart</span>
              {isClient && totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full text-[10px] px-1 h-5 min-w-[20px] flex items-center justify-center font-mono">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
          <Link href={ordersLink} className={`relative flex flex-col items-center gap-1 ${pathname === ordersLink ? 'text-blue-400' : 'text-gray-300'} hover:text-blue-400`}>
            <MdOutlineListAlt className="w-6 h-6" />
            <span className="text-xs">Orders</span>
            {isClient && activeOrdersCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full text-[10px] px-1 h-5 min-w-[20px] flex items-center justify-center font-mono">
                {activeOrdersCount}
              </span>
            )}
          </Link>
        </div>
      </div>
      {/* Bottom Nav for Mobile */}
       <div className="fixed bottom-0 left-0 right-0 h-20 bg-gray-800 text-white shadow-lg rounded-t-3xl z-50 md:hidden">
        <div className="max-w-md mx-auto h-full">
          <div className="grid grid-cols-3 items-center h-full text-center">
            <Link href={menuLink} className={`flex flex-col items-center justify-center gap-1 h-full ${pathname === menuLink ? 'text-blue-400' : 'text-gray-300'}`}>
              <AiOutlineHome className="w-6 h-6" />
              <span className="text-xs font-medium">Menu</span>
            </Link>
            <div className="relative flex justify-center">
              <button onClick={onOpenCart} className="absolute -top-8 flex flex-col items-center justify-center gap-1 bg-gray-700 rounded-full w-16 h-16 border-4 border-gray-800 shadow-lg">
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
            <Link href={ordersLink} className={`flex flex-col items-center justify-center gap-1 h-full relative ${pathname === ordersLink ? 'text-blue-400' : 'text-gray-300'}`}>
              <MdOutlineListAlt className="w-6 h-6" />
              <span className="text-xs font-medium">Orders</span>
              {isClient && activeOrdersCount > 0 && (
                <span className="absolute top-2 right-5 bg-red-600 text-white rounded-full text-[10px] px-1 h-5 min-w-[20px] flex items-center justify-center font-mono">
                  {activeOrdersCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export function DashboardSidebar() {
  const pathname = usePathname();
  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: MdOutlineDashboard },
    { href: '/dashboard/orders', label: 'Orders', icon: MdOutlineListAlt },
    { href: '/dashboard/menu', label: 'Menu', icon: MdOutlineTableRows },
    { href: '/dashboard/qr-code', label: 'QR Code', icon: MdOutlineQrCode2 },
  ];

  return (
    <>
      <aside className="hidden md:flex flex-col w-64 bg-gray-800 text-white min-h-screen p-4">
        <nav>
          <ul>
            {navLinks.map((link) => {
                const Icon = link.icon
                return(
              <li key={link.href} className="mb-2">
                <Link href={link.href} className={`flex items-center gap-2 p-2 rounded hover:bg-gray-700 ${pathname === link.href ? 'bg-gray-900' : ''}`}>
                    <Icon className="h-6 w-6" />
                    <span>{link.label}</span>
                </Link>
              </li>
            )})}
          </ul>
        </nav>
      </aside>
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white flex justify-around md:hidden p-2">
        {navLinks.map((link) => {
            const Icon = link.icon;
            return (
            <Link key={link.href} href={link.href} className={`flex flex-col items-center text-xs ${pathname === link.href ? "text-blue-400" : ""}`}>
                <Icon className="h-6 w-6" />
                <span>{link.label}</span>
            </Link>
            );
        })}
        </div>
    </>
  );
}

export function AdminSidebar() {
    const pathname = usePathname();
    const navLinks = [
      { href: '/admin', label: 'Admin', icon: MdOutlineSecurity },
      { href: '/admin/users', label: 'Users', icon: MdOutlineGroup },
      { href: '/admin/settings', label: 'Settings', icon: MdOutlineSettings },
    ];
  
    return (
      <>
        <aside className="hidden md:flex flex-col w-64 bg-gray-800 text-white min-h-screen p-4">
          <nav>
            <ul>
              {navLinks.map((link) => {
                  const Icon = link.icon
                  return(
                <li key={link.href} className="mb-2">
                  <Link href={link.href} className={`flex items-center gap-2 p-2 rounded hover:bg-gray-700 ${pathname === link.href ? 'bg-gray-900' : ''}`}>
                      <Icon className="h-6 w-6" />
                      <span>{link.label}</span>
                  </Link>
                </li>
              )})}
            </ul>
          </nav>
        </aside>
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white flex justify-around md:hidden p-2">
          {navLinks.map((link) => {
              const Icon = link.icon;
              return (
              <Link key={link.href} href={link.href} className={`flex flex-col items-center text-xs ${pathname === link.href ? "text-blue-400" : ""}`}>
                  <Icon className="h-6 w-6" />
                  <span>{link.label}</span>
              </Link>
              );
          })}
          </div>
      </>
    );
  }

export function AppSidebar({ onOpenCart, hotelId }) {
  const pathname = usePathname();

  if (pathname.startsWith('/dashboard')) {
    return <DashboardSidebar />;
  } else if (pathname.startsWith('/admin')) {
    return <AdminSidebar />;
  } else if (pathname.startsWith('/hotels')){
    return <HotelSidebar onOpenCart={onOpenCart} hotelId={hotelId} />;
  }

  return null;
}
