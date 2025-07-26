'use client';

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { doc, getDoc, collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function ReservaPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { tripId } = useParams() as { tripId: string };

  const [trip, setTrip] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [nombre, setNombre] = useState("");
  const [asientos, setAsientos] = useState(1);
  const [telefono, setTelefono] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchTrip() {
      try {
        const docRef = doc(db, "viajes_interprovinciales", tripId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setTrip({ id: docSnap.id, ...docSnap.data() });
        } else {
          toast({ title: "Viaje no encontrado", description: "Este viaje ya no está disponible", variant: "destructive" });
          router.push("/viajes-interprovinciales");
        }
      } catch (error) {
        console.error("Error al cargar viaje:", error);
        toast({ title: "Error", description: "No se pudo cargar el viaje.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    }
    fetchTrip();
  }, [tripId, router, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre || !telefono || asientos < 1) {
      toast({ title: "Campos incompletos", description: "Completa todos los campos correctamente.", variant: "destructive" });
      return;
    }

    setSubmitting(true);

    try {
      await addDoc(collection(db, "reservas_interprovinciales"), {
        viajeId: trip.id,
        choferId: trip?.choferId || null,
        nombre,
        telefono,
        asientos,
        estado: "pendiente",
        fechaReserva: Timestamp.now(),
      });

      toast({ title: "Reserva enviada", description: "Tu solicitud fue enviada al chofer." });
      router.push("/viajes-interprovinciales");
    } catch (error) {
      console.error("Error al reservar:", error);
      toast({ title: "Error", description: "No se pudo enviar la reserva.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center p-4">Cargando detalles del viaje...</div>;

  return (
    <div className="container mx-auto py-10 px-4 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Reserva de Asientos</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            {trip.pickup} → {trip.dropoff} <br />
            Salida: {trip.departureTime} | Llegada estimada: {trip.arrivalTime}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="nombre">Nombre completo</Label>
              <Input
                id="nombre"
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="asientos">Cantidad de asientos</Label>
              <Input
                id="asientos"
                type="number"
                min={1}
                max={trip?.passengerCount || 10}
                required
                value={asientos}
                onChange={(e) => setAsientos(parseInt(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="telefono">Teléfono de contacto</Label>
              <Input
                id="telefono"
                type="tel"
                required
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? "Enviando..." : "Reservar Asiento(s)"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
