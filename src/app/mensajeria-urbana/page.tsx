'use client';

export const dynamic = 'force-static';

import React from 'react';
import FormularioMensajeriaUrbana from '@/components/services/FormularioMensajeriaUrbana';

export default function Page() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background text-white p-4">
      <h1 className="text-3xl font-bold mb-6">Servicio de Mensajería Urbana</h1>
      <FormularioMensajeriaUrbana />
    </main>
  );
}

