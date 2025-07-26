"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase/firebase";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import dynamic from "next/dynamic";

const MapaPublicar = dynamic(() => import("./MapaPublicar"), { ssr: false });

export default function PublicarViajePage() {
  const [origen, setOrigen] = useState("");
  const [destino, setDestino] = useState("");
  const [fecha, setFecha] = useState("");
  const [horaSalida, setHoraSalida] = useState("");
  const [horaLlegada, setHoraLlegada] = useState("");
  const [asientos, setAsientos] = useState("");
  const [precio, setPrecio] = useState("");
  const [telefono, setTelefono] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [coords, setCoords] = useState<[number, number] | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!auth.currentUser) {
      toast({ title: "Error", description: "Debes iniciar sesión como chófer para publicar un viaje.", variant: "destructive" });
      return;
    }

    if (!origen || !destino || !fecha || !horaSalida || !horaLlegada || !asientos || !precio || !telefono || !coords) {
      toast({ title: "Campos incompletos", description: "Por favor llena todos los campos requeridos.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      const viajeRef = collection(db, "viajes-interprovinciales");
      await addDoc(viajeRef, {
        uid: auth.currentUser.uid,
        origen,
        destino,
        fecha,
        horaSalida,
        horaLlegada,
        asientos: parseInt(asientos),
        precio: parseFloat(precio),
        telefono,
        descripcion,
        ubicacion: {
          lat: coords[0],
          lng: coords[1],
        },
        creadoEn: Timestamp.now(),
        estado: "activo",
      });

      toast({ title: "Viaje publicado", description: "Tu viaje fue publicado exitosamente." });
      router.push("/choferes");
    } catch (error) {
      console.error("Error publicando viaje:", error);
      toast({ title: "Error", description: "Hubo un problema al publicar el viaje.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Publicar Viaje Interprovincial</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input value={origen} onChange={(e) => setOrigen(e.target.value)} placeholder="Lugar de salida" required />
          <Input value={destino} onChange={(e) => setDestino(e.target.value)} placeholder="Lugar de destino" required />
          <Input value={fecha} onChange={(e) => setFecha(e.target.value)} type="date" required />
          <Input value={horaSalida} onChange={(e) => setHoraSalida(e.target.value)} placeholder="Hora de salida (ej: 08:00 AM)" required />
          <Input value={horaLlegada} onChange={(e) => setHoraLlegada(e.target.value)} placeholder="Hora estimada de llegada (ej: 02:00 PM)" required />
          <Input value={asientos} onChange={(e) => setAsientos(e.target.value)} type="number" placeholder="Cantidad de asientos disponibles" required />
          <Input value={precio} onChange={(e) => setPrecio(e.target.value)} type="number" placeholder="Precio por asiento" required />
          <Input value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="Teléfono de contacto" required />
          <Textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder="Descripción adicional (opcional)" />

          <div className="h-72 w-full rounded-md overflow-hidden border">
            <MapaPublicar setCoords={setCoords} />
          </div>

          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Publicando..." : "Publicar Viaje"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
