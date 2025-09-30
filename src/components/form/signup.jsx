'use client'

import { Input, Button, Textarea } from "@/components/ui"
import { useState } from "react"
import { useRouter } from "next/navigation";

export default function HotelSignupForm() {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    upi_id: '',
    active_time: '',
    parcel_available: true,
    is_active: true,
    is_verify: false,
    description: '',
    images: '', // Comma-separated string
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    try {
      const response = await fetch('/api/hotels', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Signup successful:', data)
        setSuccess('Signup successful! Redirecting to dashboard...')
        // Save token and user info to localStorage for auth context
        localStorage.setItem("token", data.token || "")
        localStorage.setItem("user", JSON.stringify(data.user || {}))
        router.push("/dashboard")
      } else {
        const errorData = await response.json()
        console.error('Signup failed:', errorData.message)
        setError(errorData.message || 'Signup failed')
      }
    } catch (error) {
      console.error('Error during signup:', error)
      setError('Network error. Please try again.')
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto mt-10 p-8 bg-white rounded-lg shadow-md space-y-6"
    >
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Register Your Hotel</h2>
      {error && <div className="text-red-500 text-center">{error}</div>}
      {success && <div className="text-green-500 text-center">{success}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input label="Hotel Name" type="text" name="name" value={formData.name} onChange={handleChange} required />
        <Input label="Username" type="text" name="username" value={formData.username} onChange={handleChange} required />
        <Input label="Email" type="email" name="email" value={formData.email} onChange={handleChange} />
        <Input label="Password" type="password" name="password" value={formData.password} onChange={handleChange} required />
        <Input label="Phone" type="tel" name="phone" value={formData.phone} onChange={handleChange} />
        <Input label="UPI ID" type="text" name="upi_id" value={formData.upi_id} onChange={handleChange} />
        <Input label="Active Time" type="text" name="active_time" value={formData.active_time} onChange={handleChange} />
      </div>

      <Textarea
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        rows={3}
      />

      <Textarea
        label="Address"
        name="address"
        value={formData.address}
        onChange={handleChange}
        rows={3}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="parcel_available"
            checked={formData.parcel_available}
            onChange={handleChange}
            className="w-4 h-4"
          />
          <label htmlFor="parcel_available" className="text-sm">Parcel Available</label>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="is_active"
            checked={formData.is_active}
            onChange={handleChange}
            className="w-4 h-4"
          />
          <label htmlFor="is_active" className="text-sm">Is Active</label>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="is_verify"
            checked={formData.is_verify}
            onChange={handleChange}
            className="w-4 h-4"
          />
          <label htmlFor="is_verify" className="text-sm">Is Verified</label>
        </div>
      </div>

      <div className="pt-4">
        <Button type="submit" variant="primary" className="w-full">
          Sign Up
        </Button>
      </div>
    </form>
  )
}
