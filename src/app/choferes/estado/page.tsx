"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  limit,
  DocumentData,
} from "firebase/firestore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import ChoferGuia from "@/components/ChoferGuia"; // 🧢 Avatar importado

type DriverStatus =
  | "pending_approval"
  | "approved"
  | "rejected"
  | "unknown"
  | "no_ci";

type Driver = {
  fullName: string;
  ci: string;
  modality: string;
  status: DriverStatus;
};

export default function EstadoPage() {
  const [loading, setLoading] = useState(true);
  const [driver, setDriver] = useState<Driver | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ci = localStorage.getItem("chofer_ci");
    const modality = localStorage.getItem("chofer_modality");

    if (!ci || !modality) {
      setError("No se encontró información del chofer.");
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "drivers"),
      where("ci", "==", ci),
      where("modality", "==", modality),
      limit(1)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const data = snapshot.docs[0].data() as DocumentData;

          const driverData: Driver = {
            fullName: data.fullName || "Desconocido",
            ci: data.ci,
            modality: data.modality,
            status: (data.status as DriverStatus) || "unknown",
          };
          setDriver(driverData);
          setError(null);
        } else {
          setDriver({
            fullName: "",
            ci,
            modality,
            status: "no_ci",
          });
          setError(null);
        }
        setLoading(false);
      },
      (err) => {
        setError("Error al obtener datos: " + err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  const renderMensajeAvatar = () => {
    switch (driver?.status) {
      case "pending_approval":
      case "unknown":
        return "Mi hermano, ya estás en lista. Solo espera que te aprueben y arrancas con to'.";
      case "approved":
        return "¡Tigre! Estás aprobado. Dale candela, que la calle te espera.";
      case "rejected":
        return "Fuiste rechazado, broo. Escribe al soporte pa’ ver qué pasó y cómo arreglarlo.";
      case "no_ci":
        return "Todavía no te has registrado, mi socio. Tienes que llenar el formulario primero.";
      default:
        return "No tengo claro tu estado ahora mismo. Vuelve a intentarlo en un rato.";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 space-y-6">
      <ChoferGuia mensaje={renderMensajeAvatar()} />

      <Card className="max-w-md w-full text-center">
        <CardHeader>
          <CardTitle>Estado de Inscripción</CardTitle>
        </CardHeader>
        <CardContent>
          {driver ? (
            <>
              {(driver.status === "pending_approval" || driver.status === "unknown") && (
                <CardDescription>
                  Tu solicitud está pendiente de aprobación. Por favor, espera la confirmación del administrador.
                </CardDescription>
              )}

              {driver.status === "approved" && (
                <CardDescription>
                  ¡Felicidades! Tu inscripción ha sido aprobada. Ya puedes comenzar a usar la aplicación.
                </CardDescription>
              )}

              {driver.status === "rejected" && (
                <CardDescription className="text-red-600">
                  Lo sentimos, tu solicitud fue rechazada. Contacta con soporte para más información.
                </CardDescription>
              )}

              {driver.status === "no_ci" && (
                <CardDescription className="text-yellow-600">
                  No se encontró tu solicitud de inscripción. Por favor, realiza el registro primero.
                </CardDescription>
              )}
            </>
          ) : (
            <CardDescription>No se pudo cargar la información del chofer.</CardDescription>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
