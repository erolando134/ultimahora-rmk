'use client';

import React from 'react';
import FormularioExcursiones from '@/components/services/FormularioExcursiones';

export default function ExcursionesProgramadasPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background text-white p-4">
      <h1 className="text-3xl font-bold mb-6">Excursiones Programadas</h1>
      <FormularioExcursiones />
    </main>
  );
}
