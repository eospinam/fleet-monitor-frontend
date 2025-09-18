import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function MapView({ markers = [] }) {
  // centro por defecto (si no hay marcadores) - Bogotá
  const center = markers.length ? [markers[0].lat, markers[0].lng] : [4.7110, -74.0721];

  return (
    <MapContainer center={center} zoom={10} style={{ height: "100%", width: "100%" }}>
      <TileLayer
        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {markers.map(m => (
        <Marker key={m.deviceId} position={[m.lat, m.lng]}>
          <Popup>
            <div>
              <strong>{m.deviceIdentifier}</strong>
              <div>Fuel: {m.fuel} L</div>
              <div>Speed: {m.speed} km/h</div>
              <div>{new Date(m.timestamp).toLocaleString()}</div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
