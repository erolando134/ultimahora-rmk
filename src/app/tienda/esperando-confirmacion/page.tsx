"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const imagenesEjemplo = [
  "/ejemplo1.jpg",
  "/ejemplo2.jpg",
  "/ejemplo3.jpg",
  "/ejemplo4.jpg",
];

export default function EsperandoConfirmacion() {
  const [indice, setIndice] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndice((prev) => (prev + 1) % imagenesEjemplo.length);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="p-4 max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-center text-primary">Gracias por tu solicitud</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-muted-foreground text-sm text-center">
            Tu solicitud fue recibida correctamente. Pronto recibirás los datos para efectuar el pago correspondiente a tu publicación.
            Después del pago, podrás subir hasta 4 imágenes y tu reseña. Tu publicación será visible por 7 días en la plataforma.
          </p>

          <div className="relative w-full aspect-video rounded-md overflow-hidden shadow-md">
            <Image
              key={indice}
              src={imagenesEjemplo[indice]}
              alt={`Ejemplo ${indice + 1}`}
              fill
              style={{ objectFit: "cover", transition: "opacity 1s ease-in-out" }}
            />
          </div>

          <p className="text-center mt-4 text-sm italic text-muted-foreground">
            Ejemplos de artículos que podrías publicar.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
