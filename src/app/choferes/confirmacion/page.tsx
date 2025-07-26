"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ChoferGuia from "@/components/ChoferGuia"; // 🧢 Avatar importado

function ConfirmacionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [ci, setCi] = useState("");
  const [modalidad, setModalidad] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const ciParam = searchParams.get("ci");
    const modParam = searchParams.get("mod");
    if (ciParam) setCi(ciParam);
    if (modParam) setModalidad(modParam);
  }, [searchParams]);

  const verificarAcceso = async () => {
    if (!ci || !modalidad) {
      toast({
        title: "Datos requeridos",
        description: "Ingresa tu número de CI y selecciona tu modalidad.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const ref = doc(db, "drivers", `${ci}_${modalidad}`);
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        toast({
          title: "No encontrado",
          description: "No encontramos tu inscripción con esos datos.",
          variant: "destructive",
        });
        return;
      }

      const data = snap.data();
      if (data.status !== "active") {
        toast({
          title: "No habilitado",
          description: "Aún no estás habilitado para trabajar.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "¡Bienvenido!",
        description: `Accediendo a la modalidad: ${modalidad}`,
      });

      router.push(`/chofer/servicios?mod=${modalidad}&ci=${ci}`);
    } catch (err) {
      toast({
        title: "Error",
        description: "Ocurrió un error al verificar. Intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-10">
      <ChoferGuia mensaje="Broo, no inventes, pon bien tu CI y la modalidad pa’ que puedas entrar como es. ¡Yo te cuido el timón!" />

      <Card>
        <CardHeader>
          <CardTitle>Verificación de Acceso</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            value={ci}
            onChange={(e) => setCi(e.target.value)}
            placeholder="Número de CI"
          />
          <Input
            value={modalidad}
            onChange={(e) => setModalidad(e.target.value)}
            placeholder="Modalidad (ej: taxi, carga, etc.)"
          />
          <Button onClick={verificarAcceso} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2 h-4 w-4" /> Verificando...
              </>
            ) : (
              "Entrar a plataforma"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ConfirmacionChoferPage() {
  return (
    <Suspense fallback={<div className="text-center py-10">Cargando...</div>}>
      <ConfirmacionContent />
    </Suspense>
  );
}
