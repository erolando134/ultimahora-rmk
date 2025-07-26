'use client';

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase/firebase";
import { useAuth } from "@/lib/firebase/use-auth"; // usa tu hook de autenticación
import { collection, onSnapshot, addDoc, Timestamp } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { MapPin, Clock, BadgeCheck } from "lucide-react";

interface Viaje {
  id: string;
  pickup: string;
  dropoff: string;
  departureTime: string;
  arrivalTime: string;
  phone: string;
  choferEmail: string;
}

export default function ViajesInterprovinciales() {
  const [viajes, setViajes] = useState<Viaje[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth(); // Asegúrate de que esto devuelva { email }

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "viajes_interprovinciales"), (snapshot) => {
      const lista: Viaje[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          pickup: data.pickup || "",
          dropoff: data.dropoff || "",
          departureTime: data.departureTime || "",
          arrivalTime: data.arrivalTime || "",
          phone: data.phone || "",
          choferEmail: data.choferEmail || "Desconocido",
        };
      });
      setViajes(lista);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const reservarAsiento = async (viaje: Viaje) => {
    try {
      if (!user?.email) {
        toast({
          title: "Error",
          description: "Debes iniciar sesión para reservar.",
          variant: "destructive",
        });
        return;
      }

      await addDoc(collection(db, "reservas_viajes"), {
        viajeId: viaje.id,
        choferEmail: viaje.choferEmail,
        pickup: viaje.pickup,
        dropoff: viaje.dropoff,
        departureTime: viaje.departureTime,
        arrivalTime: viaje.arrivalTime,
        emailCliente: user.email, // ⬅️ Aquí guardamos el email del cliente
        fechaReserva: Timestamp.now(),
        estado: "pendiente",
      });

      toast({
        title: "✅ Reserva enviada",
        description: "El chofer será notificado.",
      });
    } catch (error) {
      console.error("Error al reservar:", error);
      toast({
        title: "❌ Error",
        description: "Hubo un problema al reservar.",
        variant: "destructive",
      });
    }
  };

  return (
    <main className="p-6 bg-white min-h-screen text-black">
      <h1 className="text-3xl font-bold text-center mb-6 text-green-700">
        Viajes Interprovinciales Disponibles
      </h1>

      {loading ? (
        <p className="text-center">Cargando viajes...</p>
      ) : viajes.length === 0 ? (
        <p className="text-center text-gray-500">
          No hay viajes publicados por el momento.
        </p>
      ) : (
        <div className="grid gap-4">
          {viajes.map((viaje) => (
            <Card key={viaje.id} className="bg-gray-50">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-green-800 flex gap-2 items-center">
                  <MapPin className="w-4 h-4" />
                  {viaje.pickup} → {viaje.dropoff}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-sm text-gray-700">
                <p><Clock className="inline w-4 h-4" /> <strong>Salida:</strong> {viaje.departureTime}</p>
                <p><Clock className="inline w-4 h-4" /> <strong>Llegada:</strong> {viaje.arrivalTime}</p>
                <p><BadgeCheck className="inline w-4 h-4" /> <strong>Chofer:</strong> {viaje.choferEmail}</p>
                <Button
                  className="mt-3 bg-green-600 hover:bg-green-500 text-white"
                  onClick={() => reservarAsiento(viaje)}
                >
                  Reservar este viaje
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
