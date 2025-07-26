"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

// ✅ Importamos el componente del chofer animado
import AgenteUltimaHora from "@/components/AgenteUltimaHora";

export default function LandingPage() {
  const router = useRouter();
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("📍 Ubicación obtenida:", position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error("❌ Error al obtener la ubicación:", error.message);
        }
      );
    }

    const timer = setTimeout(() => setIsFading(true), 4000);
    const redirectTimer = setTimeout(() => router.push('/dashboard'), 5000);

    return () => {
      clearTimeout(timer);
      clearTimeout(redirectTimer);
    };
  }, [router]);

  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-4 md:p-8 min-h-screen transition-opacity duration-1000 ${isFading ? 'opacity-0' : 'opacity-100'}`}
    >
      {/* ✅ Aquí aparece el avatar del chofer con animación */}
      <AgenteUltimaHora />

      <div className="mb-8">
        <Image
          src="/logo.png"
          alt="Logo UltimaHora RMK"
          width={150}
          height={150}
          className="rounded-full mx-auto shadow-2xl animate-spin-y"
          unoptimized
        />
      </div>

      <div className="mb-6 text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-primary drop-shadow-lg">
          UltimaHora RMK
        </h1>
        <p className="text-lg md:text-xl text-foreground/80 mt-6 max-w-3xl mx-auto leading-relaxed">
          Tu solución integral de transporte en Cuba. Conectamos pasajeros con conductores para ofrecerte taxis urbanos ágiles, cómodas reservas para viajes interprovinciales, emocionantes excursiones, transporte de carga seguro, y un eficiente servicio de mensajería. ¡Todo lo que necesitas para moverte o enviar, al alcance de tu mano! Adicionalmente, explora nuestra tienda para vehículos, piezas y partes, y oportunidades de empleo para chóferes.
        </p>
      </div>

      <footer className="absolute bottom-4 text-center w-full text-foreground/50 text-sm">
        <p>&copy; {new Date().getFullYear()} UltimaHora RMK. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
