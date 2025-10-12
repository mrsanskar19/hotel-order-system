
"use client";

import React, { useMemo, useEffect, useState } from "react";
import { useCart } from "@/hook/useCart"; // Assuming you have a useCart hook
import { useOrder } from "@/hook/useOrder"; // Your useOrder hook
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button"; // Assuming you use Shadcn UI buttons
import { Input } from "@/components/ui/input"; // Assuming you use Shadcn UI input
import { Textarea } from "@/components/ui"; // Assuming you use Shadcn UI textarea

const CartPage = () => {
  const { cartItems, removeFromCart, clearCart } = useCart(); // Assuming useCart provides these
  const { createTempOrder, finalOrder, loading, error, status } = useOrder();
  const params = useParams();
  const hotelId = params.id;

  const [customerName, setCustomerName] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [notes, setNotes] = useState("");

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

    createTempOrder(orderDetails, cartItems); // This triggers the socket logic in useOrder
  };

  useEffect(() => {
    // Handle order status updates or show success/error messages
    if (status === "success" && finalOrder) {
      alert(`Order placed successfully! Order ID: ${finalOrder.id}`);
      clearCart(); // Clear the cart after successful order
      setCustomerName(""); // Clear form fields
      setTableNumber("");
      setNotes("");
    } else if (status === "error" && error) {
      alert(`Failed to place order: ${error}`);
    }
  }, [status, finalOrder, error, clearCart]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          <ul className="divide-y divide-gray-200">
            {cartItems.map((item) => (
              <li key={item.id} className="py-4 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-gray-600">${item.price.toFixed(2)} x {item.quantity}</p>
                </div>
                <Button variant="destructive" onClick={() => removeFromCart(item.id)}>
                  Remove
                </Button>
              </li>
            ))}
          </ul>

          <div className="mt-4 text-xl font-bold text-right">
            Subtotal: ${subtotal.toFixed(2)}
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Customer Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="customerName" className="block text-sm font-medium text-gray-700">Customer Name</label>
                <Input
                  id="customerName"
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="mt-1 block w-full"
                />
              </div>
              <div>
                <label htmlFor="tableNumber" className="block text-sm font-medium text-gray-700">Table Number</label>
                <Input
                  id="tableNumber"
                  type="text"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  className="mt-1 block w-full"
                />
              </div>
            </div>
            <div className="mt-4">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes</label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="mt-1 block w-full"
                rows="3"
              />
            </div>
          </div>

          <div className="mt-8">
            <Button
              onClick={handlePlaceOrder}
              disabled={cartItems.length === 0 || loading}
              className="w-full"
            >
              {loading ? "Placing Order..." : "Place Order"}
            </Button>
          </div>

          {status === "loading" && <p className="mt-4 text-center text-blue-600">Processing your order...</p>}
          {status === "error" && <p className="mt-4 text-center text-red-600">Error placing order: {error}</p>}
        </div>
      )}
    </div>
  );
};

export default CartPage;
