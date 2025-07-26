'use client';

import React, { useState } from 'react';
import { db } from '@/lib/firebase/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { useSession } from 'next-auth/react';
// Importamos el hook useToast, no la función toast directamente
import { useToast } from '@/hooks/use-toast';

export default function FormularioViajeInterprovincial() {
  // Extraemos data y status para controlar el estado de la sesión
  const { data: session, status } = useSession();

  // Extraemos la función toast desde el hook useToast
  const { toast } = useToast();

  const userEmail = session?.user?.email;

  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [arrivalTime, setArrivalTime] = useState('');
  const [passengerCount, setPassengerCount] = useState('');
  const [phone, setPhone] = useState('');
  const [tieneRegreso, setTieneRegreso] = useState(false);
  const [pickupRegreso, setPickupRegreso] = useState('');
  const [dropoffRegreso, setDropoffRegreso] = useState('');
  const [horaSalidaRegreso, setHoraSalidaRegreso] = useState('');
  const [horaLlegadaRegreso, setHoraLlegadaRegreso] = useState('');

  // Mientras la sesión está cargando, mostramos mensaje para evitar error de desestructuración
  if (status === 'loading') {
    return <p>Cargando sesión...</p>;
  }

  // Si no hay usuario logueado, mostramos aviso y no permitimos publicar
  if (!userEmail) {
    return <p>Debes iniciar sesión para publicar un viaje.</p>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const viaje = {
        choferId: userEmail,
        pickup,
        dropoff,
        departureTime,
        arrivalTime,
        passengerCount: Number(passengerCount),
        phone,
        disponible: true,
        createdAt: Timestamp.now(),
        regreso: tieneRegreso
          ? {
              pickup: pickupRegreso,
              dropoff: dropoffRegreso,
              departureTime: horaSalidaRegreso,
              arrivalTime: horaLlegadaRegreso,
            }
          : null,
      };

      await addDoc(collection(db, 'viajes_interprovinciales'), viaje);

      toast({
        title: '✅ Publicado',
        description: 'Tu viaje fue publicado correctamente.',
      });

      // Limpiamos campos después de enviar
      setPickup('');
      setDropoff('');
      setDepartureTime('');
      setArrivalTime('');
      setPassengerCount('');
      setPhone('');
      setTieneRegreso(false);
      setPickupRegreso('');
      setDropoffRegreso('');
      setHoraSalidaRegreso('');
      setHoraLlegadaRegreso('');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Hubo un problema al publicar el viaje.',
        variant: 'destructive',
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow-md max-w-md mx-auto mt-10 space-y-4"
    >
      <h2 className="text-2xl font-bold text-green-600 mb-4">
        Publicar Viaje Interprovincial
      </h2>

      <div>
        <label htmlFor="pickup" className="block text-gray-700">
          Lugar de salida:
        </label>
        <input
          id="pickup"
          type="text"
          placeholder="Ej: La Habana"
          value={pickup}
          onChange={(e) => setPickup(e.target.value)}
          className="w-full px-4 py-2 border rounded"
          required
        />
      </div>

      <div>
        <label htmlFor="dropoff" className="block text-gray-700">
          Lugar de destino:
        </label>
        <input
          id="dropoff"
          type="text"
          placeholder="Ej: Santiago de Cuba"
          value={dropoff}
          onChange={(e) => setDropoff(e.target.value)}
          className="w-full px-4 py-2 border rounded"
          required
        />
      </div>

      <div>
        <label htmlFor="departureTime" className="block text-gray-700">
          Hora de salida:
        </label>
        <input
          id="departureTime"
          type="time"
          value={departureTime}
          onChange={(e) => setDepartureTime(e.target.value)}
          className="w-full px-4 py-2 border rounded"
          required
        />
      </div>

      <div>
        <label htmlFor="arrivalTime" className="block text-gray-700">
          Hora estimada de llegada:
        </label>
        <input
          id="arrivalTime"
          type="time"
          value={arrivalTime}
          onChange={(e) => setArrivalTime(e.target.value)}
          className="w-full px-4 py-2 border rounded"
          required
        />
      </div>

      <div>
        <label htmlFor="passengerCount" className="block text-gray-700">
          Asientos disponibles:
        </label>
        <input
          id="passengerCount"
          type="number"
          min="1"
          placeholder="Ej: 4"
          value={passengerCount}
          onChange={(e) => setPassengerCount(e.target.value)}
          className="w-full px-4 py-2 border rounded"
          required
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-gray-700">
          Teléfono de contacto:
        </label>
        <input
          id="phone"
          type="tel"
          placeholder="Ej: 555-123456"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full px-4 py-2 border rounded"
          required
        />
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={tieneRegreso}
            onChange={(e) => setTieneRegreso(e.target.checked)}
          />
          ¿Hay viaje de regreso?
        </label>
      </div>

      {tieneRegreso && (
        <div className="space-y-2">
          <div>
            <label htmlFor="pickupRegreso" className="block text-gray-700">
              Salida (regreso):
            </label>
            <input
              id="pickupRegreso"
              type="text"
              placeholder="Ej: Santiago de Cuba"
              value={pickupRegreso}
              onChange={(e) => setPickupRegreso(e.target.value)}
              className="w-full px-4 py-2 border rounded"
              required
            />
          </div>

          <div>
            <label htmlFor="dropoffRegreso" className="block text-gray-700">
              Destino (regreso):
            </label>
            <input
              id="dropoffRegreso"
              type="text"
              placeholder="Ej: La Habana"
              value={dropoffRegreso}
              onChange={(e) => setDropoffRegreso(e.target.value)}
              className="w-full px-4 py-2 border rounded"
              required
            />
          </div>

          <div>
            <label htmlFor="horaSalidaRegreso" className="block text-gray-700">
              Hora de salida (regreso):
            </label>
            <input
              id="horaSalidaRegreso"
              type="time"
              value={horaSalidaRegreso}
              onChange={(e) => setHoraSalidaRegreso(e.target.value)}
              className="w-full px-4 py-2 border rounded"
              required
            />
          </div>

          <div>
            <label htmlFor="horaLlegadaRegreso" className="block text-gray-700">
              Hora estimada de llegada (regreso):
            </label>
            <input
              id="horaLlegadaRegreso"
              type="time"
              value={horaLlegadaRegreso}
              onChange={(e) => setHoraLlegadaRegreso(e.target.value)}
              className="w-full px-4 py-2 border rounded"
              required
            />
          </div>
        </div>
      )}

      <button
        type="submit"
        className="w-full py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Publicar Viaje
      </button>
    </form>
  );
}
