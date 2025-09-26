"use client";

const MenuPage = () => {
  // Placeholder for menu data
  const menu = [];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Menu</h1>
      <div className="bg-white p-4 rounded-lg shadow">
        {menu.length > 0 ? (
          <ul>
            {menu.map((item) => (
              <li key={item.id} className="border-b last:border-b-0 py-2">
                {/* Display menu item details here */}
                <p>{item.name}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No menu items found.</p>
        )}
      </div>
    </div>
  );
};

export default MenuPage;
