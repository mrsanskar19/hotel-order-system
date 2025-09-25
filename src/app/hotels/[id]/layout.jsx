"use client"
import { CartProvider } from "@/hook/useCart";
import { OrderProvider } from "@/hook/useOrder";
import { CartForm } from "@/components/form"
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react"
import { BottomNav,SidebarNav,AppHeader } from "@/components/layout";

export default function layout({children}){
  const [cartVisible,setCartVisible] = useState(false);
  const [hotel, setHotel] = useState(null);
  const { id } = useParams();
  const searchParams = useSearchParams();

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
      <AppHeader name={hotel?.name} table="01"/>
        <SidebarNav
          hotelId={id}
          onOpenCart={() => setCartVisible(!cartVisible)}
        />

        {/* Main layout container */}
        <div className="pt-16 md:pl-20 min-h-screen bg-gray-50 relative">
          {/* Main Scrollable Content */}
          <main className="px-4 pb-24 md:pb-8">{children}</main>

          {/* Cart Modal or Panel */}
          {cartVisible && <CartForm />}

          {/* BottomNav (Mobile only) */}
          <BottomNav
            onOpenCart={() => setCartVisible(!cartVisible)}
            hotelId={id}
          />
        </div>
      </OrderProvider>
    </CartProvider>
  )
}
