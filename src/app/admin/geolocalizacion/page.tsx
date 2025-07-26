"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";

// Carga dinámica del componente que usa react-leaflet, sin SSR
const DynamicMap = dynamic(() => import("./MapaCliente"), {
  ssr: false,
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

export default function GeolocalizacionAdminPage() {
  const [choferes, setChoferes] = useState<Chofer[]>([]);

  useEffect(() => {
    const fetchChoferes = async () => {
      const snapshot = await getDocs(collection(db, "drivers"));
      const data: Chofer[] = snapshot.docs.map((doc) => ({
        uid: doc.id,
        ...doc.data(),
      })) as Chofer[];

      const conUbicacion = data.filter((c) => c.ubicacion?.lat && c.ubicacion?.lng);
      setChoferes(conUbicacion);
    };

    fetchChoferes();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Geolocalización de Chóferes</h1>
      <div className="h-[75vh] w-full rounded-lg overflow-hidden border shadow">
        <DynamicMap choferes={choferes} />
      </div>
    </div>
  );
}
