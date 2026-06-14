import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { handleLogin, error } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-3xl">✍️</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">DocSign</h1>
          <p className="text-gray-400 mt-1">Sign documents digitally</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <button
          onClick={() => handleLogin(email, password)}
          className="w-full bg-blue-600 text-white p-3 rounded-xl mt-6 font-semibold hover:bg-blue-700 transition active:scale-95"
        >
          Sign In
        </button>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account?{' '}
          <span
            className="text-blue-600 font-medium cursor-pointer hover:underline"
            onClick={() => navigate('/register')}
          >
            Create one
          </span>
        </p>
      </div>
    </div>
  )
}

export default Login