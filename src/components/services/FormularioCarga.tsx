'use client';

import React, { useState } from 'react';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase';
import { useToast } from '@/hooks/use-toast';
import { useSession } from 'next-auth/react';

export default function FormularioCarga() {
  const [form, setForm] = useState({
    nombre: '',
    telefono: '',
    tipoVehiculo: '',
    capacidadCarga: '',
    aceptaInterprovincial: false,
  });

  const { toast } = useToast();
  const sessionData = useSession();
  const userEmail = sessionData?.data?.user?.email || null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, type, value } = target;
    const checked = target.checked;

    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !form.nombre ||
      !form.telefono ||
      !form.tipoVehiculo ||
      !form.capacidadCarga ||
      !userEmail
    ) {
      toast({
        title: 'Campos incompletos',
        description:
          'Completa todos los campos y asegúrate de estar logueado.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await addDoc(collection(db, 'solicitar_datos'), {
        userId: userEmail,
        nombre: form.nombre,
        telefono: form.telefono,
        tipoVehiculo: form.tipoVehiculo,
        capacidadCarga: form.capacidadCarga,
        aceptaInterprovincial: form.aceptaInterprovincial,
        tipo: 'carga',
        estado: 'pendiente',
        confirmacion: 'CONFIRMADO',
        createdAt: Timestamp.now(),
      });

      toast({
        title: 'Solicitud enviada',
        description: 'El administrador te responderá pronto.',
      });

      setForm({
        nombre: '',
        telefono: '',
        tipoVehiculo: '',
        capacidadCarga: '',
        aceptaInterprovincial: false,
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
        Inscripción - Servicio de Cargas
      </h1>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-gray-100 p-6 rounded shadow"
      >
        <input
          type="text"
          name="nombre"
          placeholder="Nombre completo"
          value={form.nombre}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded border border-gray-300"
          required
        />

        <input
          type="tel"
          name="telefono"
          placeholder="Teléfono"
          value={form.telefono}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded border border-gray-300"
          required
        />

        <label className="block">
          <span className="text-sm font-medium">Tipo de vehículo</span>
          <select
            name="tipoVehiculo"
            value={form.tipoVehiculo}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded border border-gray-300 mt-1"
            required
          >
            <option value="">Seleccione un tipo</option>
            <option value="camion">Camión</option>
            <option value="camioneta">Camioneta</option>
            <option value="furgon">Furgón</option>
            <option value="trailer">Tráiler</option>
          </select>
        </label>

        <input
          type="text"
          name="capacidadCarga"
          placeholder="Capacidad de carga (en kg o m³)"
          value={form.capacidadCarga}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded border border-gray-300"
          required
        />

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="aceptaInterprovincial"
            checked={form.aceptaInterprovincial}
            onChange={handleChange}
          />
          <span>¿Acepta transportes interprovinciales?</span>
        </label>

        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded w-full"
        >
          Enviar Inscripción
        </button>
      </form>

      <p className="text-sm text-center mt-4 text-gray-600">
        💰 Esta inscripción requiere un depósito inicial de{' '}
        <strong>1000 CUP</strong>.<br />
        Se descontará un <strong>10%</strong> por cada carga realizada.
      </p>
    </main>
  );
}
