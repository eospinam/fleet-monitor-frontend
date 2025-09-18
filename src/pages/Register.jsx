import React, { useState } from 'react'
import { register } from '../services/auth'
import { useNavigate } from 'react-router-dom'

export default function Register() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('user')
  const [msg, setMsg] = useState(null)
  const nav = useNavigate()

  const handle = async (e) => {
    e.preventDefault()
    try {
      await register(username, password, role)
      setMsg({ type: 'success', text: 'Usuario creado. Redirigiendo...' })
      setTimeout(() => nav('/login'), 1200)
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data || err.message })
    }
  }

  return (
    
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-2">Registro</h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          Crea una cuenta para acceder al sistema
        </p>

        {msg && (
          <div
            className={`mb-4 p-3 rounded-md text-sm ${
              msg.type === 'success'
                ? 'bg-blue-50 border border-blue-200 text-blue-700'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}
          >
            {msg.text}
          </div>
        )}

        <form onSubmit={handle} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Usuario</label>
            <input
              className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Contraseña</label>
            <input
              type="password"
              className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Rol</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="user">Usuario</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          <button
            className="w-full py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition"
          >
            Crear cuenta
          </button>
        </form>
      </div>
  )
}
