import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function NavBar() {
  const { user, logout, isAdmin } = useAuth()
  const [open, setOpen] = useState(false)
  const handleMenuClick = () => {
    setOpen(false)
  }
  return (
    <nav className="bg-white shadow-md fixed top-0 w-full z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="font-bold text-xl text-blue-600">FleetMonitor</Link>

        {/* Links desktop */}
        <div className="hidden md:flex gap-4">
          {user && <Link to="/devices" className="hover:text-blue-500">Devices</Link>}
          {user && <Link to="/telemetry" className="hover:text-blue-500">Telemetry</Link>}
          {user && <Link to="/alerts" className="hover:text-blue-500">Alerts</Link>}
          {user && <Link to="/dashboard" className="hover:text-blue-500">Dashboard</Link>}
        </div>

        {/* Botones / user info */}
        <div className="hidden md:flex items-center gap-3">
          {!user ? (
            <>
              <Link to="/login" className="text-sm">Login</Link>
              <Link to="/register" className="bg-blue-600 text-white px-3 py-1 rounded-md">Register</Link>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Hola, {user.username}</span>
              <button onClick={logout} className="bg-red-500 text-white px-3 py-1 rounded-md">
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Menú móvil */}
        <div className="md:hidden">
          <button onClick={() => setOpen(!open)} className="text-gray-700">
            ☰
          </button>
        </div>
      </div>

      {/* Dropdown móvil */}
      {open && (
        <div className="md:hidden bg-gray-100 px-4 py-2">
          {user && <Link to="/devices" className="block py-1" onClick={handleMenuClick}>Devices</Link>}
          {user && <Link to="/telemetry" className="block py-1" onClick={handleMenuClick}>Telemetry</Link>}
          {user && <Link to="/alerts" className="block py-1" onClick={handleMenuClick}>Alerts</Link>}
          {user && <Link to="/dashboard" className="block py-1" onClick={handleMenuClick}>DashBoard</Link>}
          {!user ? (
            <>
              <Link to="/login" className="block py-1">Login</Link>
              <Link to="/register" className="block py-1">Register</Link>
            </>
          ) : (
            <button onClick={logout} className="w-full text-left py-1 text-red-500">
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  )
}
