'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Home, Users } from 'lucide-react';

export default function InicioPage() {
  return (
    <main className="min-h-screen flex">
      {/* Columna izquierda */}
      <aside className="w-1/3 bg-blue-900 text-white p-6 flex flex-col items-start space-y-6 relative">
        {/* Logo giratorio */}
        <div className="w-20 h-20 rounded-full border-4 border-white overflow-hidden animate-spin-slow self-start">
          <Image
            src="/logo.png"
            alt="Logo giratorio"
            width={80}
            height={80}
            className="object-cover"
          />
        </div>

        {/* Título */}
        <h1 className="text-2xl font-bold">UltimaHora RMK</h1>

        {/* Panel principal */}
        <div className="space-y-1">
          <h2 className="flex items-center gap-2 font-semibold text-white">
            <Home className="w-5 h-5" /> Panel Principal
          </h2>
        </div>

        {/* Clientes */}
        <div>
          <h2 className="flex items-center gap-2 mt-4 font-semibold text-white">
            <Users className="w-5 h-5" /> Clientes
          </h2>
          <ul className="list-disc ml-6 mt-2 space-y-1 text-sm">
            <li>Pedir Taxi</li>
            <li>Pedir Mensajería</li>
            <li>Pedir Carga</li>
            <li>Viajes Interprovinciales</li>
            <li>Excursiones</li>
            <li>Lista de Espera</li>
            <li>Tienda</li>
            <li>Publicar Empleo Chófer</li>
          </ul>
        </div>

        {/* Conductores */}
        <div>
          <h2 className="flex items-center gap-2 mt-4 font-semibold text-white">
            <Users className="w-5 h-5" /> Conductores
          </h2>
          <ul className="list-disc ml-6 mt-2 space-y-1 text-sm">
            <li>Inscribirse (Chófer)</li>
            <li>Chófer Eventual</li>
            <li>Publicar Viaje</li>
            <li>Publicar Lista de Espera</li>
            <li>Ver Solicitudes</li>
            <li>Recargar Saldo</li>
            <li>Ofertas de Empleo</li>
          </ul>
        </div>
      </aside>

      {/* Columna derecha */}
      <section className="flex-1 relative flex flex-col justify-center items-center text-center p-10">
        {/* Marca de agua */}
        <Image
          src="/logo.png"
          alt="Marca de agua"
          fill
          className="absolute inset-0 object-contain opacity-5 z-0"
        />

        <div className="relative z-10">
          <h2 className="text-4xl font-bold text-blue-900 mb-4">BIENVENIDO</h2>
          <h3 className="text-2xl font-semibold text-blue-800 mb-4">UltimaHora RMK</h3>
          <p className="text-lg max-w-lg mx-auto text-blue-800 mb-6">
            App de transporte más completa en Cuba.
            <br />
            Encuentra todo lo que necesitas para moverte o mover tu mercancía.
            <br />
            <strong>No somos un grupo de WhatsApp, somos una plataforma hecha y en uso.</strong>
          </p>
          <Link
            href="/inicio" // Puedes redirigir aquí a la página que debe seguir
            className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded text-lg"
          >
            COMENZAR
          </Link>
        </div>
      </section>
    </main>
  );
}
