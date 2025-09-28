"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hook/useAuth"

const CategoryForm = ({ mode = "create", categoryId = null, onClose }) => {
  const { hotelId } = useAuth();
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null);

  // Fetch existing category if in edit mode
  useEffect(() => {
    if (mode === "edit" && categoryId) {
      fetch(`/api/hotels/${hotelId}/category/${categoryId}`)
        .then((res) => res.json())
        .then((data) => {
          setName(data.name);
          setImageUrl(data.image);
        });
    }
  }, [mode, categoryId]);

  // Handle paste image (Ctrl+V)
  useEffect(() => {
    const handlePaste = async (event) => {
      const items = event.clipboardData.items;
      for (const item of items) {
        if (item.type.indexOf("image") !== -1) {
          const blob = item.getAsFile();
          await uploadToCloudinary(blob);
        }
      }
    };
    window.addEventListener("paste", handlePaste);
    return () => {
      window.removeEventListener("paste", handlePaste);
    };
  }, []);

  const uploadToCloudinary = async (file) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "your_unsigned_preset"); // Replace with your preset
    formData.append("folder", "categories");

    const res = await fetch("https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setImageUrl(data.secure_url);
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name,
      image: imageUrl,
    };

    const endpoint = mode === "edit" ? `/api/hotels/${hotelId}/category/${categoryId}` : `/api/hotels/${hotelId}/category`;
    const method = mode === "edit" ? "PUT" : "POST";

    const res = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      onClose(); // Close modal on success
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        >
          ✕
        </button>

        <h2 className="text-lg font-semibold mb-4">
          {mode === "edit" ? "Edit Category" : "Create Category"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium">
              Category Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Category Image</label>
            {loading ? (
              <p className="text-sm text-gray-500">Uploading...</p>
            ) : imageUrl ? (
              <img src={imageUrl} alt="Uploaded" className="w-full h-40 object-cover rounded-md" />
            ) : (
              <p className="text-sm text-gray-400">Paste an image (Ctrl+V)</p>
            )}
          </div>

          <button
            type="submit"
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            {mode === "edit" ? "Update Category" : "Create Category"}
          </button>
        </form>
      </div>
    </div>
  );
};

export { CategoryForm };
