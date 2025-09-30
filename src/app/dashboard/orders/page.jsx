"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hook/useAuth";

export default function OrdersPage() {
  const { hotelId } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [hotelId]);

  const fetchOrders = async () => {
    if (!hotelId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/hotels/${hotelId}/orders`);
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("Error fetching orders", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "CONFIRMED":
        return "bg-blue-100 text-blue-800";
      case "PREPARING":
        return "bg-purple-100 text-purple-800";
      case "READY":
        return "bg-green-100 text-green-800";
      case "DELIVERED":
        return "bg-gray-100 text-gray-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Orders</h1>
      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-lg font-semibold mb-4">No orders found.</p>
          <svg
            className="w-24 h-24 text-gray-300"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 3h18M3 3v18M3 21h18M21 3v18"
            ></path>
          </svg>
          <p className="text-gray-500 mt-4">Orders will appear here once placed.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.order_id} className="border border-gray-200 shadow-sm rounded-lg">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Order #{order.order_id}</span>
                  <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Customer: {order.customer_id || "Guest"}</p>
                <p>Total Amount: ${order.total_amount.toFixed(2)}</p>
                <p>Payment Mode: {order.payment_mode}</p>
                <p>Created At: {new Date(order.created_at).toLocaleString()}</p>
                <div className="mt-2">
                  <h4 className="font-semibold">Items:</h4>
                  <ul className="list-disc list-inside">
                    {order.items.map((item) => (
                      <li key={item.order_item_id}>
                        {item.quantity} x {item.item.name} (${item.price.toFixed(2)})
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
