'use client';

import React from 'react';
import FormularioViajesInterprovinciales from '@/components/services/FormularioViajesInterprovinciales';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

export default function Page() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background text-white p-4">
      <div className="flex flex-col items-center space-y-4 mb-6">
        <Avatar className="w-16 h-16">
          <AvatarImage src="/chofer-avatar.png" alt="Chofer" />
          <AvatarFallback>CH</AvatarFallback>
        </Avatar>
        <h1 className="text-3xl font-bold text-center">Publicar Inscripción FormularioViajesInterprovinciales </h1>
      </div>

      <FormularioViajesInterprovinciales />
    </main>
  );
}
