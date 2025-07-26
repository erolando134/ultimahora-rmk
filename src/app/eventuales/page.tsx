'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth'; // si usas auth, o adapta para identificar uid del chofer eventual
import FormularioServicioEventual from '@/components/services/FormularioServicioEventual';
import { registrarDeposito, obtenerEstado } from '@/lib/firebase/eventualService';

const CUATRO_HORAS_MS = 4 * 60 * 60 * 1000;

export default function EventualesPage() {
  const { user } = useAuth(); // para identificar uid del chofer eventual
  const [activo, setActivo] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showNotificacion, setShowNotificacion] = useState(false);
  const [telefono, setTelefono] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      setActivo(false);
      return;
    }

    async function checkEstado() {
      setLoading(true);

      if (!user) {
        setActivo(false);
        setShowNotificacion(false);
        setLoading(false);
        return;
      }

      const estado = await obtenerEstado(user.uid);

      if (!estado) {
        setActivo(false);
        setShowNotificacion(false);
        setLoading(false);
        return;
      }

      const depositoTS = estado.depositoTimestamp.toDate().getTime();
      const ahora = Date.now();

      if (ahora - depositoTS < CUATRO_HORAS_MS && estado.activo) {
        setActivo(true);
        setShowNotificacion(false);
      } else {
        setActivo(false);
        setShowNotificacion(true);
      }
      setLoading(false);
    }

    checkEstado();
  }, [user]);

  async function handleDeposito() {
    setError(null);
    if (!telefono) {
      setError("Por favor ingresa tu número de teléfono.");
      return;
    }
    if (!user) {
      setError("Usuario no identificado.");
      return;
    }
    try {
      await registrarDeposito(user.uid, telefono);
      setActivo(true);
      setShowNotificacion(false);
    } catch (e) {
      setError("Error registrando depósito, intenta de nuevo.");
    }
  }

  function handleSalir() {
    setActivo(false);
    setShowNotificacion(false);
    // Opcional: cerrar sesión o redirigir a otra página
  }

  if (loading) return <p>Cargando...</p>;

  if (!activo && !showNotificacion) {
    // Mostrar formulario para depósito por primera vez
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-white p-4">
        <h2 className="text-2xl mb-4">Deposita 500 pesos para activar tu acceso</h2>
        <input
          type="tel"
          placeholder="Tu teléfono"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          className="mb-4 p-2 rounded text-black"
        />
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <button
          onClick={handleDeposito}
          className="btn-primary px-6 py-2 rounded"
        >
          Activar acceso
        </button>
      </div>
    );
  }

  if (showNotificacion) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-white p-4">
        <h2 className="text-2xl mb-4">Tu tiempo de acceso ha expirado.</h2>
        <p className="mb-6">Para continuar usando la plataforma, debes hacer un nuevo depósito de 500 pesos.</p>
        <div className="flex gap-4">
          <button
            onClick={handleDeposito}
            className="btn-primary px-6 py-2 rounded"
          >
            Continuar
          </button>
          <button
            onClick={handleSalir}
            className="btn-outline px-6 py-2 rounded"
          >
            Salir
          </button>
        </div>
      </div>
    );
  }

  // Si está activo, mostrar formulario para solicitud de servicios eventuales
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background text-white p-4">
      <h1 className="text-3xl font-bold mb-6">Solicitudes Eventuales</h1>
      <FormularioServicioEventual />
    </main>
  );
}
