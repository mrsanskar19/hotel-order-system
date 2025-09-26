'use client';

import { useState, useEffect, useMemo } from 'react';
import { socket } from '@/lib/socket';
import { Modal } from '@/components/ui';

const UPI_ID = '8351921719@axl';
const PAYEE_NAME = "Pizza Master's";

const SAMPLE_ORDER = {
  id: 'sample-id',
  order_id: 'ORD123456',
  status: 'Active',
  total: 540,
  date: new Date().toISOString(),
  items: [
    { id: '1', name: 'Margherita Pizza', quantity: 2, price: 150 },
    { id: '2', name: 'Garlic Bread', quantity: 1, price: 90 },
    { id: '3', name: 'Soft Drink', quantity: 2, price: 75 },
  ],
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [step, setStep] = useState('info');
  const [userInfo, setUserInfo] = useState({ name: '', phone: '' });
  const [tableId, setTableId] = useState('');

  const activeOrder = orders[0];

  useEffect(() => {

    // Load from localStorage
    const storedOrders = localStorage.getItem('active_orders');
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders));
    } else {
      // Inject sample data
      setOrders([SAMPLE_ORDER]);
      localStorage.setItem('active_orders', JSON.stringify([SAMPLE_ORDER]));
    }

    const storedTable = localStorage.getItem('tableId');
    if (storedTable) {
      setTableId(storedTable);
    } else {
      localStorage.setItem('tableId', 'T5');
      setTableId('T5');
    }

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleCloseOrder = () => {
    alert('Order closed successfully!');
    if (socket && activeOrder) {
      socket.emit('order:closed', {
        order_id: activeOrder.order_id,
        table_id: tableId,
      });
    }
    localStorage.removeItem('active_orders');
    setOrders([]);
    setStep('done');
  };

  const upiUrl = useMemo(() => {
    if (!activeOrder) return '';
    return `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(PAYEE_NAME)}&am=${activeOrder.total}&cu=INR`;
  }, [activeOrder]);

  const qrCodeUrl = useMemo(() => {
    if (!upiUrl) return '';
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiUrl)}`;
  }, [upiUrl]);

  if (!activeOrder) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>No Active Orders</h2>
        <p>Place an order to see it here.</p>
      </div>
    );
  }

  const renderInfo = () => (
    <div>
      <h3>Customer Info</h3>
      <input
        type="text"
        placeholder="Name (optional)"
        value={userInfo.name}
        onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
        style={{ margin: '0.5rem 0', padding: '0.5rem', width: '100%' }}
      />
      <input
        type="tel"
        placeholder="Phone (optional)"
        value={userInfo.phone}
        onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
        style={{ margin: '0.5rem 0', padding: '0.5rem', width: '100%' }}
      />
      <button onClick={() => setStep('bill')} style={{ marginTop: '1rem' }}>Next</button>
    </div>
  );

  const renderBill = () => {
    const subtotal = activeOrder.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const tax = subtotal * 0.085;
    const service = subtotal * 0.15;
    const total = subtotal + tax + service;

    return (
      <div>
        <h3>Order Bill</h3>
        <ul style={{ padding: 0, listStyle: 'none' }}>
          {activeOrder.items.map(item => (
            <li key={item.id} style={{ marginBottom: '0.5rem' }}>
              {item.name} (x{item.quantity}) - ₹{item.price * item.quantity}
            </li>
          ))}
        </ul>
        <p>Subtotal: ₹{subtotal.toFixed(2)}</p>
        <p>Tax (8.5%): ₹{tax.toFixed(2)}</p>
        <p>Service Charge (15%): ₹{service.toFixed(2)}</p>
        <strong>Total: ₹{total.toFixed(2)}</strong>
        <div style={{ marginTop: '1rem' }}>
          <button onClick={() => setStep('payment')}>Proceed to Payment</button>
        </div>
      </div>
    );
  };

  const renderPayment = () => (
    <div>
      <h3>UPI Payment</h3>
      <p>Scan the QR code to pay ₹{activeOrder.total}</p>
      {qrCodeUrl && (
        <img
          src={qrCodeUrl}
          alt="QR Code"
          style={{ width: '200px', height: '200px', margin: '1rem auto', display: 'block' }}
        />
      )}
      <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>UPI ID: {UPI_ID}</p>
      <button onClick={handleCloseOrder} style={{ marginTop: '1rem' }}>
        Mark as Paid
      </button>
    </div>
  );

  const renderDone = () => (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h3>✅ Payment Complete!</h3>
      <p>Thank you for your order.</p>
    </div>
  );

  return (
    <div
      style={{
        maxWidth: '600px',
        margin: '2rem auto',
        padding: '1rem',
        background: '#fff',
        border: '1px solid #ccc',
        borderRadius: '8px',
      }}
    >
      <h2>Order #{activeOrder.order_id}</h2>
      <p><strong>Table:</strong> {tableId || 'N/A'}</p>
      <p><strong>Date:</strong> {new Date(activeOrder.date).toLocaleString()}</p>

      <hr style={{ margin: '1rem 0' }} />

      {step === 'info' && <Modal buttonText="Next" >{renderInfo()}</Modal>}
      {step === 'bill' && renderBill()}
      {step === 'payment' && renderPayment()}
      {step === 'done' && renderDone()}
    </div>
  );
}

