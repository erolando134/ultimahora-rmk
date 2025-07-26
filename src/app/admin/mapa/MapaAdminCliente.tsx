'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase';

// Configuración del ícono para los marcadores
const defaultIcon = L.icon({
  iconUrl: '/leaflet/images/marker-icon.png',
  shadowUrl: '/leaflet/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = defaultIcon;

interface DriverData {
  id: string;
  fullName?: string;
  modality?: string;
  status?: string;
  ubicacion?: {
    lat: number;
    lng: number;
    updatedAt?: number | null;
  };
}

export default function MapaAdminCliente() {
  const [drivers, setDrivers] = useState<DriverData[]>([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'drivers'), (snapshot) => {
      const choferes: DriverData[] = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() })) 
        .filter(
          (doc: any) =>
            doc.ubicacion?.lat !== undefined &&
            doc.ubicacion?.lng !== undefined &&
            doc.status !== 'rejected'
        );

      setDrivers(choferes);
    });

    return () => unsub();
  }, []);

  return (
    <div className="h-screen w-full">
      <MapContainer center={[21.5218, -77.7812]} zoom={6} className="h-full w-full z-0">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        {drivers.map((driver) => (
          <Marker
            key={driver.id}
            position={[driver.ubicacion!.lat, driver.ubicacion!.lng]}
          >
            <Popup>
              <div>
                <p><strong>Nombre:</strong> {driver.fullName || 'Sin nombre'}</p>
                <p><strong>Modalidad:</strong> {driver.modality || 'Desconocida'}</p>
                <p><strong>Estado:</strong> {driver.status || 'N/A'}</p>
                <p>
                  <strong>Actualizado:</strong>{' '}
                  {driver.ubicacion?.updatedAt
                    ? new Date(driver.ubicacion.updatedAt).toLocaleString()
                    : 'No disponible'}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
