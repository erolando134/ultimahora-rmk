'use client';

export const dynamic = "force-dynamic";

import React from 'react';
import FormularioCarga from '@/components/services/FormularioCarga';

export default function Page() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background text-white p-4">
      <h1 className="text-3xl font-bold mb-6">Servicio de Carga</h1>
      <FormularioCarga />
    </main>
  );
}
