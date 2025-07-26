'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase/firebase';
import {
  collection,
  query,
  where,
  onSnapshot,
  Timestamp,
  addDoc,
} from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Send } from 'lucide-react';

interface Viaje {
  id: string;
  choferId: string;
  pickup: string;
  dropoff: string;
  departureTime: string;
  arrivalTime: string;
  passengerCount: number;
  disponible: boolean;
  createdAt: Timestamp;
}

export default function ReservasInterprovincial() {
  const [viajes, setViajes] = useState<Viaje[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'viajes_interprovinciales'),
      where('disponible', '==', true)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const lista: Viaje[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Viaje[];

      setViajes(lista);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const reservarViaje = async (viaje: Viaje) => {
    try {
      await addDoc(collection(db, 'reservas_interprovinciales'), {
        viajeId: viaje.id,
        choferId: viaje.choferId,
        pickup: viaje.pickup,
        dropoff: viaje.dropoff,
        departureTime: viaje.departureTime,
        arrivalTime: viaje.arrivalTime,
        reservadoEn: Timestamp.now(),
        estado: 'pendiente',
      });

      toast({
        title: '✅ Reserva enviada',
        description: 'El chofer recibirá tu solicitud en breve.',
      });
    } catch (error: any) {
      toast({
        title: 'Error al reservar',
        description: error.message || 'No se pudo guardar la reserva.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-center text-green-600">
        Viajes Interprovinciales Disponibles
      </h1>

      {loading ? (
        <p className="text-center text-muted-foreground">Cargando...</p>
      ) : viajes.length === 0 ? (
        <p className="text-center text-muted-foreground">
          No hay viajes disponibles por ahora.
        </p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {viajes.map((viaje) => (
            <Card key={viaje.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Send className="w-4 h-4 text-green-600" />
                  {viaje.pickup} → {viaje.dropoff}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm">
                  🕒 Salida: <strong>{viaje.departureTime}</strong>
                </p>
                <p className="text-sm">
                  🕓 Llegada estimada: <strong>{viaje.arrivalTime}</strong>
                </p>
                <p className="text-sm">
                  🚗 Asientos disponibles: <strong>{viaje.passengerCount}</strong>
                </p>
                <Button
                  onClick={() => reservarViaje(viaje)}
                  className="w-full bg-green-600 hover:bg-green-500 text-white"
                >
                  Reservar
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
