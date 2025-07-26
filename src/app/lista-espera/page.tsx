'use client';

import React from 'react';
import FormularioListaEspera from '@/components/services/FormularioListaEspera';

export default function Page() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background text-white p-4">
      <h1 className="text-3xl font-bold mb-6">Publicar Viaje - Lista de Espera</h1>
      <FormularioListaEspera />
    </main>
  );
}
