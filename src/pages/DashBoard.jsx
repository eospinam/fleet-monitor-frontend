import React, { useEffect, useMemo, useState } from "react";
import MapView from "../components/MapView";
import HistoryCharts from "../components/HistoryCharts";
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";

export default function Dashboard() {
  const { hub } = useAuth();

  
  const [historyByDevice, setHistoryByDevice] = useState({});

  
  const [latest, setLatest] = useState({});

  useEffect(() => {
    // Cargar telemetría histórica 
    api.get("/api/telemetry").then(r => {
      const items = r.data || [];
      const map = {};
      items.forEach(t => {
        (map[t.deviceId] = map[t.deviceId] || []).push(t);
      });
      setHistoryByDevice(map);

      const latestMap = {};
      items.forEach(t => {
        const curr = latestMap[t.deviceId];
        if (!curr || new Date(curr.timestamp) < new Date(t.timestamp)) {
          latestMap[t.deviceId] = t;
        }
      });
      setLatest(latestMap);
    }).catch(console.error);
  }, []);

  useEffect(() => {
    if (!hub) return;

    const onTelemetry = (t) => {
      // actualizar latest
      setLatest(prev => ({ ...prev, [t.deviceId]: t }));

      // agregar a histórico 
      setHistoryByDevice(prev => {
        const arr = prev[t.deviceId] ? [...prev[t.deviceId]] : [];
        arr.push(t);
        if (arr.length > 200) arr.shift();
        return { ...prev, [t.deviceId]: arr };
      });
    };

    hub.on("telemetry", onTelemetry);
    return () => {
      hub.off("telemetry", onTelemetry);
    };
  }, [hub]);

  // preparar lista de marcadores desde latest
  const markers = useMemo(() => Object.values(latest).map(t => ({
    deviceId: t.deviceId,
    deviceIdentifier: t.device?.deviceIdentifier ?? t.device ?? t.deviceId,
    lat: Number(t.latitude),
    lng: Number(t.longitude),
    fuel: Number(t.fuelLiters),
    speed: Number(t.speedKph),
    timestamp: t.timestamp
  })), [latest]);

  return (
    <div className="p-4 md:p-6 space-y-6 pt-20">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="h-96 md:h-[600px] bg-white rounded-xl shadow-md overflow-hidden">
            <MapView markers={markers} />
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl shadow-md">
            <h3 className="font-semibold mb-2">Velocidad (últimos)</h3>
            <HistoryCharts historyByDevice={historyByDevice} metric="speedKph" />
          </div>
          <div className="bg-white p-4 rounded-xl shadow-md">
            <h3 className="font-semibold mb-2">Combustible (últimos)</h3>
            <HistoryCharts historyByDevice={historyByDevice} metric="fuelLiters" />
          </div>
        </div>
      </div>
    </div>
  );
}
