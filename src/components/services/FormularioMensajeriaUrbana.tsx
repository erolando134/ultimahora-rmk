'use client';

import React, { useState } from 'react';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase';
import { toast } from '@/hooks/use-toast';

export default function FormularioMensajeriaUrbana() {
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [packageSize, setPackageSize] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!pickup || !dropoff || !packageSize || !phone) {
      toast({
        title: 'Campos incompletos',
        description: 'Por favor completa todos los campos obligatorios.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await addDoc(collection(db, 'solicitar_datos'), {
        direccionRecogida: pickup,
        direccionEntrega: dropoff,
        tamanoPaquete: packageSize,
        telefono: phone,
        tipo: 'mensajeria-urbana',
        estado: 'pendiente',
        confirmacion: 'CONFIRMADO',
        createdAt: Timestamp.now(),
      });

      toast({
        title: 'Solicitud enviada',
        description: 'Tu solicitud fue recibida correctamente.',
      });

      setPickup('');
      setDropoff('');
      setPackageSize('');
      setPhone('');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'No se pudo enviar la solicitud.',
        variant: 'destructive',
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow-md max-w-md mx-auto mt-10 space-y-4"
    >
      <h2 className="text-2xl font-bold text-blue-600 mb-4">
        Servicio de Mensajería Urbana
      </h2>

      <div>
        <label htmlFor="pickup" className="block text-gray-700 mb-1">
          Dirección de recogida
        </label>
        <input
          id="pickup"
          type="text"
          placeholder="Ej: Calle 1ra #123"
          title="Dirección de recogida"
          value={pickup}
          onChange={(e) => setPickup(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
          required
        />
      </div>

      <div>
        <label htmlFor="dropoff" className="block text-gray-700 mb-1">
          Dirección de entrega
        </label>
        <input
          id="dropoff"
          type="text"
          placeholder="Ej: Calle Final #456"
          title="Dirección de entrega"
          value={dropoff}
          onChange={(e) => setDropoff(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
          required
        />
      </div>

      <div>
        <label htmlFor="packageSize" className="block text-gray-700 mb-1">
          Tamaño del paquete
        </label>
        <select
          id="packageSize"
          title="Tamaño del paquete"
          value={packageSize}
          onChange={(e) => setPackageSize(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
          required
        >
          <option value="">Seleccione</option>
          <option value="pequeño">Pequeño</option>
          <option value="mediano">Mediano</option>
          <option value="grande">Grande</option>
        </select>
      </div>

      <div>
        <label htmlFor="phone" className="block text-gray-700 mb-1">
          Teléfono de contacto
        </label>
        <input
          id="phone"
          type="tel"
          placeholder="Ej: 555-1234"
          title="Teléfono de contacto"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full py-2 px-4 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
      >
        Enviar Solicitud
      </button>
    </form>
  );
}
