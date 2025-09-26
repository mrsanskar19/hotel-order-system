"use client";

const OrdersPage = () => {
  // Placeholder for orders data
  const orders = [];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Current Orders</h1>
      <div className="bg-white p-4 rounded-lg shadow">
        {orders.length > 0 ? (
          <ul>
            {orders.map((order) => (
              <li key={order.id} className="border-b last:border-b-0 py-2">
                {/* Display order details here */}
                <p>Order #{order.id}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No current orders.</p>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
