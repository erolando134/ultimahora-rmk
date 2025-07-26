"use client";

import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  updateDoc,
  doc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

interface Solicitud {
  id: string;
  nombre: string;
  telefono: string;
  tipo: string;
  mensaje: string;
  estado: string;
  userId: string;
  datosPago?: {
    tarjeta?: string;
    telefonoConfirmacion?: string;
  };
}

interface MensajePago {
  mensaje: string;
  timestamp: any;
  userId: string;
}

export default function PanelAdminRecargas() {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [mensajes, setMensajes] = useState<Record<string, MensajePago | null>>({});
  const [datosPagoInputs, setDatosPagoInputs] = useState<Record<string, { tarjeta: string; telefonoConfirmacion: string; }>>({});

  // Escuchar solicitudes pendientes o no confirmadas
  useEffect(() => {
    const q = query(
      collection(db, "solicitar-datos"), // ← corregido aquí
      where("estado", "!=", "confirmado")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: Solicitud[] = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Solicitud)
      );
      setSolicitudes(data);

      const nuevosInputs: typeof datosPagoInputs = {};
      data.forEach((sol) => {
        nuevosInputs[sol.id] = {
          tarjeta: sol.datosPago?.tarjeta || "",
          telefonoConfirmacion: sol.datosPago?.telefonoConfirmacion || "",
        };
      });
      setDatosPagoInputs(nuevosInputs);
    });

    return () => unsubscribe();
  }, []);

  // Obtener mensajes de pago enviados por choferes
  useEffect(() => {
    const fetchMensajes = async () => {
      const nuevosMensajes: Record<string, MensajePago | null> = {};
      for (const solicitud of solicitudes) {
        const pagosSnap = await getDocs(
          query(
            collection(db, "pagos_confirmados"),
            where("userId", "==", solicitud.userId)
          )
        );
        if (!pagosSnap.empty) {
          const msgDoc = pagosSnap.docs[pagosSnap.docs.length - 1];
          nuevosMensajes[solicitud.userId] = {
            ...(msgDoc.data() as MensajePago),
            userId: solicitud.userId,
          };
        } else {
          nuevosMensajes[solicitud.userId] = null;
        }
      }
      setMensajes(nuevosMensajes);
    };

    if (solicitudes.length > 0) fetchMensajes();
  }, [solicitudes]);

  const enviarDatosPago = async (solicitudId: string) => {
    try {
      const { tarjeta, telefonoConfirmacion } = datosPagoInputs[solicitudId];
      if (!tarjeta.trim() || !telefonoConfirmacion.trim()) {
        toast({
          title: "Campos incompletos",
          description: "Debes ingresar tarjeta y teléfono de confirmación.",
          variant: "destructive",
        });
        return;
      }

      const solicitudRef = doc(db, "solicitar-datos", solicitudId); // ← corregido aquí
      await updateDoc(solicitudRef, {
        datosPago: { tarjeta, telefonoConfirmacion },
      });

      toast({
        title: "Datos enviados",
        description: "Los datos de pago fueron enviados al chofer.",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "No se pudo enviar los datos de pago.",
        variant: "destructive",
      });
    }
  };

  const confirmarPago = async (solicitudId: string) => {
    try {
      const solicitudRef = doc(db, "solicitar-datos", solicitudId); // ← corregido aquí
      await updateDoc(solicitudRef, { estado: "confirmado" });
      toast({
        title: "Pago confirmado",
        description: "El chófer podrá seguir trabajando.",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "No se pudo confirmar el pago.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Panel de Solicitudes y Recargas
      </h1>

      {solicitudes.length === 0 ? (
        <p className="text-center text-muted-foreground">
          No hay solicitudes pendientes.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {solicitudes.map((s) => (
            <Card key={s.id}>
              <CardHeader>
                <CardTitle>
                  {s.nombre} ({s.tipo})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p><b>Teléfono:</b> {s.telefono}</p>
                <p><b>Mensaje:</b> {s.mensaje || "Sin mensaje"}</p>
                <p><b>Estado actual:</b> {s.estado}</p>

                {mensajes[s.userId] ? (
                  <div className="p-2 bg-accent/10 border rounded">
                    <p className="text-sm text-muted-foreground">
                      <b>Mensaje de pago:</b> {mensajes[s.userId]?.mensaje}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm italic text-muted-foreground">
                    Aún no hay mensaje de pago
                  </p>
                )}

                <div className="space-y-2 mt-4">
                  <Label htmlFor={`tarjeta-${s.id}`} className="font-medium">
                    Número de tarjeta para el pago
                  </Label>
                  <Input
                    id={`tarjeta-${s.id}`}
                    type="text"
                    value={datosPagoInputs[s.id]?.tarjeta || ""}
                    onChange={(e) =>
                      setDatosPagoInputs((prev) => ({
                        ...prev,
                        [s.id]: {
                          ...prev[s.id],
                          tarjeta: e.target.value,
                        },
                      }))
                    }
                    placeholder="Ej: 1234-5678-9012-3456"
                  />

                  <Label
                    htmlFor={`telefono-confirmacion-${s.id}`}
                    className="font-medium"
                  >
                    Teléfono de confirmación
                  </Label>
                  <Input
                    id={`telefono-confirmacion-${s.id}`}
                    type="text"
                    value={datosPagoInputs[s.id]?.telefonoConfirmacion || ""}
                    onChange={(e) =>
                      setDatosPagoInputs((prev) => ({
                        ...prev,
                        [s.id]: {
                          ...prev[s.id],
                          telefonoConfirmacion: e.target.value,
                        },
                      }))
                    }
                    placeholder="Ej: +53 5XX XXX XXX"
                  />

                  <Button
                    onClick={() => enviarDatosPago(s.id)}
                    className="w-full"
                    disabled={
                      !datosPagoInputs[s.id]?.tarjeta ||
                      !datosPagoInputs[s.id]?.telefonoConfirmacion
                    }
                  >
                    Enviar datos de pago al chofer
                  </Button>
                </div>

                <Button
                  onClick={() => confirmarPago(s.id)}
                  className="w-full mt-4"
                  disabled={s.estado === "confirmado"}
                >
                  Confirmar Pago
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
