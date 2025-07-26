// src/app/admin/trips/page.tsx
"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase/firebase";
import { collection, getDocs } from "firebase/firestore";
import dynamic from "next/dynamic";

// 👇 Importa el mapa dinámicamente para evitar el error de window
const MapaViajes = dynamic(() => import("./MapaViajes"), {
  ssr: false,
});

const ViajesAdminPage = () => {
  const [trips, setTrips] = useState<any[]>([]);

  useEffect(() => {
    const fetchTrips = async () => {
      const querySnapshot = await getDocs(collection(db, "trips"));
      const tripList: any[] = [];
      querySnapshot.forEach((doc) => {
        tripList.push({ id: doc.id, ...doc.data() });
      });
      setTrips(tripList);
    };
    fetchTrips();
  }, []);

  return (
    <div className="w-full h-screen">
      <MapaViajes trips={trips} />
    </div>
  );
};

export default ViajesAdminPage;
