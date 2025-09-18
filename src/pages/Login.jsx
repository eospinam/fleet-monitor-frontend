import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const nav = useNavigate()
  const [error, setError] = useState(null)

  const handle = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await login(username, password)  
      nav('/devices', { replace: true }) 
    } catch (err) {
      setError(err.response?.data || err.message)
    } finally { setLoading(false) }
  }

  return (
    <div className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-xl">
      <h2 className="text-2xl font-bold text-center text-blue-600 mb-2">Iniciar sesión</h2>
      <p className="text-sm text-gray-500 text-center mb-6">
        Accede a tu cuenta para continuar
      </p>

      {error && (
        <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-200 text-sm text-red-700">
          {String(error)}
        </div>
      )}

      <form onSubmit={handle} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Usuario</label>
          <input
            className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Contraseña</label>
          <input
            type="password"
            className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          className="w-full py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  )
}
