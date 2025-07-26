'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase/firebase';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Clock, MapPin, BadgeCheck, Loader, Calendar } from 'lucide-react';
import { useAuth } from '@/lib/firebase/use-auth';

interface Reserva {
  id: string;
  viajeId: string;
  pickup: string;
  dropoff: string;
  departureTime?: string;
  arrivalTime?: string;
  fechaReserva: string;
  estado: string;
  choferEmail?: string;
}

export default function MisReservasInterprovinciales() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.email) return;

    const q = query(
      collection(db, 'reservas_viajes'),
      where('emailCliente', '==', user.email),
      orderBy('fechaReserva', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const lista: Reserva[] = snapshot.docs.map((doc) => {
        const data = doc.data() as {
          viajeId?: string;
          pickup?: string;
          dropoff?: string;
          departureTime?: string;
          arrivalTime?: string;
          fechaReserva?: { toDate: () => Date };
          estado?: string;
          choferEmail?: string;
        };
        return {
          id: doc.id,
          viajeId: data.viajeId || '',
          pickup: data.pickup || '',
          dropoff: data.dropoff || '',
          departureTime: data.departureTime || '',
          arrivalTime: data.arrivalTime || '',
          fechaReserva: data.fechaReserva ? data.fechaReserva.toDate().toLocaleString() : '',
          estado: data.estado || 'pendiente',
          choferEmail: data.choferEmail || 'No asignado',
        };
      });
      setReservas(lista);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user?.email]);

  return (
    <main className="p-6 min-h-screen">
      <h1 className="text-2xl font-bold text-center text-green-700 mb-6">
        Mis Reservas Interprovinciales
      </h1>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Loader className="animate-spin w-6 h-6 text-green-500" />
        </div>
      ) : reservas.length === 0 ? (
        <p className="text-center text-muted-foreground">
          Aún no has hecho ninguna reserva interprovincial.
        </p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reservas.map((reserva) => (
            <Card key={reserva.id} className="bg-white">
              <CardHeader>
                <CardTitle className="text-green-700 text-lg flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  {reserva.pickup} → {reserva.dropoff}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-sm text-gray-700">
                <p className="flex items-center gap-2">
                  <Clock className="w-4 h-4" /> <strong>Salida:</strong> {reserva.departureTime || 'N/D'}
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="w-4 h-4" /> <strong>Llegada:</strong> {reserva.arrivalTime || 'N/D'}
                </p>
                <p className="flex items-center gap-2">
                  <BadgeCheck className="w-4 h-4" /> <strong>Chofer:</strong> {reserva.choferEmail}
                </p>
                <p className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> <strong>Reservado:</strong> {reserva.fechaReserva}
                </p>
                <p className="text-sm mt-1">
                  <strong>Estado:</strong> {reserva.estado}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
