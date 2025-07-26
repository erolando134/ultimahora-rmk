"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function PagoPublicacion() {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [ci, setCi] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre || !telefono || !ci) {
      toast({
        title: "Campos incompletos",
        description: "Debes completar todos los datos.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await addDoc(collection(db, "solicitudes_pago_tienda"), {
        nombre,
        telefono,
        ci,
        tipo: "publicacion_tienda",
        estado: "pendiente",
        creado: Timestamp.now(),
      });

      toast({
        title: "Solicitud enviada",
        description: "Pronto recibirás los datos para realizar el pago.",
      });

      router.push("/tienda/esperando-confirmacion");
    } catch (error: any) {
      toast({
        title: "Error al enviar",
        description: error.message || "Intenta de nuevo más tarde.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="p-4 max-w-lg mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Solicitar Datos de Pago</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Nombre completo"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
            <Input
              placeholder="Teléfono"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              required
            />
            <Input
              placeholder="Carné de identidad"
              value={ci}
              onChange={(e) => setCi(e.target.value)}
              required
            />
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Solicitar Datos para Pago
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
