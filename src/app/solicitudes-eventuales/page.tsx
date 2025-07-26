'use client';

import React, { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase/firebase';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function SolicitudesEventualesPage() {
  const [loading, setLoading] = useState(true);
  const [activo, setActivo] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function verificarChoferEventual() {
      if (!auth.currentUser) {
        setActivo(false);
        setLoading(false);
        return;
      }

      const uid = auth.currentUser.uid;
      const q = query(collection(db, 'choferes-eventuales'), where('uid', '==', uid));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const data = snapshot.docs[0].data();
        const ahora = Timestamp.now().toMillis();
        const deposito = data.depositoTimestamp.toMillis();
        const dentroDeTiempo = ahora - deposito < 4 * 60 * 60 * 1000; // 4 horas

        setActivo(dentroDeTiempo);
      }

      setLoading(false);
    }

    verificarChoferEventual();
  }, []);

  const handleContinuar = () => {
    router.push('/servicios/solicitud-servicio');
  };

  const handleSalir = () => {
    router.push('/');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin w-8 h-8 text-primary" />
      </div>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background text-white p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Acceso a Solicitudes Eventuales</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          {activo ? (
            <>
              <p>Tu tiempo de acceso sigue activo.</p>
              <Button onClick={handleContinuar} className="w-full">Continuar</Button>
            </>
          ) : (
            <>
              <p>Tu acceso ha vencido. Debes volver a pagar para continuar.</p>
              <div className="flex gap-4 justify-center">
                <Button onClick={handleContinuar}>Pagar y Continuar</Button>
                <Button variant="outline" onClick={handleSalir}>Salir</Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
