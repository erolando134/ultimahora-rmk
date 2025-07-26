// src/app/admin/trips/MapaViajes.tsx
"use client";

import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

export default function MapaViajes({ trips }: { trips: any[] }) {
  const carIcon = L.icon({
    iconUrl: "/icons/car.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  return (
    <MapContainer center={[23.1136, -82.3666]} zoom={12} className="w-full h-full">
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://osm.org">OpenStreetMap</a>'
      />
      {trips.map((trip) => (
        <>
          <Marker key={trip.id + "-start"} position={[trip.start.lat, trip.start.lng]} icon={carIcon}>
            <Popup>
              <strong>Inicio</strong><br />
              Chofer: {trip.driverName}<br />
              Hora: {new Date(trip.startTime).toLocaleString()}
            </Popup>
          </Marker>
          <Marker key={trip.id + "-end"} position={[trip.end.lat, trip.end.lng]}>
            <Popup>
              <strong>Fin</strong><br />
              Estado: {trip.status}<br />
              Hora: {new Date(trip.endTime).toLocaleString()}
            </Popup>
          </Marker>
          <Polyline positions={[[trip.start.lat, trip.start.lng], [trip.end.lat, trip.end.lng]]} color="blue" />
        </>
      ))}
    </MapContainer>
  );
}
