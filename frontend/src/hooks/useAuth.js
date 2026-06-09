import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginUser, registerUser } from '../api/auth.api'

export const useAuth = () => {
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (email, password) => {
    try {
      const res = await loginUser({ email, password })
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      navigate('/dashboard')
    } catch (err) {
      setError('Invalid email or password')
    }
  }

  const handleRegister = async (name, email, password) => {
    try {
      const res = await registerUser({ name, email, password })
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      navigate('/dashboard')
    } catch (err) {
      setError('Registration failed, please try again')
    }
  }

  const handleLogout = () => {
    localStorage.clear()
    navigate('/login')
  }

  return { error, handleLogin, handleRegister, handleLogout }
}