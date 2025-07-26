"use client";

import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/leaflet/images/marker-icon-2x.png",
  iconUrl: "/leaflet/images/marker-icon.png",
  shadowUrl: "/leaflet/images/marker-shadow.png",
});

function LocationPicker({ setCoords }: { setCoords: (latlng: [number, number]) => void }) {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const map = useMapEvents({
    click(e) {
      const coords: [number, number] = [e.latlng.lat, e.latlng.lng];
      setPosition(coords);
      setCoords(coords);
    },
    locationfound(e) {
      const coords: [number, number] = [e.latlng.lat, e.latlng.lng];
      setPosition(coords);
      setCoords(coords);
      map.setView(e.latlng, 15);
    },
  });

  useEffect(() => {
    map.locate();
  }, [map]);

  return position ? <Marker position={position} /> : null;
}

export default function MapaPublicar({ setCoords }: { setCoords: (latlng: [number, number]) => void }) {
  return (
    <MapContainer center={[21.52, -77.78]} zoom={6} className="h-full w-full">
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <LocationPicker setCoords={setCoords} />
    </MapContainer>
  );
}
