'use client';

import React, { useState } from 'react';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase';
import { useSession } from 'next-auth/react';
import { useToast } from '@/hooks/use-toast';

export default function TaxiUrbanoForm() {
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [matricula, setMatricula] = useState('');
  const [tipoVehiculo, setTipoVehiculo] = useState('');
  const [mensaje, setMensaje] = useState('');

  const { toast } = useToast();
  const sessionHook = useSession();
  const session = sessionHook?.data;
  const userEmail = session?.user?.email;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!nombre || !telefono || !matricula || !tipoVehiculo || !userEmail) {
      toast({
        title: 'Campos incompletos',
        description: 'Rellena todos los campos y asegúrate de estar logueado.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await addDoc(collection(db, 'solicitar_datos'), {
        userId: userEmail,
        nombre,
        telefono,
        tipo: 'taxi',
        matricula,
        tipoVehiculo,
        estado: 'pendiente',
        confirmacion: 'PENDIENTE',
        createdAt: Timestamp.now(),
      });

      setMensaje('✅ Inscripción completada. ¡Bienvenido a ÚltimaHora!');
      setNombre('');
      setTelefono('');
      setMatricula('');
      setTipoVehiculo('');
    } catch (error: any) {
      toast({
        title: 'Error al guardar',
        description: error.message || 'No se pudo guardar en Firebase.',
        variant: 'destructive',
      });
    }
  };

  return (
    <main className="min-h-screen bg-white text-black p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6 text-center text-green-700">
        Inscribirse como Taxi Urbano
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-gray-100 p-6 rounded-lg shadow-md w-full max-w-md space-y-4"
      >
        <div>
          <label htmlFor="nombre" className="block mb-1 font-semibold">
            Nombre completo:
          </label>
          <input
            id="nombre"
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Tu nombre"
            required
          />
        </div>

        <div>
          <label htmlFor="telefono" className="block mb-1 font-semibold">
            Teléfono:
          </label>
          <input
            id="telefono"
            type="tel"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Ej: 555-123456"
            required
          />
        </div>

        <div>
          <label htmlFor="matricula" className="block mb-1 font-semibold">
            Matrícula del vehículo:
          </label>
          <input
            id="matricula"
            type="text"
            value={matricula}
            onChange={(e) => setMatricula(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Ej: P123456"
            required
          />
        </div>

        <div>
          <label htmlFor="tipoVehiculo" className="block mb-1 font-semibold">
            Tipo de vehículo:
          </label>
          <input
            id="tipoVehiculo"
            type="text"
            value={tipoVehiculo}
            onChange={(e) => setTipoVehiculo(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Ej: Geely, BYD, Moskovitch..."
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-500 text-white py-2 rounded"
        >
          Enviar Inscripción
        </button>

        {mensaje && (
          <p className="mt-4 text-green-700 text-center font-bold">
            {mensaje}
          </p>
        )}
      </form>

      <p className="text-sm text-center mt-4 text-gray-600">
        💰 Esta inscripción requiere un depósito inicial de <strong>1000 CUP</strong>. Se descontará un <strong>10%</strong> por cada servicio realizado.
      </p>
    </main>
  );
}
