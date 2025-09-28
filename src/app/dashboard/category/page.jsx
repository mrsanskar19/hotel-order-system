"use client";
import { useState, useEffect } from "react";
import { CategoryForm } from "@/components/form";
import { Button } from "@/components/ui"; // Replace with your own <Button />
import { useAuth } from "@/hook/useAuth"

export default function CategoryPage() {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showForm, setShowForm] = useState(false);
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [loading, setLoading] = useState(false);

  const { hotelId } = useAuth()

  // Fetch categories on load or after form submission
  useEffect(() => {
    fetchCategories();
  }, [hotelId]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/hotels/${hotelId}/category`);
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error("Error fetching categories", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    setEditCategoryId(id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    await fetch(`/api/categories/${id}`, { method: "DELETE" });
    fetchCategories();
  };

  const handleToggleVisibility = async (id, current) => {
    await fetch(`/api/categories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visible: !current }),
    });
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

  const sortedFilteredCategories = categories
    .filter((cat) =>
      cat.name.toLowerCase().includes(search.toLowerCase())
    )
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
              <th
                onClick={() => handleSort("name")}
                className="cursor-pointer px-4 py-2 text-left"
              >
                Name {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th className="px-4 py-2">Image</th>
              <th
                onClick={() => handleSort("visible")}
                className="cursor-pointer px-4 py-2"
              >
                Visible {sortBy === "visible" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="text-center p-4">
                  Loading...
                </td>
              </tr>
            ) : sortedFilteredCategories.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center p-4 text-gray-500">
                  No categories found.
                </td>
              </tr>
            ) : (
              sortedFilteredCategories.map((cat) => (
                <tr key={cat.id} className="border-t hover:bg-gray-50">
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
                  <td className="px-4 py-2 text-center">
                    {cat.visible ? "Yes" : "No"}
                  </td>
                  <td className="px-4 py-2 space-x-2">
                    <button
                      onClick={() => handleEdit(cat.id)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() =>
                        handleToggleVisibility(cat.id, cat.visible)
                      }
                      className="text-gray-700 hover:underline"
                    >
                      {cat.visible ? "Hide" : "Show"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <CategoryForm
          mode={editCategoryId ? "edit" : "create"}
          categoryId={editCategoryId}
          onClose={() => {
            setShowForm(false);
            fetchCategories();
          }}
        />
      )}
    </div>
  );
}
