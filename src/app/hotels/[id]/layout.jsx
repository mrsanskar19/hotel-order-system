"use client"
import { CartProvider } from "@/hook/useCart";
import { OrderProvider } from "@/hook/useOrder";
import { CartForm } from "@/components/form"
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react"
import { BottomNav,HotelSidebar,AppHeader } from "@/components/layout";
import { Home, List, ShoppingCart } from 'lucide-react';
import { Sidebar } from "@/components/ui/sidebar"


export default function layout({children}){
  const [cartVisible,setCartVisible] = useState(false);
  const [hotel, setHotel] = useState(null);
  const [tableIdentifier,setTableIdentifier] = useState(null);
  const { id } = useParams();
  const searchParams = useSearchParams();

  const navLinks = [
    { href: '/home', label: 'Home', icon: Home },
    { href: '/orders', label: 'Orders', icon: List },
    { href: '/cart', label: 'Cart', icon: ShoppingCart },
  ];

 useEffect(() => {
    const tableIdFromParams = searchParams.get('table_id');
    if (tableIdFromParams) {
      localStorage.setItem('tableId', tableIdFromParams);
      setTableIdentifier(tableIdFromParams);
    } else {
      const storedTableId = localStorage.getItem('tableId');
      if (storedTableId) {
        setTableIdentifier(storedTableId);
      }
    }

    const fetchHotel = async () => {
      try {
        const response = await fetch(`/api/hotels/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setHotel(data);
      } catch (error) {
        console.error("Error fetching hotel:", error);
      } finally {
        
      }
    };

    fetchHotel();
  }, [searchParams,id]);
  return (
   <CartProvider>
      <OrderProvider>
      <Sidebar navLinks={navLinks} title="test">

        {/* Main layout container */}
        <div className="pt-16 md:pl-20 min-h-screen bg-gray-50 relative">
          {(tableIdentifier && id) ? (
           <main className="px-4 pb-24 md:pb-8 z-0">{children}</main>
           ) : (
           <div className="flex flex-col justify-center items-center h-screen text-center">
 <h2 className="text-2xl font-bold mb-4">{tableIdentifier ? "Hotel" : "Table"} not found</h2>
 <p className="text-gray-700 mb-6">
 It seems the QR code or link you used is incorrect or expired.
 </p>
 <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={() => window.location.reload()}>Please try rescanning the QR code.</button>
 </div>
          )}

          {/* Cart Modal or Panel */}
          {cartVisible && <CartForm isOpen={cartVisible} setIsOpen={setCartVisible} />}

          {/* BottomNav (Mobile only) */}
        </div>
        </Sidebar>
      </OrderProvider>
    </CartProvider>
  )
}
