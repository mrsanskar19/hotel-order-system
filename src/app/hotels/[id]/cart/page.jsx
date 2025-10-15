
"use client";

import React, { useMemo, useEffect, useState } from "react";
import { useCart } from "@/hook/useCart";
import { useOrder } from "@/hook/useOrder";
import { useParams, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui";

const CartPage = () => {
  const { cartItems, removeFromCart, clearCart, updateQuantity } = useCart();
  const { createTempOrder, finalOrder, loading, error, status } = useOrder();
  const params = useParams();
  const searchParams = useSearchParams();
  const hotelId = params.id;
  const tableId = searchParams.get('table_id');

  const [customerName, setCustomerName] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (tableId) {
      setTableNumber(tableId);
    }
  }, [tableId]);

  const subtotal = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cartItems]);

  const handlePlaceOrder = () => {
    if (!customerName || !tableNumber) {
      alert("Please enter customer name and table number.");
      return;
    }

    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    const orderDetails = {
      hotelId: hotelId,
      customerName: customerName,
      tableNumber: tableNumber,
      notes: notes,
      total: subtotal,
    };

    createTempOrder(orderDetails, cartItems);
  };

  useEffect(() => {
    if (status === "success" && finalOrder) {
      alert(`Order placed successfully! Order ID: ${finalOrder.id}`);
      clearCart();
      setCustomerName("");
      if(!tableId) {
        setTableNumber("");
      }
      setNotes("");
    } else if (status === "error" && error) {
      alert(`Failed to place order: ${error}`);
    }
  }, [status, finalOrder, error, clearCart, tableId]);

  const handleQuantityChange = (id, quantity) => {
    const newQuantity = parseInt(quantity, 10);
    if (newQuantity > 0) {
      updateQuantity(id, newQuantity);
    }
  };

  const TrashIcon = (props) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h18" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </svg>
  );

  return (
    <div className="bg-red-50 min-h-screen">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h1 className="text-3xl font-bold text-red-800 mb-6 flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                </svg>
                Your Culinary Cart
              </h1>

              {cartItems.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-xl text-gray-500">Your cart is currently empty.</p>
                  <Button className="mt-6 bg-red-600 hover:bg-red-700 text-white">
                    Start Ordering
                  </Button>
                </div>
              ) : (
                <ul className="divide-y divide-red-100">
                  {cartItems.map((item) => (
                    <li key={item.id} className="py-6 flex items-center gap-4 transition-colors duration-200 hover:bg-red-50/50">
                      <img src={item.image || '/placeholder.svg'} alt={item.name} className="w-24 h-24 rounded-lg object-cover shadow-md" />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                        <p className="text-red-600 font-bold">${item.price.toFixed(2)}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <label className="text-sm font-medium text-gray-600">Quantity:</label>
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                            className="w-20 h-8 text-center border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                          />
                        </div>
                      </div>
                      <Button variant="ghost" className="text-red-500 hover:bg-red-100 p-2 rounded-full" onClick={() => removeFromCart(item.id)}>
                        <TrashIcon className="w-6 h-6" />
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="lg:w-1/3">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <h2 className="text-2xl font-bold text-red-800 border-b-2 border-red-200 pb-4 mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6 text-lg">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold text-gray-800">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Taxes & Fees</span>
                  <span className="font-semibold text-gray-800">Calculated at checkout</span>
                </div>
                <div className="flex justify-between font-bold text-xl pt-2 border-t border-dashed">
                  <span className="text-red-700">Total</span>
                  <span className="text-red-700">${subtotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                  <Input id="customerName" type="text" placeholder="John Doe" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="focus:ring-red-500 focus:border-red-500" />
                </div>
                <div>
                  <label htmlFor="tableNumber" className="block text-sm font-medium text-gray-700 mb-1">Table Number</label>
                  <Input id="tableNumber" type="text" placeholder="e.g., 12A" value={tableNumber} onChange={(e) => setTableNumber(e.target.value)} readOnly={!!tableId} className="focus:ring-red-500 focus:border-red-500" />
                </div>
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">Special Instructions</label>
                  <Textarea id="notes" placeholder="Any special requests?" value={notes} onChange={(e) => setNotes(e.target.value)} className="focus:ring-red-500 focus:border-red-500" rows={3} />
                </div>
              </div>

              <div className="mt-8">
                <Button
                  onClick={handlePlaceOrder}
                  disabled={cartItems.length === 0 || loading}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Placing Order...
                    </div>
                  ) : "Place Order"}
                </Button>
              </div>

              {status === "error" && (
                <p className="mt-4 text-center text-sm text-red-600 bg-red-100 p-3 rounded-lg">
                  <span className="font-bold">Oops!</span> {error}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
