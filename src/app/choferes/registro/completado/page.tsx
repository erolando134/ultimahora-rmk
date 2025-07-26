// src/app/registro/completado/page.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function RegistroCompletadoPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <Card className="max-w-md w-full text-center">
        <CardHeader>
          <CardTitle className="text-xl">¡Solicitud enviada!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Gracias por inscribirte. Tu solicitud ha sido recibida y está en proceso de revisión.</p>
          <p>Una vez aprobada, podrás comenzar a usar la aplicación y acceder a los servicios disponibles.</p>
          <Link href="/">
            <Button>Volver al inicio</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
