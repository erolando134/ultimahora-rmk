'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";
import Image from "next/image";
import Link from "next/link";

export default function TiendaPage() {
  const { toast } = useToast();
  const [sending, setSending] = useState(false);

  const handleSolicitarDatos = async () => {
    setSending(true);
    try {
      await addDoc(collection(db, "notificaciones"), {
        uid: "admin", // se puede usar el ID del administrador si se quiere dirigir la notificación
        title: "Solicitud de datos de pago para publicación",
        message: "El cliente ha solicitado los datos para publicar en la tienda.",
        timestamp: serverTimestamp(),
        read: false,
      });

      toast({
        title: "Solicitud enviada",
        description: "Te contactaremos pronto con los datos de pago.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo enviar la solicitud.",
        variant: "destructive",
      });
    }
    setSending(false);
  };

  return (
    <main className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-center text-primary">Tienda</h1>

      <section className="bg-blue-100 p-4 rounded-md space-y-3 text-blue-900">
        <h2 className="text-xl font-semibold text-center">Publica con ÚltimaHora RMK, tu mejor opción</h2>
        <ol className="list-decimal space-y-2 pl-5">
          <li>Haz clic en el botón que dice <strong>Solicitar datos para efectuar pago</strong>. Debes abonar 300 pesos por publicación. Esta será visible por 7 días.</li>
          <li>Para renovar, repite el proceso antes o después del vencimiento.</li>
          <li>Después de pagar, ve a los botones de abajo para subir hasta 4 fotos y una descripción del artículo.</li>
          <li>Haz clic en el botón <strong>Subir publicación</strong> y espera sin salir de la plataforma.</li>
          <li>Revisa tus publicaciones en <Link href="/articulos/tienda" className="underline">Artículos Publicados</Link>.</li>
          <li>Si vendes el producto, vuelve aquí y marca como <strong>Vendido</strong> para que se elimine.</li>
        </ol>
        <p className="mt-4 text-center italic">ÚltimaHora RMK agradece tu confianza. ¡Gracias por usar nuestra plataforma!</p>
      </section>

      <div className="flex justify-center">
        <Button onClick={handleSolicitarDatos} disabled={sending}>
          {sending ? "Enviando..." : "Solicitar datos para efectuar pago"}
        </Button>
      </div>

      <div className="mt-10">
        <h2 className="text-lg font-semibold mb-3 text-center">Ejemplos de publicaciones</h2>
        <div className="flex gap-4 overflow-x-auto p-2 animate-pulse">
          {[1, 2, 3, 4].map((num) => (
            <div key={num} className="min-w-[200px] h-[140px] bg-gray-300 rounded overflow-hidden relative">
              <Image
                src={`https://placehold.co/300x200?text=Ejemplo+${num}`}
                alt={`Ejemplo ${num}`}
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center mt-6">
        <Link href="/tienda/publicar">
          <Button variant="outline">Subir nueva publicación</Button>
        </Link>
      </div>
    </main>
  );
}


