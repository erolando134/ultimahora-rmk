'use client';

import { useEffect } from 'react';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase';
import { useAuth } from '@/hooks/useAuth';
import { useGeolocation } from '@/hooks/useGeolocation';

export default function ActualizarUbicacionChofer() {
  const { user } = useAuth();
  const { location } = useGeolocation();

  useEffect(() => {
    if (!user?.uid || !location) return;

    const choferRef = doc(db, 'drivers', user.uid);
    updateDoc(choferRef, {
      ubicacion: {
        lat: location.lat,
        lng: location.lng,
        updatedAt: Date.now(),
      },
      lastUpdated: serverTimestamp(),
    }).catch((err) => {
      console.error("Error actualizando ubicación del chófer:", err);
    });

  }, [user?.uid, location]);

  return null; // No renderiza nada, solo actualiza
}
