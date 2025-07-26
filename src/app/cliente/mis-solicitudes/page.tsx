"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase/firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader, Send, Car, Truck, PackageCheck } from "lucide-react";

interface Solicitud {
  id: string;
  tipo: string;
  estado: string;
  fecha: string;
  detalles: string;
}

const iconos: Record<string, any> = {
  taxi: Car,
  carga: Truck,
  mensajeria: Send,
};

export default function MisSolicitudes() {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "solicitudes_servicio"), orderBy("fecha", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      const lista: Solicitud[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          tipo: data.tipo || "general",
          estado: data.estado || "pendiente",
          fecha: data.fecha?.toDate?.().toLocaleString() || "N/A",
          detalles: data.detalles || "",
        };
      });
      setSolicitudes(lista);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-center">Mis Solicitudes</h1>

      {loading ? (
        <div className="flex justify-center mt-10">
          <Loader className="animate-spin h-8 w-8 text-primary" />
        </div>
      ) : solicitudes.length === 0 ? (
        <p className="text-center text-muted-foreground">Aún no has hecho ninguna solicitud.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {solicitudes.map((solicitud) => {
            const Icono = iconos[solicitud.tipo] || PackageCheck;
            return (
              <Card key={solicitud.id}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3">
                    <Icono className="h-5 w-5 text-primary" />
                    <span>{solicitud.tipo.toUpperCase()}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground">Estado: {solicitud.estado}</p>
                  <p className="text-sm">Fecha: {solicitud.fecha}</p>
                  <p className="text-sm">Detalles: {solicitud.detalles}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
