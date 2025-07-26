'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { db } from '@/lib/firebase/firebase';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc
} from 'firebase/firestore';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Loader } from 'lucide-react';

interface Reserva {
  id: string;
  nombre: string;
  telefono: string;
  asientos: number;
  viajeId: string;
}

interface Viaje {
  id: string;
  destino: string;
  salida: string;
}

export default function ReservasRecibidas() {
  const { data: session } = useSession();
  const userEmail = session?.user?.email;
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [viajesMap, setViajesMap] = useState<Record<string, Viaje>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarReservas = async () => {
      if (!userEmail) return;

      // 1. Buscar todos los viajes interprovinciales publicados por este chofer
      const viajesSnapshot = await getDocs(
        query(
          collection(db, 'viajes_interprovinciales'),
          where('choferEmail', '==', userEmail)
        )
      );

      const viajes = viajesSnapshot.docs.map((doc) => ({
        id: doc.id,
        destino: doc.data().dropoff || '',
        salida: doc.data().pickup || ''
      }));

      const viajesPorId: Record<string, Viaje> = {};
      const viajesIds = viajes.map((v) => {
        viajesPorId[v.id] = v;
        return v.id;
      });

      setViajesMap(viajesPorId);

      // 2. Buscar reservas asociadas a estos viajes
      const reservasSnapshot = await getDocs(
        query(
          collection(db, 'reservas_interprovinciales'),
          where('viajeId', 'in', viajesIds)
        )
      );

      const reservasList: Reserva[] = reservasSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          nombre: data.nombre,
          telefono: data.telefono,
          asientos: data.asientos,
          viajeId: data.viajeId
        };
      });

      setReservas(reservasList);
      setLoading(false);
    };

    cargarReservas();
  }, [userEmail]);

  return (
    <main className="p-6 bg-white min-h-screen text-black">
      <h1 className="text-2xl font-bold text-center mb-6 text-green-700">
        Reservas Recibidas
      </h1>

      {loading ? (
        <div className="flex justify-center mt-10">
          <Loader className="animate-spin h-8 w-8 text-primary" />
        </div>
      ) : reservas.length === 0 ? (
        <p className="text-center text-muted-foreground">
          Aún no has recibido reservas en tus viajes.
        </p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {reservas.map((reserva) => {
            const viaje = viajesMap[reserva.viajeId];
            return (
              <Card key={reserva.id}>
                <CardHeader>
                  <CardTitle>
                    {reserva.nombre} — {reserva.asientos} asiento(s)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p><strong>Teléfono:</strong> {reserva.telefono}</p>
                  {viaje && (
                    <>
                      <p><strong>Desde:</strong> {viaje.salida}</p>
                      <p><strong>Hacia:</strong> {viaje.destino}</p>
                    </>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </main>
  );
}
