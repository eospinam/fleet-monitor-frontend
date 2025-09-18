import React, { useEffect, useState } from 'react'
import api from '../services/api'
import { useAuth } from '../contexts/AuthContext'

export default function Devices() {
  const [devices, setDevices] = useState([])
  const [identifier, setIdentifier] = useState('')
  const [capacity, setCapacity] = useState(60)
  const { isAdmin } = useAuth()

  useEffect(() => {
    api.get('/api/device')
      .then(r => setDevices(r.data))
      .catch(console.error)
  }, [])

  const create = async (e) => {
    e.preventDefault()
    try {
      const res = await api.post('/api/device', { 
        deviceIdentifier: identifier, 
        tankCapacityLiters: capacity 
      })
      setDevices(prev => [...prev, res.data])
      setIdentifier('')
      setCapacity(60)
    } catch (err) {
      alert(err.response?.data || err.message)
    }
  }

  return (
    <div className="p-4 md:p-8">
      <h2 className="text-2xl font-bold mb-6">Dispositivos</h2>

      {isAdmin() && (
        <form 
          onSubmit={create} 
          className="mb-6 bg-white p-4 rounded-xl shadow-md"
        >
          <div className="flex flex-col md:flex-row gap-3">
            <input 
              value={identifier}
              onChange={e => setIdentifier(e.target.value)}
              placeholder="Identificador del dispositivo"
              className="flex-1 border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input 
              type="number"
              value={capacity}
              onChange={e => setCapacity(Number(e.target.value))}
              className="w-full md:w-40 border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Capacidad (L)"
            />
            <button 
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Crear
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {devices.map(d => (
          <div 
            key={d.id} 
            className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition"
          >
            <h3 className="text-lg font-semibold text-blue-600">
              {d.deviceIdentifier}
            </h3>
            <p className="text-sm text-gray-500">ID: {d.id}</p>
            <p className="mt-1 text-sm">Capacidad: {d.tankCapacityLiters} L</p>
          </div>
        ))}
      </div>
    </div>
  )
}
