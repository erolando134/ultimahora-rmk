"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function InstruccionesTienda() {
  const router = useRouter();

  return (
    <main className="p-6 max-w-3xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Publica con ÚltimaHora RMK
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-justify">
          <p>1. Pulsa el botón <strong>Solicitar datos para efectuar pago</strong>. Abonarás 300 pesos. Tu publicación estará activa por 7 días. Si deseas renovar, vuelve a hacer el pago.</p>
          <p>2. Luego de recibir la confirmación, podrás subir hasta 4 fotos y una reseña del producto (precio, ubicación, detalles, etc.).</p>
          <p>3. Pulsa <strong>Subir publicación</strong> y espera que se procese.</p>
          <p>4. Revisa tu publicación en la sección <strong>Artículos publicados</strong>.</p>
          <p>5. Si vendes el producto, marca la publicación como <strong>Vendido</strong> para que sea eliminada.</p>
          <p>6. ÚltimaHora RMK agradece tu confianza.</p>

          <div className="text-center mt-6">
            <Button onClick={() => router.push("/tienda/pago")}>
              Solicitar datos para efectuar pago
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
