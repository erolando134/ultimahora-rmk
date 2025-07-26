'use client';

import React from 'react';
import Link from 'next/link';

export default function ServiciosPage() {
  return (
    <main className="min-h-screen p-8 bg-background text-white">
      <h1 className="text-4xl font-bold mb-8 text-center">Servicios para Clientes</h1>

      <nav className="flex flex-col gap-4 max-w-md mx-auto">
        <Link href="/solicitud-de-taxi">
          <button className="bg-blue-600 hover:bg-blue-700 transition rounded py-3 text-white font-semibold">
            Solicitud de Taxis Urbanos
          </button>
        </Link>

        <Link href="/mensajeria-urbana">
          <button className="bg-blue-600 hover:bg-blue-700 transition rounded py-3 text-white font-semibold">
            Servicio de Mensajería Urbana
          </button>
        </Link>

        <Link href="/servicio-carga">
          <button className="bg-blue-600 hover:bg-blue-700 transition rounded py-3 text-white font-semibold">
            Servicio de Carga
          </button>
        </Link>

        <Link href="/viajes-interprovinciales">
          <button className="bg-blue-600 hover:bg-blue-700 transition rounded py-3 text-white font-semibold">
            Ver y Reservar Viajes Interprovinciales
          </button>
        </Link>

        <Link href="/excursiones-programadas">
          <button className="bg-blue-600 hover:bg-blue-700 transition rounded py-3 text-white font-semibold">
            Ver y Reservar Excursiones Programadas
          </button>
        </Link>

        <Link href="/lista-espera">
          <button className="bg-blue-600 hover:bg-blue-700 transition rounded py-3 text-white font-semibold">
            Consultar Lista de Espera
          </button>
        </Link>

        <Link href="/tienda">
          <button className="bg-blue-600 hover:bg-blue-700 transition rounded py-3 text-white font-semibold">
            Acceder a la Tienda
          </button>
        </Link>

        <Link href="/ofertas-empleo">
          <button className="bg-blue-600 hover:bg-blue-700 transition rounded py-3 text-white font-semibold">
            Publicar Ofertas de Empleo para Choferes
          </button>
        </Link>
      </nav>
    </main>
  );
}
