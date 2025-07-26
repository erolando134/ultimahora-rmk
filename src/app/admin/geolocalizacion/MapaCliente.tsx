"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/leaflet/images/marker-icon-2x.png",
  iconUrl: "/leaflet/images/marker-icon.png",
  shadowUrl: "/leaflet/images/marker-shadow.png",
});

interface Chofer {
  uid: string;
  fullName: string;
  phone: string;
  modality: string;
  ubicacion?: {
    lat: number;
    lng: number;
  };
}

export default function MapaCliente({ choferes }: { choferes: Chofer[] }) {
  return (
    <MapContainer center={[21.52, -77.78]} zoom={6} className="h-full w-full">
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {choferes.map((chofer) => (
        <Marker
          key={chofer.uid}
          position={[chofer.ubicacion!.lat, chofer.ubicacion!.lng]}
        >
          <Popup>
            <strong>{chofer.fullName}</strong><br />
            📱 {chofer.phone}<br />
            🚗 {chofer.modality}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
