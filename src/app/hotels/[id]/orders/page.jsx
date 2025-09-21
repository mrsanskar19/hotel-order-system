"use client"
import React from 'react';
import { useOrder } from '@/hook/useOrder';
// import OrderForm from '../components/OrderForm';

const OrderPage = () => {
  const { finalOrder, status, loading } = useOrder();

  return (
    <div>
      <h1>Order Page</h1>
      {!finalOrder ? (
        <p>Form of orders</p>
      ) : (
        <div>
          <h2>Order Status</h2>
          <p>Order ID: {finalOrder.id}</p>
          <p>Current status: <strong>{status}</strong></p>
          {/* You can show status progression here, e.g. steps: Pending → Confirmed → Shipped → Delivered */}
        </div>
      )}
    </div>
  );
};

export default OrderPage;

