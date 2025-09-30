"use client";

import { useState, useEffect } from "react";
import { CategoryForm } from "@/components/form";
import { HotelItemForm } from "@/components/form";
import { Button } from "@/components/ui";
import { useAuth } from "@/hook/useAuth";

export default function CategoryPage() {
  const { hotelId } = useAuth();
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState({});
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showForm, setShowForm] = useState(false);
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [editMenuItemId, setEditMenuItemId] = useState(null);
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, [hotelId]);

  const fetchCategories = async () => {
    if (!hotelId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/hotels/${hotelId}/category`);
      const data = await res.json();
      setCategories(data);
      for (let cat of data) {
        fetchMenuItems(cat.category_id);
      }
    } catch (err) {
      console.error("Error fetching categories", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMenuItems = async (categoryId) => {
    try {
      const res = await fetch(`/api/hotels/${hotelId}/items?categoryId=${categoryId}`);
      const data = await res.json();
      setMenuItems((prev) => ({ ...prev, [categoryId]: data }));
    } catch (err) {
      console.error("Error fetching menu items", err);
    }
  };

  const handleEditCategory = (id) => {
    setEditCategoryId(id);
    setShowForm(true);
  };

  const handleDeleteCategory = async (id) => {
    if (!confirm("Delete this category?")) return;
    await fetch(`/api/hotels/${hotelId}/category/${id}`, { method: "DELETE" });
    fetchCategories();
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const handleMenuItemDelete = async (id, categoryId) => {
    if (!confirm("Delete this menu item?")) return;
    await fetch(`/api/hotels/${hotelId}/items`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchMenuItems(categoryId);
  };

  const sortedFilteredCategories = categories
    .filter((cat) => cat.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Categories</h1>
        <Button
          onClick={() => {
            setEditCategoryId(null);
            setShowForm(true);
          }}
        >
          Add Category
        </Button>
      </div>

      <input
        type="text"
        placeholder="Search categories..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 w-full max-w-md border p-2 rounded"
      />

      <div className="overflow-auto border rounded-md">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th onClick={() => handleSort("name")} className="cursor-pointer px-4 py-2 text-left">
                Name {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th className="px-4 py-2">Image</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="text-center p-4">Loading...</td>
              </tr>
            ) : sortedFilteredCategories.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center p-4 text-gray-500">No categories found.</td>
              </tr>
            ) : (
              sortedFilteredCategories.map((cat) => (
                <React.Fragment key={cat.category_id}>
                  <tr className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{cat.name}</td>
                    <td className="px-4 py-2">
                      {cat.image ? (
                        <img
                          src={cat.image}
                          alt="Category"
                          className="h-10 w-10 object-cover rounded"
                        />
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-2 space-x-2">
                      <button
                        onClick={() => handleEditCategory(cat.category_id)}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(cat.category_id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() =>
                          setActiveCategoryId(activeCategoryId === cat.category_id ? null : cat.category_id)
                        }
                        className="text-indigo-600 hover:underline"
                      >
                        {activeCategoryId === cat.category_id ? "Hide Items" : "Show Items"}
                      </button>
                    </td>
                  </tr>

                  {/* Menu Items for this category */}
                  {activeCategoryId === cat.category_id && (
                    <tr>
                      <td colSpan="4" className="bg-gray-50 px-4 py-4">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-medium">Menu Items</h3>
                          <Button
                            size="sm"
                            onClick={() => {
                              setEditMenuItemId(null);
                              setEditCategoryId(cat.category_id);
                              setShowForm("menuItem");
                            }}
                          >
                            Add Item
                          </Button>
                        </div>

                        {menuItems[cat.category_id]?.length ? (
                          <ul className="space-y-2">
                            {menuItems[cat.category_id].map((item) => (
                              <li
                                key={item.item_id}
                                className="flex justify-between items-center p-2 border rounded"
                              >
                                <div>
                                  <div className="font-semibold">{item.name}</div>
                                  <div className="text-sm text-gray-500">{item.description}</div>
                                </div>
                                <div className="space-x-2">
                                  <button
                                    onClick={() => {
                                      setEditMenuItemId(item.item_id);
                                      setEditCategoryId(cat.category_id);
                                      setShowForm("menuItem");
                                    }}
                                    className="text-blue-600 hover:underline"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleMenuItemDelete(item.item_id, cat.category_id)}
                                    className="text-red-600 hover:underline"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-gray-400">No items yet.</p>
                        )}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showForm === true && (
        <CategoryForm
          mode={editCategoryId ? "edit" : "create"}
          categoryId={editCategoryId}
          onClose={() => {
            setShowForm(false);
            fetchCategories();
          }}
        />
      )}

      {showForm === "menuItem" && (
        <HotelItemForm
          mode={editMenuItemId ? "edit" : "create"}
          menuItemId={editMenuItemId}
          categoryId={editCategoryId}
          onClose={() => {
            setShowForm(false);
            fetchMenuItems(editCategoryId);
            setEditMenuItemId(null);
          }}
        />
      )}
    </div>
  );
}
