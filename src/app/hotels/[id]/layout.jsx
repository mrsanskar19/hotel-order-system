"use client"
import { CartProvider } from "@/hook/useCart";
import { OrderProvider } from "@/hook/useOrder";
import { AppHeader, Footer } from "@/components/layout";
import { CartForm } from "@/components/form"
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react"

export default function layout({children}){
const [cartVisible,setCartVisible] = useState(false);
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
  }, [searchParams]);
  return (
    <CartProvider>
      <OrderProvider>
              <AppHeader hotelId={id}/>

        {children}
        {cartVisible && (
          <CartForm/>
        )}
        <Footer/>
      </OrderProvider>
    </CartProvider>
  )
}
