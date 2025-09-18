import React, { useEffect, useState } from 'react'
import api from '../services/api'
import { useAuth } from '../contexts/AuthContext'

export default function Alerts() {
  const [alerts, setAlerts] = useState([])
  const { hub } = useAuth()

  useEffect(() => {
    api.get('/api/alerts')
      .then(r => setAlerts(r.data))
      .catch(console.error)
  }, [])

  useEffect(() => {
    if (!hub) return

    const onAlert = (a) => {
      setAlerts(prev => [a, ...prev])
    }
    const onTelemetry = (t) => {
      console.log('telemetry', t)
    }

    hub.on('alert', onAlert)
    hub.on('telemetry', onTelemetry)

    return () => {
      hub.off('alert', onAlert)
      hub.off('telemetry', onTelemetry)
    }
  }, [hub])

  return (
    <div className="p-4 md:p-8">
      <h2 className="text-2xl font-bold mb-6">Alertas</h2>
      
      {alerts.length === 0 ? (
        <p className="text-gray-500">No hay alertas registradas 🚀</p>
      ) : (
        <div className="space-y-4">
          {alerts.map(a => (
            <div 
              key={a.id} 
              className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md shadow-md hover:shadow-lg transition"
            >
              <div className="flex justify-between items-center">
                <p className="font-semibold text-red-700">{a.message}</p>
                <span className="text-xs text-gray-500">
                  {new Date(a.timestamp).toLocaleString()}
                </span>
              </div>
              <p className="text-sm mt-1 text-gray-700">
                Autonomía estimada:{" "}
                <span className="font-medium">
                  {a.autonomyHours?.toFixed?.(2) ?? a.autonomyHours} h
                </span>
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Dispositivo: {a.device?.deviceIdentifier ?? a.device ?? a.deviceId}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
