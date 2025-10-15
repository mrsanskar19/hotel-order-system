
"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Clock, CreditCard, QrCode, Receipt, Download, ShoppingCart, AlertTriangle, X } from "lucide-react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useSocketContext } from "@/providers/SocketProvider";

const UPI_ID = "8351921719@axl";
const PAYEE_NAME = "Hotel Restaurant";

export default function OrdersPage() {
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBillModal, setShowBillModal] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { id: hotelId } = params;
  const orderIdFromUrl = searchParams.get('order_id');
  const { socket, on, off } = useSocketContext();

  useEffect(() => {
    const orderId = orderIdFromUrl || localStorage.getItem('active_order_id');
    if (orderId && !orderIdFromUrl) {
      router.push(`/hotels/${hotelId}/orders?order_id=${orderId}`);
    }

    if (!hotelId || !orderId) {
      setError("Hotel ID or Order ID is missing.");
      setIsLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/hotels/${hotelId}/orders/${orderId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch order details.');
        }
        const data = await response.json();
        setOrder(data);
        localStorage.setItem('active_order_id', data.id);
      } catch (err) {
        setError(err.message);
        localStorage.removeItem('active_order_id');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();

    const handleOrderDelivered = (deliveredOrder) => {
        if(deliveredOrder.id === orderId) {
            setOrder(prevOrder => ({...prevOrder, status: 'DELIVERED'}));
        }
    };

    const handleItemsUpdated = (updatedOrder) => {
        if(updatedOrder.id === orderId) {
            setOrder(prevOrder => ({...prevOrder, items: updatedOrder.items, total: updatedOrder.total}));
        }
    };
    
    const handleCloseOrder = () => {
        setOrder(null);
        localStorage.removeItem('active_order_id');
        router.push(`/hotels/${hotelId}`);
    };

    on('order:delivered', handleOrderDelivered);
    on('order:items_updated', handleItemsUpdated);
    on('close_order', handleCloseOrder);

    return () => {
      off('order:delivered', handleOrderDelivered);
      off('order:items_updated', handleItemsUpdated);
      off('close_order', handleCloseOrder);
    };
  }, [hotelId, orderIdFromUrl, router, on, off]);

  const upiUrl = useMemo(() => {
    if (!order) return "";
    return `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(PAYEE_NAME)}&am=${order.total}&cu=INR`;
  }, [order]);

  const qrCodeUrl = useMemo(() => {
    if (!upiUrl) return "";
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(upiUrl)}`;
  }, [upiUrl]);

  const handleDownloadBill = () => {
    if (!order) return;

    const billContent = `
      ========================================
                  INVOICE
      ========================================
      Order ID: ${order.id}
      Table ID: ${order.tableNumber}
      Date: ${new Date(order.createdAt).toLocaleString()}
      ----------------------------------------
      Items:
      ----------------------------------------
      ${order.items
        .map(
          (item) =>
            `${item.name.padEnd(20)} x${item.quantity} | ${`$${(
              item.price * item.quantity
            ).toFixed(2)}`.padStart(10)}`
        )
        .join("\n")}
      ----------------------------------------
      Subtotal: ${`$${order.total.toFixed(2)}`.padStart(25)}
      ----------------------------------------
      Total: ${`$${order.total.toFixed(2)}`.padStart(28)}
      ========================================
      Thank you for your visit!
    `;

    const blob = new Blob([billContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bill-${order.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const payAndCloseOrder = () => {
      if(socket) {
          socket.emit('pay_bill', { order_id: order.id, hotel_id: hotelId });
      }
  }

  if (isLoading) {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
            <Clock className="h-12 w-12 text-gray-400 animate-spin mb-4" />
            <h2 className="text-xl font-semibold text-gray-700">Loading Order Details...</h2>
        </div>
    );
  }

  if (error) {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-xl font-bold text-red-700">Error</h2>
            <p className="text-gray-600">{error}</p>
            <Button onClick={() => router.push(`/hotels/${hotelId}`)} className="mt-6">Go Back</Button>
        </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
        <ShoppingCart className="h-16 w-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Not Found or Closed</h2>
        <p className="text-gray-500 mb-6">This order could not be found or has been finalized.</p>
        <Button onClick={() => router.push(`/hotels/${hotelId}`)}>Back to Menu</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Order Details</h1>
        <Card className="bg-white shadow-lg rounded-xl overflow-hidden">
          <CardHeader className="bg-gray-100 p-6 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-gray-800">Order #{order.id}</CardTitle>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                <div className="flex items-center gap-1.5">
                  <span>Table {order.tableNumber}</span>
                </div>
              </div>
            </div>
            <Badge className={`px-3 py-1 text-sm font-medium rounded-full ${order.status === 'DELIVERED' ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}`}>
              {order.status}
            </Badge>
          </CardHeader>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Items Ordered</h3>
            <ul className="space-y-4">
              {order.items.map((item) => (
                <li key={item.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <ShoppingCart className="h-6 w-6 text-gray-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{item.name}</p>
                      <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-semibold text-gray-800">${(item.price * item.quantity).toFixed(2)}</p>
                </li>
              ))}
            </ul>
            <Separator className="my-6" />
            <div className="flex items-center justify-end gap-4">
              <Button onClick={() => setShowBillModal(true)}>
                <Receipt className="h-4 w-4 mr-2" />
                Continue to Bill
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {showBillModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 relative">
            <button onClick={() => setShowBillModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
            </button>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Payment & Bill</h2>
            <div className="text-center mb-6">
              <p className="text-gray-500">Scan the QR code to pay the total amount of</p>
              <p className="text-4xl font-bold text-red-600 my-2">${order.total.toFixed(2)}</p>
            </div>
            <div className="flex justify-center mb-6">
              <div className="bg-white p-4 rounded-lg shadow-md">
                <img src={qrCodeUrl} alt="UPI Payment QR Code" className="w-64 h-64" />
              </div>
            </div>
            <div className="text-center text-sm text-gray-500 mb-6">
              <p>Pay to: {PAYEE_NAME}</p>
              <p>UPI ID: {UPI_ID}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button variant="outline" onClick={handleDownloadBill}>
                <Download className="h-4 w-4 mr-2" />
                Download Bill
              </Button>
              <Button
                onClick={payAndCloseOrder}
                disabled={isClosing}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {isClosing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Mark as Paid & Close
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
