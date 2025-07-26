'use client';

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import L from 'leaflet';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase';

// Corrección icono por defecto Leaflet (para que se vea el pin)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/leaflet/images/marker-icon-2x.png',
  iconUrl: '/leaflet/images/marker-icon.png',
  shadowUrl: '/leaflet/images/marker-shadow.png',
});

// Componente para centrar mapa en la posición del usuario
function SetViewToUserLocation() {
  const map = useMap();

  useEffect(() => {
    if (!navigator.geolocation) {
      alert('Geolocalización no disponible');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        map.setView([latitude, longitude], 13);
      },
      () => alert('No se pudo obtener la ubicación')
    );
  }, [map]);

  return null;
}

export default function MapView() {
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'drivers'), (snapshot) => {
      const driversData = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.ubicacion && data.ubicacion.lat && data.ubicacion.lng) {
          driversData.push({
            id: doc.id,
            lat: data.ubicacion.lat,
            lng: data.ubicacion.lng,
            nombre: data.fullName || 'Chofer',
            modalidad: data.modality || 'Desconocida',
          });
        }
      });
      setDrivers(driversData);
    });

    return () => unsubscribe();
  }, []);

  return (
    <MapContainer
      center={[23.1136, -82.3666]}
      zoom={6}
      style={{ height: '500px', width: '100%' }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <SetViewToUserLocation />
      {drivers.map(({ id, lat, lng, nombre, modalidad }) => (
        <Marker key={id} position={[lat, lng]}>
          <Popup>
            <strong>{nombre}</strong> <br />
            Modalidad: {modalidad}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
