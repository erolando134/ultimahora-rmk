'use client';

import React, { useState, ChangeEvent, FormEvent } from 'react';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase';
import { useToast } from '@/hooks/use-toast';
import { useSession } from 'next-auth/react';

type FormularioExcursion = {
  nombre: string;
  telefono: string;
  destino: string;
  fecha: string;
  hora: string;
  cantidadPasajeros: string;
  descripcion: string;
};

const InscripcionExcursiones: React.FC = () => {
  const [form, setForm] = useState<FormularioExcursion>({
    nombre: '',
    telefono: '',
    destino: '',
    fecha: '',
    hora: '',
    cantidadPasajeros: '',
    descripcion: '',
  });

  const { toast } = useToast();
  const sessionHook = useSession();
  const session = sessionHook?.data;
  const userEmail = session?.user?.email;

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (
      !form.nombre ||
      !form.telefono ||
      !form.destino ||
      !form.fecha ||
      !form.hora ||
      !form.cantidadPasajeros ||
      !userEmail
    ) {
      toast({
        title: 'Campos incompletos',
        description: 'Completa todos los campos y asegúrate de estar logueado.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await addDoc(collection(db, 'solicitar_datos'), {
        userId: userEmail,
        nombre: form.nombre,
        telefono: form.telefono,
        destino: form.destino,
        fecha: form.fecha,
        hora: form.hora,
        cantidadPasajeros: form.cantidadPasajeros,
        descripcion: form.descripcion,
        tipo: 'excursiones',
        estado: 'pendiente',
        createdAt: Timestamp.now(),
      });

      toast({
        title: 'Solicitud enviada',
        description: 'El administrador te responderá pronto.',
      });

      setForm({
        nombre: '',
        telefono: '',
        destino: '',
        fecha: '',
        hora: '',
        cantidadPasajeros: '',
        descripcion: '',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'No se pudo enviar la solicitud.',
        variant: 'destructive',
      });
    }
  };

  return (
    <main className="min-h-screen bg-white text-black p-6 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Inscripción - Excursiones Programadas
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4 bg-gray-100 p-6 rounded shadow">
        <label className="block">
          <span className="text-sm font-medium">Nombre completo</span>
          <input
            type="text"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded mt-1"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Teléfono</span>
          <input
            type="tel"
            name="telefono"
            value={form.telefono}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded mt-1"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Destino de la excursión</span>
          <input
            type="text"
            name="destino"
            value={form.destino}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded mt-1"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Fecha</span>
          <input
            type="date"
            name="fecha"
            value={form.fecha}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded mt-1"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Hora</span>
          <input
            type="time"
            name="hora"
            value={form.hora}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded mt-1"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Cantidad de pasajeros</span>
          <input
            type="number"
            name="cantidadPasajeros"
            value={form.cantidadPasajeros}
            onChange={handleChange}
            required
            min={1}
            className="w-full px-4 py-2 border rounded mt-1"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Descripción adicional</span>
          <textarea
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 border rounded mt-1"
          />
        </label>

        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-2 rounded w-full hover:bg-green-700"
        >
          Enviar Inscripción
        </button>
      </form>

      <p className="text-sm text-center mt-4 text-gray-600">
        💰 Depósito inicial requerido: <strong>1000 CUP</strong>. Se descontará el <strong>10%</strong> por cada excursión realizada.
      </p>
    </main>
  );
};

export default InscripcionExcursiones;
