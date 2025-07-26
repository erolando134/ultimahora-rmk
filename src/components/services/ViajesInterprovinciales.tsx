'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase/firebase';
import {
  collection,
  onSnapshot,
  addDoc,
  Timestamp
} from 'firebase/firestore';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Send, CornerDownLeft } from 'lucide-react';

interface Viaje {
  id: string;
  pickup: string;
  dropoff: string;
  departureTime: string;
  arrivalTime: string;
  phone: string;
  choferEmail: string;
  pasajerosReservados?: number;
  passengerCount?: number;
  retornoDisponible?: boolean;
  regresoPickup?: string;
  regresoDropoff?: string;
  regresoDepartureTime?: string;
  regresoArrivalTime?: string;
}

export default function ViajesInterprovinciales() {
  const [viajes, setViajes] = useState<Viaje[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'viajes_interprovinciales'), (snapshot) => {
      const lista: Viaje[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          pickup: data.pickup || '',
          dropoff: data.dropoff || '',
          departureTime: data.departureTime || '',
          arrivalTime: data.arrivalTime || '',
          phone: data.phone || '',
          choferEmail: data.choferEmail || 'Desconocido',
          pasajerosReservados: data.pasajerosReservados || 0,
          passengerCount: data.passengerCount || 0,
          retornoDisponible: data.retornoDisponible || false,
          regresoPickup: data.regresoPickup || '',
          regresoDropoff: data.regresoDropoff || '',
          regresoDepartureTime: data.regresoDepartureTime || '',
          regresoArrivalTime: data.regresoArrivalTime || ''
        };
      });
      setViajes(lista);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const reservarViaje = async (viaje: Viaje, tipo: 'ida' | 'regreso') => {
    try {
      await addDoc(collection(db, 'reservas_interprovinciales'), {
        viajeId: viaje.id,
        choferEmail: viaje.choferEmail,
        pickup: tipo === 'ida' ? viaje.pickup : viaje.regresoPickup,
        dropoff: tipo === 'ida' ? viaje.dropoff : viaje.regresoDropoff,
        departureTime: tipo === 'ida' ? viaje.departureTime : viaje.regresoDepartureTime,
        arrivalTime: tipo === 'ida' ? viaje.arrivalTime : viaje.regresoArrivalTime,
        fechaReserva: Timestamp.now(),
        tipo,
        estado: 'pendiente'
      });
      alert(`✅ Reserva de ${tipo === 'ida' ? 'ida' : 'regreso'} enviada correctamente.`);
    } catch (error) {
      console.error('Error al reservar:', error);
      alert('❌ Hubo un problema al hacer la reserva.');
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
                  <Send className="h-4 w-4" />
                  {viaje.pickup} → {viaje.dropoff}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-sm text-gray-700">
                <p><strong>Salida:</strong> {viaje.departureTime}</p>
                <p><strong>Llegada:</strong> {viaje.arrivalTime}</p>
                <p><strong>Chofer:</strong> {viaje.choferEmail}</p>
                <p><strong>Teléfono:</strong> {viaje.phone}</p>
                <p><strong>Asientos disponibles:</strong> {viaje.passengerCount}</p>
                <Button
                  className="mt-2 bg-green-600 hover:bg-green-500 text-white"
                  onClick={() => reservarViaje(viaje, 'ida')}
                >
                  Reservar Ida
                </Button>

                {viaje.retornoDisponible && (
                  <>
                    <hr className="my-2" />
                    <p className="flex items-center gap-1 text-green-800">
                      <CornerDownLeft className="w-4 h-4" /> <strong>Viaje de Regreso Disponible</strong>
                    </p>
                    <p><strong>Salida:</strong> {viaje.regresoDepartureTime}</p>
                    <p><strong>Llegada:</strong> {viaje.regresoArrivalTime}</p>
                    <Button
                      className="mt-2 bg-green-500 hover:bg-green-400 text-white"
                      onClick={() => reservarViaje(viaje, 'regreso')}
                    >
                      Reservar Regreso
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
