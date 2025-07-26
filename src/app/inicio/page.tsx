'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Car, Send, Truck, Globe, MapPinned, ListChecks, ShoppingBag,
  UserPlus, Clock, Edit3, MessageSquare, CreditCard, Briefcase
} from 'lucide-react';
import {
  collection, query, where, getDocs, doc, updateDoc
} from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase';

const clientServices = [
  { label: 'Pedir Taxi', href: '/servicios/taxi-urbano', icon: Car },
  { label: 'Pedir Mensajería', href: '/servicios/mensajeria', icon: Send },
  { label: 'Pedir Carga', href: '/servicios/carga', icon: Truck },
  { label: 'Viajes Interprov.', href: '/servicios/viajes-interprovinciales', icon: Globe },
  { label: 'Excursiones', href: '/servicios/excursiones', icon: MapPinned },
  { label: 'Lista de Espera', href: '/servicios/lista-de-espera', icon: ListChecks },
  { label: 'Tienda', href: '/tienda', icon: ShoppingBag },
  { label: 'Publicar Empleo Chófer', href: '/servicios/publicar-empleo-chofer', icon: UserPlus },
];

const driverServices = [
  { label: 'Inscribirse (Chófer)', href: '/choferes/registro', icon: UserPlus },
  { label: 'Chófer Eventual', href: '/choferes-eventuales', icon: Clock },
  { label: 'Publicar Viaje', href: '/choferes/publicar-viaje', icon: Edit3 },
  { label: 'Publicar Lista Espera', href: '/choferes/publicar-lista-espera', icon: ListChecks },
  { label: 'Ver Solicitudes', href: '/choferes/chat', icon: MessageSquare },
  { label: 'Recargar Saldo', href: '/choferes/recargar-saldo', icon: CreditCard },
  { label: 'Ofertas de Empleo', href: '/choferes/ver-ofertas-empleo', icon: Briefcase },
];

export default function InicioPage() {
  const [clienteStatus, setClienteStatus] = useState<'pendiente' | 'aceptado' | null>(null);
  const [viajeId, setViajeId] = useState<string | null>(null);
  const router = useRouter();

  // 🔄 Comprobación periódica del estado de la solicitud del cliente
  useEffect(() => {
    const interval = setInterval(async () => {
      const tel = localStorage.getItem('clienteTel');
      if (!tel) return;

      const q = query(
        collection(db, 'servicios'),
        where('clienteTel', '==', tel),
        where('estado', 'in', ['pendiente', 'aceptado'])
      );

      const snap = await getDocs(q);
      const servicio = snap.docs[0];

      if (servicio) {
        setClienteStatus(servicio.data().estado);
        setViajeId(servicio.id);
      } else {
        setClienteStatus(null);
        setViajeId(null);
      }
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  // ❌ Cancelar solicitud de servicio
  const cancelarSolicitud = async () => {
    if (!viajeId) return;

    try {
      const ref = doc(db, 'servicios', viajeId);
      await updateDoc(ref, { estado: 'cancelado_por_cliente' });
      setClienteStatus(null);
      setViajeId(null);
      alert('Solicitud cancelada correctamente.');
    } catch (error) {
      console.error('Error cancelando solicitud:', error);
      alert('Hubo un error al cancelar. Intenta nuevamente.');
    }
  };

  return (
    <main className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-background text-white p-6 gap-4">
      {/* Panel Cliente */}
      <section className="bg-blue-950 rounded-lg p-6 shadow space-y-4">
        <h2 className="text-2xl font-bold text-center text-blue-300">Clientes</h2>

        {clienteStatus === 'pendiente' && (
          <div className="bg-yellow-900 text-yellow-300 p-3 rounded text-center space-y-2">
            <p>Tu solicitud está en proceso...</p>
            <button
              onClick={cancelarSolicitud}
              className="bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              Cancelar solicitud
            </button>
          </div>
        )}

        {clienteStatus === 'aceptado' && viajeId && (
          <div className="bg-green-900 text-green-200 p-3 rounded text-center">
            <p>¡Un chófer aceptó tu solicitud!</p>
            <Link
              href={`/cliente/chat/${viajeId}`}
              className="underline text-green-300 mt-2 inline-block"
            >
              Ir al chat con el chófer
            </Link>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 mt-4">
          {clientServices.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2 p-3 bg-blue-800 hover:bg-blue-600 rounded"
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Panel Chófer */}
      <section className="bg-yellow-900 rounded-lg p-6 shadow space-y-4">
        <h2 className="text-2xl font-bold text-center text-yellow-200">Chóferes</h2>
        <div className="grid grid-cols-2 gap-4">
          {driverServices.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2 p-3 bg-yellow-800 hover:bg-yellow-600 rounded"
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
