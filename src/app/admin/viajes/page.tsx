"use client";

import { db } from "@/lib/firebase/firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Car, Clock, DollarSign, User } from "lucide-react";

interface Trip {
  id: string;
  clientName: string;
  driverName?: string;
  serviceType: string;
  tripPrice: number;
  status: "pending" | "active" | "completed" | "cancelled";
  createdAt: any;
}

export default function AdminViajesPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "chats"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tripsData: Trip[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as Trip));
      setTrips(tripsData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const getStatusBadge = (status: Trip['status']) => {
    switch (status) {
      case 'completed': return <Badge className="bg-green-500">Completado</Badge>;
      case 'active': return <Badge className="bg-blue-500">Activo</Badge>;
      case 'pending': return <Badge variant="secondary">Pendiente</Badge>;
      case 'cancelled': return <Badge variant="destructive">Cancelado</Badge>;
      default: return <Badge>Desconocido</Badge>;
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Monitor de Viajes en Tiempo Real</CardTitle>
          <CardDescription>Visualiza todos los viajes que están ocurriendo o han sido solicitados.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead><User className="h-4 w-4 inline-block mr-1" />Cliente</TableHead>
                <TableHead><Car className="h-4 w-4 inline-block mr-1" />Servicio</TableHead>
                <TableHead><DollarSign className="h-4 w-4 inline-block mr-1" />Precio</TableHead>
                <TableHead><Clock className="h-4 w-4 inline-block mr-1" />Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={4} className="text-center">Cargando viajes...</TableCell></TableRow>
              ) : trips.length === 0 ? (
                <TableRow><TableCell colSpan={4} className="text-center">No hay viajes registrados.</TableCell></TableRow>
              ) : (
                trips.map(trip => (
                  <TableRow key={trip.id}>
                    <TableCell>{trip.clientName}</TableCell>
                    <TableCell>{trip.serviceType}</TableCell>
                    <TableCell>{trip.tripPrice} Bs.</TableCell>
                    <TableCell>{getStatusBadge(trip.status)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
