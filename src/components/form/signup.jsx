
'use client'
import { Input, Button } from "@/components/ui"
import { useState } from "react"

export default function SignupForm(){
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prevFormData => ({ ...prevFormData, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Signup successful:', data)
        // Handle successful signup, e.g., redirect or show success message
      } else {
        const errorData = await response.json()
        console.error('Signup failed:', errorData.message)
        // Handle signup failure, e.g., show error message
      }
    } catch (error) {
      console.error('Error during signup:', error)
      // Handle network errors or other exceptions
    }

    console.log('Signup form submitted with data:', formData)
  }

  return(
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6 rounded-lg shadow-md" style={{ backgroundColor: 'white' }}>
      <Input label="Username" type="text" name="username" value={formData.username} onChange={handleChange} />
      <Input label="Email" type="email" name="email" value={formData.email} onChange={handleChange} />
      <Input label="Password" type="password" name="password" value={formData.password} onChange={handleChange} />
      <Button variant="primary">Signup</Button>
    </form>
  )
}
