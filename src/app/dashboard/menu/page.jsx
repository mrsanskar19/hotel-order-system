"use client";

const MenuPage = () => {
  // Placeholder for menu data
  const menu = [
    { id: 1, name: "Pizza", price: 12.99 },
    { id: 2, name: "Burger", price: 8.99 },
    { id: 3, name: "Pasta", price: 10.99 },
    { id: 4, name: "Salad", price: 6.99 },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Menu</h1>
      <div className="bg-white p-4 rounded-lg shadow">
        {menu.length > 0 ? (
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">ID</th>
                <th className="text-left p-2">Name</th>
                <th className="text-left p-2">Price</th>
              </tr>
            </thead>
            <tbody>
              {menu.map((item) => (
                <tr key={item.id} className="border-b last:border-b-0">
                  <td className="p-2">{item.id}</td>
                  <td className="p-2">{item.name}</td>
                  <td className="p-2">${item.price.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No menu items found.</p>
        )}
      </div>
    </div>
  );
};

export default MenuPage;
