import React, { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Devices from './pages/Devices'
import Telemetry from './pages/Telemetry'
import Alerts from './pages/Alerts'
import NavBar from './components/NavBar'
import Dashboard from './pages/DashBoard'
import { useAuth } from './contexts/AuthContext'
import { getPendingTelemetry, clearTelemetry } from './services/offlineStore'
import api from './services/api'

export default function App() {
  const { user } = useAuth()

  useEffect(() => {
    const syncTelemetry = async () => {
      const pending = await getPendingTelemetry()
      console.log('Telemetrías pendientes:', pending)

      for (const t of pending) {
        try {
          await api.post('/api/telemetry', t)
          await clearTelemetry(t.id)
          console.log('Telemetría sincronizada', t)
        } catch (err) {
          console.error('Error al sincronizar telemetría:', err)
        }
      }
    }

    window.addEventListener('online', syncTelemetry)
    return () => window.removeEventListener('online', syncTelemetry)
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
      <NavBar />
      <main className="flex-1 flex items-center justify-center px-4">
        <Routes>
          <Route path="/" element={user ? <Navigate to="/devices" /> : <Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/devices" element={user ? <Devices /> : <Navigate to="/login" />} />
          <Route path="/telemetry" element={user ? <Telemetry /> : <Navigate to="/login" />} />
          <Route path="/alerts" element={user ? <Alerts /> : <Navigate to="/login" />} />
          <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
        </Routes>
      </main>
    </div>
  )
}
