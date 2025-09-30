'use client'
import { Input, Button } from "@/components/ui"
import { useState } from "react"
import { useAuth } from "@/hook/useAuth"

export default function Login({className}){
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })
  const [error, setError] = useState('')

  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prevFormData => ({ ...prevFormData, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Login successful:', data)
        login({token:data.token,user:data.user})
      } else {
        const errorData = await response.json()
        console.error('Login failed:', errorData.message)
        setError(errorData.message || 'Login failed')
      }
    } catch (error) {
      console.error('Error during login:', error)
      setError('Network error. Please try again.')
    }

    console.log('Login form submitted with data:', formData)
  }

  return(
    <div className={`flex flex-col items-center justify-center p-6 rounded-lg shadow-md w-96 bg-white ${className}`}>
 <h2 className="text-2xl font-bold mb-6 text-gray-800">Welcome Back!</h2>
      {error && <div className="text-red-500 text-center mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
 <Input label="Username" type="text" name="username" value={formData.username} onChange={handleChange} />
 <Input label="Password" type="password" name="password" value={formData.password} onChange={handleChange} />
 <Button variant="primary">Login</Button>
      </form>
      <div className="mt-4 text-center">
 <a href="#" className="text-blue-600 hover:underline text-sm">Forgot password?</a>
      </div>
      <div className="mt-4 text-center text-sm text-gray-600">
 Don't have an account? <a href="/signup" className="text-blue-600 hover:underline">Sign up</a>
      </div>
    </div>
  )
}
