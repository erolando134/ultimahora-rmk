"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

type ChoferGuiaProps = {
  mensaje?: string; // Ahora acepta un mensaje opcional
};

export default function ChoferGuia({ mensaje }: ChoferGuiaProps) {
  const pathname = usePathname();
  const [textoMostrado, setTextoMostrado] = useState("");

  // Tabla de mensajes según ruta (solo se usa si no viene mensaje por prop)
  const mensajes: Record<string, string> = {
    "/dashboard": "¡Qué vola, Tigre! 🐅 ¿Qué necesitas hoy en ÚltimaHora?\nEstoy aquí, parqueao al lado del taxi, ¡listo pa' ayudarte, broo!",
    "/reservas/mis-reservas": "Aquí están tus reservas activas, Tigre.\nDale una mirada y si falta algo, me tiras, broo.",
    "/ayuda": "¿Trancao en algo? Yo soy el tigre pa' resolverte eso.\nPregúntame sin pena, broo.",
    "/carga": "¿Pa' dónde va esa carga, Tigre?\nDime la ruta y yo te doy el aventón, broo.",
    "/mensajeria": "¡Vamos a repartir eso, mi hermano!\nMarca el punto de entrega y arrancamos ya.",
    // Puedes seguir agregando más rutas aquí...
  };

  // Si se pasa prop mensaje, lo usamos, sino mensaje según ruta
  const mensajeReal = mensaje ?? mensajes[pathname] ?? "¡Qué vuelta, broo! Aquí estoy por si necesitas algo.";

  // Efecto máquina de escribir
  useEffect(() => {
    let i = 0;
    setTextoMostrado("");
    const interval = setInterval(() => {
      setTextoMostrado((prev) => prev + mensajeReal[i]);
      i++;
      if (i >= mensajeReal.length) clearInterval(interval);
    }, 40);
    return () => clearInterval(interval);
  }, [mensajeReal]);

  return (
    <div className="flex items-end gap-4 p-4 animate-fade-in">
      {/* Imagen del chofer */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Image
          src="/images/tigre-solo.png"
          alt="Chofer guía"
          width={120}
          height={120}
          priority
        />
      </motion.div>

      {/* Burbuja de mensaje */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="bg-yellow-100 text-yellow-900 px-4 py-3 rounded-xl shadow-lg max-w-xs border border-yellow-400"
      >
        <p className="text-sm leading-snug whitespace-pre-line">{textoMostrado}</p>
      </motion.div>
    </div>
  );
}
