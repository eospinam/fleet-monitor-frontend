import React, { useEffect, useState } from 'react'
import api from '../services/api'
import { saveTelemetryOffline } from '../services/offlineStore'

export default function Telemetry() {
  const [devices, setDevices] = useState([])
  const [deviceId, setDeviceId] = useState('')
  const [fuel, setFuel] = useState(30)
  const [lat, setLat] = useState(4.7110)
  const [lng, setLng] = useState(-74.0721)
  const [speed, setSpeed] = useState(0)
  const [temp, setTemp] = useState(25)

  useEffect(() => {
    api.get('/api/device').then(r => {
      setDevices(r.data)
      if (r.data.length) setDeviceId(r.data[0].id)
    })
  }, [])

  const send = async (e) => {
    e.preventDefault()
    try {
      await api.post('/api/telemetry', {
        deviceId,
        timestamp: new Date().toISOString(),
        latitude: Number(lat),
        longitude: Number(lng),
        speedKph: Number(speed),
        fuelLiters: Number(fuel),
        temperatureC: Number(temp)
      })
      alert('Telemetría enviada')
    } catch (err) {
      console.error('Sin conexión, guardando en IndexedDB...', err)
    await saveTelemetryOffline({
      deviceId,
      latitude: Number(lat),
      longitude: Number(lng),
      speedKph: Number(speed),
      fuelLiters: Number(fuel),
      temperatureC: Number(temp),
      timestamp: new Date().toISOString()
    })
    alert('No hay internet. Telemetría guardada offline')
    }
  }

  return (
    <div className="p-4 md:p-8">
      <h2 className="text-2xl font-bold mb-6">Enviar Telemetría</h2>
      <form 
        onSubmit={send} 
        className="bg-white p-6 rounded-xl shadow-md max-w-2xl space-y-4"
      >
        {/* Selector de dispositivo */}
        <div>
          <label className="block text-sm font-medium mb-1">Dispositivo</label>
          <select
            className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={deviceId}
            onChange={e => setDeviceId(e.target.value)}
          >
            {devices.map(d => (
              <option key={d.id} value={d.id}>
                {d.deviceIdentifier}
              </option>
            ))}
          </select>
        </div>

        {/* Campos en grid responsiva */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Fuel (L)</label>
            <input 
              type="number" 
              value={fuel} 
              onChange={e => setFuel(e.target.value)} 
              className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Speed (km/h)</label>
            <input 
              type="number" 
              value={speed} 
              onChange={e => setSpeed(e.target.value)} 
              className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Latitud</label>
            <input 
              value={lat} 
              onChange={e => setLat(e.target.value)} 
              className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Longitud</label>
            <input 
              value={lng} 
              onChange={e => setLng(e.target.value)} 
              className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Temperatura (°C)</label>
            <input 
              type="number" 
              value={temp} 
              onChange={e => setTemp(e.target.value)} 
              className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Botón */}
        <button 
          className="w-full sm:w-auto px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
        >
          Enviar
        </button>
      </form>
    </div>
  )
}
