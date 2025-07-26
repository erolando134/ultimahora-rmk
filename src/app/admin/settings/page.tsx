"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function AdminSettingsPage() {
  const { user, isAdmin, loading } = useAuth();
  const { toast } = useToast();

  const [tarjeta, setTarjeta] = useState("");
  const [telefono, setTelefono] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      const ref = doc(db, "configuraciones", "datos_pago");
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        setTarjeta(data.tarjeta || "");
        setTelefono(data.telefono || "");
      }
      setIsLoading(false);
    };

    if (isAdmin && !loading) {
      cargarDatos();
    }
  }, [isAdmin, loading]);

  const guardarDatos = async () => {
    if (!tarjeta || !telefono) {
      toast({ title: "Campos obligatorios", description: "Debes completar ambos campos." });
      return;
    }

    setIsSaving(true);
    const ref = doc(db, "configuraciones", "datos_pago");

    try {
      await setDoc(ref, {
        tarjeta,
        telefono,
        activo: true,
        actualizadoPor: user?.uid || "desconocido",
        ultimaActualizacion: new Date().toISOString(),
      });

      toast({ title: "Datos guardados", description: "Se actualizaron correctamente los datos de pago." });
    } catch (error) {
      toast({ title: "Error", description: "No se pudieron guardar los datos. Intenta de nuevo." });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading || !isAdmin || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-8rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Configuración de Datos de Pago</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            value={tarjeta}
            onChange={(e) => setTarjeta(e.target.value)}
            placeholder="Número de tarjeta"
            maxLength={20}
          />
          <Input
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            placeholder="Número de teléfono"
            maxLength={20}
          />
          <Button onClick={guardarDatos} disabled={isSaving}>
            {isSaving ? "Guardando..." : "Guardar Datos de Pago"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
