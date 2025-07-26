"use client"

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Map, Phone, User, CheckCircle, Home, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";


const ACTIVE_TRIP_ID = "chat1"; 

export default function ViajeActivoPage() {
  const { user } = useAuth();
  const [trip, setTrip] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();


  useEffect(() => {
    if (user) {
      const tripRef = doc(db, "chats", ACTIVE_TRIP_ID);
      const unsubscribe = onSnapshot(tripRef, (doc) => {
        if (doc.exists()) {
          setTrip({ id: doc.id, ...doc.data() });
        } else {
          setTrip(null);
        }
        setLoading(false);
      });
      return () => unsubscribe();
    }
  }, [user]);

  if (loading) {
    return <div className="p-6">Cargando viaje activo...</div>;
  }
  
  if (!trip) {
    return (
        <div className="p-6">
            <Card>
                <CardHeader>
                    <CardTitle>No hay viaje activo</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Actualmente no tienes ningún viaje en curso.</p>
                     <Link href="/choferes/notificaciones">
                        <Button className="mt-4">Ver solicitudes</Button>
                    </Link>
                </CardContent>
            </Card>
        </div>
    )
  }

  return (
    <div className="p-4 md:p-6 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Viaje en Curso</CardTitle>
          <CardDescription>Detalles del servicio que estás realizando.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           <div>
              <h3 className="font-semibold flex items-center"><User className="mr-2 h-4 w-4"/>Cliente</h3>
              <p>{trip.clientName}</p>
           </div>
           <div>
              <h3 className="font-semibold flex items-center"><Phone className="mr-2 h-4 w-4"/>Contacto</h3>
              <p>{trip.contactPhone}</p>
           </div>
           <div>
              <h3 className="font-semibold flex items-center"><Map className="mr-2 h-4 w-4"/>Recogida</h3>
              <p>{trip.pickupPoint}</p>
           </div>
           <Button size="lg" className="w-full">Ver en Mapa (Próximamente)</Button>
        </CardContent>
      </Card>
       <Card>
          <CardHeader>
            <CardTitle>Acciones</CardTitle>
          </CardHeader>
          <CardContent>
              <Button size="lg" className="w-full bg-green-600 hover:bg-green-700">
                <CheckCircle className="mr-2 h-5 w-5"/> Marcar como Completado
              </Button>
          </CardContent>
      </Card>
       <div className="mt-12 flex flex-col sm:flex-row justify-center items-center gap-4 border-t pt-8 pb-4">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Ir Atrás
        </Button>
        <Link href="/" passHref>
          <Button variant="outline">
            <Home className="mr-2 h-4 w-4" />
            Volver al Inicio
          </Button>
        </Link>
      </div>
    </div>
  );
}
