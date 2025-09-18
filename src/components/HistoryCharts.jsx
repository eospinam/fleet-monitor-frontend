import React, { useMemo, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function HistoryCharts({ historyByDevice = {}, metric = "speedKph" }) {
  const [selectedDevice, setSelectedDevice] = useState(null);

  // devices list
  const devices = Object.keys(historyByDevice);

  // data to plot: choose selected device or global (merge latest N)
  const data = useMemo(() => {
    if (!devices.length) return [];

    const device = selectedDevice || devices[0];

    const arr = historyByDevice[device] || [];
    // convert to chart-friendly points sorted by timestamp
    return arr
      .slice()
      .sort((a,b) => new Date(a.timestamp) - new Date(b.timestamp))
      .map(t => ({
        time: new Date(t.timestamp).toLocaleString(),
        value: Number(t[metric])
      }));
  }, [historyByDevice, metric, selectedDevice, devices]);

  return (
    <div style={{ width: "100%", height: 240 }}>
      <div className="mb-2 flex items-center gap-2">
        <label className="text-sm text-gray-600">Device:</label>
        <select
          className="border p-1 rounded"
          value={selectedDevice ?? (devices[0] ?? "")}
          onChange={e => setSelectedDevice(e.target.value)}
        >
          {devices.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={data}>
          <XAxis dataKey="time" tick={{ fontSize: 10 }} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="value" stroke="#3182CE" dot={false} strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
