"use client";
import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';

const QRCodePage = () => {
  const searchParams = useSearchParams();
  const hotelId = searchParams.get('hotelId');
  const [tableId, setTableId] = useState('');

  const menuUrl = useMemo(() => {
    if (!hotelId || !tableId) return '';
    return `${window.location.origin}/hotels/${hotelId}?tableId=${tableId}`;
  }, [hotelId, tableId]);

  const qrCodeUrl = useMemo(() => {
    if (!menuUrl) return '';
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(menuUrl)}`;
  }, [menuUrl]);

  return (
    <div style={{ padding: '2rem' }}>
      <h1 className="text-2xl font-semibold mb-4">Generate QR Code for Table</h1>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={tableId}
          onChange={(e) => setTableId(e.target.value)}
          placeholder="Enter Table ID"
          className="flex-grow p-2 border rounded-lg"
        />
      </div>

      {qrCodeUrl && (
        <div style={{ textAlign: 'center' }}>
          <h2 className="text-xl font-semibold">Scan to Order</h2>
          <p>Table: {tableId}</p>
          <img
            src={qrCodeUrl}
            alt="QR Code"
            style={{ width: '200px', height: '200px', margin: '1rem auto', display: 'block' }}
          />
        </div>
      )}
    </div>
  );
};

export default QRCodePage;
