'use client';

import { useState, useEffect } from 'react';
import { socket } from '@/lib/socket';

const DashboardPage = () => {
  const [salesData, setSalesData] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    newCustomers: 0, // This will remain static as we can't get this from events
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [topSellingItems, setTopSellingItems] = useState([]);
  const [tableStatus, setTableStatus] = useState([]);
  const [isConnected, setIsConnected] = useState(socket.connected);

  // Assuming a static list of tables
  const allTables = [1, 2, 3, 4, 5, 6];

  useEffect(() => {
    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);

    const onNewOrder = (newOrder) => {
      const orderAmount = newOrder.items.reduce((acc, item) => acc + (item.price || 10) * item.quantity, 0);
      const orderForDisplay = {
        ...newOrder,
        customer: `Table ${newOrder.tableId}`,
        amount: orderAmount,
      };

      setRecentOrders(prev => [orderForDisplay, ...prev].slice(0, 5));
      setSalesData(prev => ({
        ...prev,
        totalOrders: prev.totalOrders + 1,
        totalRevenue: prev.totalRevenue + orderAmount,
      }));

      newOrder.items.forEach(item => {
        setTopSellingItems(prevItems => {
          const itemIndex = prevItems.findIndex(i => i.name === item.name);
          if (itemIndex > -1) {
            const newItems = [...prevItems];
            newItems[itemIndex].sales += item.quantity;
            return newItems.sort((a, b) => b.sales - a.sales);
          } else {
            return [...prevItems, { name: item.name, sales: item.quantity }].sort((a, b) => b.sales - a.sales);
          }
        });
      });
    };

    const onOrderUpdated = (updatedOrder) => {
      const orderAmount = updatedOrder.items.reduce((acc, item) => acc + (item.price || 10) * item.quantity, 0);
      setRecentOrders(prev => prev.map(o => o.id === updatedOrder.id ? { ...o, ...updatedOrder, amount: orderAmount } : o));
    };

    const onTableUpdated = (tables) => {
      const occupiedIds = tables.map(t => t.id);
      setTableStatus(allTables.map(id => ({
        id,
        status: occupiedIds.includes(String(id)) ? 'Occupied' : 'Available',
      })));
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('new_order', onNewOrder);
    socket.on('order_updated', onOrderUpdated);
    socket.on('table_updated', onTableUpdated);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('new_order', onNewOrder);
      socket.off('order_updated', onOrderUpdated);
      socket.off('table_updated', onTableUpdated);
    };
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="flex justify-center items-center mb-6">
          <span className={`h-3 w-3 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
          <span className="text-sm">{isConnected ? 'Connected' : 'Disconnected'}</span>
        </div>

      {/* Sales Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-700">Total Revenue</h2>
          <p className="text-3xl font-bold">${salesData.totalRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-700">Total Orders</h2>
          <p className="text-3xl font-bold">{salesData.totalOrders}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-700">New Customers</h2>
          <p className="text-3xl font-bold">{salesData.newCustomers}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders Table */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Order ID</th>
                <th className="text-left p-2">Customer</th>
                <th className="text-left p-2">Amount</th>
                <th className="text-left p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b last:border-b-0">
                  <td className="p-2">#{order.id}</td>
                  <td className="p-2">{order.customer}</td>
                  <td className="p-2">${order.amount.toFixed(2)}</td>
                  <td className="p-2">
                    <span
                      className={`px-2 py-1 rounded-full text-sm ${{
                        Completed: 'bg-green-200 text-green-800',
                        Pending: 'bg-yellow-200 text-yellow-800',
                        Cancelled: 'bg-red-200 text-red-800',
                      }[order.status] || 'bg-gray-200 text-gray-800'}`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Top Selling Items Table */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Top Selling Items</h2>
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Item Name</th>
                <th className="text-left p-2">Total Sales</th>
              </tr>
            </thead>
            <tbody>
              {topSellingItems.map((item) => (
                <tr key={item.name} className="border-b last:border-b-0">
                  <td className="p-2">{item.name}</td>
                  <td className="p-2">{item.sales}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Table Status */}
      <div className="mt-6 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Table Status</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {tableStatus.map((table) => (
            <div
              key={table.id}
              className={`p-4 rounded-lg text-center font-semibold text-white ${{
                Occupied: 'bg-red-500',
                Available: 'bg-green-500',
                Reserved: 'bg-yellow-500',
              }[table.status] || 'bg-gray-400'}`}
            >
              <p>Table {table.id}</p>
              <p className="text-sm">{table.status}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
