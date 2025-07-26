'use client';

import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useSession } from 'next-auth/react';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase';
import { useToast } from '@/hooks/use-toast';

export default function InscripcionMensajeria() {
  const { toast } = useToast();
  const sessionHook = useSession();
  const session = sessionHook?.data;
  const userEmail = session?.user?.email;

  const [form, setForm] = useState({
    nombre: '',
    telefono: '',
    direccionEntrega: '',
    descripcionPaquete: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!userEmail || !form.nombre || !form.telefono || !form.direccionEntrega || !form.descripcionPaquete) {
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
        direccionEntrega: form.direccionEntrega,
        descripcionPaquete: form.descripcionPaquete,
        tipo: 'mensajeria',
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
        direccionEntrega: '',
        descripcionPaquete: '',
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
      <h1 className="text-3xl font-bold mb-6 text-center">Inscripción - Mensajería</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-gray-100 p-6 rounded shadow">
        <input
          type="text"
          name="nombre"
          placeholder="Nombre completo"
          value={form.nombre}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
          required
        />
        <input
          type="tel"
          name="telefono"
          placeholder="Teléfono"
          value={form.telefono}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
          required
        />
        <input
          type="text"
          name="direccionEntrega"
          placeholder="Dirección de entrega"
          value={form.direccionEntrega}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
          required
        />
        <textarea
          name="descripcionPaquete"
          placeholder="Descripción del paquete"
          value={form.descripcionPaquete}
          onChange={handleChange}
          rows={3}
          className="w-full px-4 py-2 border rounded"
          required
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-2 rounded w-full hover:bg-green-700"
        >
          Enviar Inscripción
        </button>
      </form>

      <p className="text-sm text-center mt-4 text-gray-600">
        💰 Esta inscripción requiere un depósito inicial de <strong>1000 CUP</strong>.<br />
        Se descontará un <strong>10%</strong> por cada envío realizado.
      </p>
    </main>
  );
}
