
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"; // Assuming you still want Shadcn UI Button
import { Input } from "@/components/ui/input"; // Assuming you still want Shadcn UI Input
import { Textarea } from "@/components/ui"; // Assuming you still want Shadcn UI Textarea
import { Label } from "@/components/ui/label"; // Assuming you still want Shadcn UI Label

const NewHotelPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    email: "",
    phone: "",
    address: "",
    images: "", // Assuming images is a string for now (e.g., a URL or comma-separated URLs)
    active_time: "",
    parcel_available: true,
    is_active: true, // Defaulting to true as per your API
    is_verify: true, // Defaulting to true as per your API
    username: "",
    password: "",
    upi_id: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [id]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/hotels", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Hotel added successfully!"); // Using a simple alert instead of toast
        router.push("/admin/hotels"); // Redirect to the hotels list page
      } else {
        alert(data.message || "Failed to add hotel."); // Using a simple alert for error
      }
    } catch (error) {
      console.error("Error adding hotel:", error);
      alert("An unexpected error occurred."); // Using a simple alert for unexpected error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add New Hotel</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="col-span-1">
          <Label htmlFor="name">Hotel Name</Label>
          <Input id="name" value={formData.name} onChange={handleChange} required />
        </div>

        <div className="col-span-1">
          <Label htmlFor="username">Username</Label>
          <Input id="username" value={formData.username} onChange={handleChange} required />
        </div>

        <div className="col-span-1">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" value={formData.password} onChange={handleChange} required />
        </div>

        <div className="col-span-1">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={formData.email} onChange={handleChange} />
        </div>

        <div className="col-span-1">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" type="tel" value={formData.phone} onChange={handleChange} />
        </div>

        <div className="col-span-1">
          <Label htmlFor="upi_id">UPI ID</Label>
          <Input id="upi_id" value={formData.upi_id} onChange={handleChange} />
        </div>

        <div className="col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" value={formData.description} onChange={handleChange} rows="4" />
        </div>

        <div className="col-span-2">
          <Label htmlFor="address">Address</Label>
          <Textarea id="address" value={formData.address} onChange={handleChange} rows="3" />
        </div>

        <div className="col-span-2">
          <Label htmlFor="images">Images (URLs)</Label>
          <Input id="images" value={formData.images} onChange={handleChange} placeholder="Enter image URLs, comma-separated if multiple" />
        </div>

        <div className="col-span-1">
          <Label htmlFor="active_time">Active Time</Label>
          <Input id="active_time" value={formData.active_time} onChange={handleChange} placeholder="e.g., 9 AM - 10 PM" />
        </div>

        {/* Checkbox for parcel_available */}
        <div className="col-span-1 flex items-center space-x-2 mt-6">
          <input
            id="parcel_available"
            type="checkbox"
            checked={formData.parcel_available}
            onChange={handleChange}
            className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out" // Basic Tailwind styling
          />
          <Label htmlFor="parcel_available">Parcel Available</Label>
        </div>

        {/* is_active and is_verify checkboxes (optional, using Tailwind) */}
        <div className="col-span-1 flex items-center space-x-2 mt-6">
          <input
            id="is_active"
            type="checkbox"
            checked={formData.is_active}
            onChange={handleChange}
            className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out" // Basic Tailwind styling
          />
          <Label htmlFor="is_active">Is Active</Label>
        </div>
        <div className="col-span-1 flex items-center space-x-2 mt-6">
          <input
            id="is_verify"
            type="checkbox"
            checked={formData.is_verify}
            onChange={handleChange}
            className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out" // Basic Tailwind styling
          />
          <Label htmlFor="is_verify">Is Verified</Label>
        </div>

        <div className="col-span-2">
          <Button type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add Hotel"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NewHotelPage;
