"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ListChecks, MapPin, Navigation, Phone, DollarSign, Users, Car, Home, ArrowLeft } from "lucide-react";
import React from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation';

const mockImmediateTrips = [
  {
    id: "le1",
    currentLocation: "Plaza España, Zona Central",
    destination: "Aeropuerto Internacional El Alto",
    driverPhone: "+591 77711223",
    price: "80 Bs.",
    vehicleCapacity: 4,
    availableSeats: 2,
    vehicleType: "Auto Normal",
    driverName: "Miguel Angel"
  },
  {
    id: "le2",
    currentLocation: "Av. Arce esq. Pinilla",
    destination: "Terminal de Buses La Paz",
    driverPhone: "+591 77744556",
    price: "30 Bs.",
    vehicleCapacity: 3,
    availableSeats: 1,
    vehicleType: "Taxi Confortable",
    driverName: "Lucia Fernandez"
  },
  {
    id: "le3",
    currentLocation: "Supermercado Sur, Calacoto",
    destination: "Universidad Mayor de San Andrés (UMSA)",
    driverPhone: "+591 77788990",
    price: "50 Bs.",
    vehicleCapacity: 4,
    availableSeats: 4,
    vehicleType: "Auto Normal",
    driverName: "Roberto Carlos"
  },
];

export default function ListaDeEsperaPage() {
  const router = useRouter();
  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="mb-8 shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-primary flex items-center justify-center">
            <ListChecks className="mr-3 h-8 w-8" /> Lista de Espera - Viajes Inmediatos
          </CardTitle>
          <CardDescription className="text-center text-lg text-foreground/80">
            Encuentra chóferes listos para llevarte ahora mismo. Estos viajes no se reservan, ¡son para ya!
          </CardDescription>
        </CardHeader>
      </Card>

      {mockImmediateTrips.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">No hay chóferes en la lista de espera en este momento. ¡Intenta de nuevo en unos minutos!</p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockImmediateTrips.map((trip) => (
          <Card key={trip.id} className="flex flex-col shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl text-primary flex items-center">
                <Navigation className="mr-2 h-6 w-6" /> {trip.destination}
              </CardTitle>
              <CardDescription className="text-sm">Chófer: {trip.driverName}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-3">
              <div className="flex items-center text-sm">
                <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                <strong>Ubicación Actual Chófer:</strong> <span className="ml-1">{trip.currentLocation}</span>
              </div>
              <div className="flex items-center text-sm">
                <DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />
                <strong>Precio del Viaje:</strong> <span className="ml-1">{trip.price}</span>
              </div>
               <div className="flex items-center text-sm">
                <Car className="mr-2 h-4 w-4 text-muted-foreground" />
                <strong>Vehículo:</strong> <span className="ml-1">{trip.vehicleType} ({trip.vehicleCapacity} asientos)</span>
              </div>
              <div className="flex items-center text-sm">
                <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                <strong>Asientos Disponibles Ahora:</strong> <span className="ml-1">{trip.availableSeats}</span>
              </div>
              <div className="flex items-center text-sm">
                <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                <strong>Teléfono Chófer:</strong> <span className="ml-1">{trip.driverPhone}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full btn-primary text-explicit-white">
                Contactar Chófer / Solicitar
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-12 flex flex-col sm:flex-row justify-center items-center gap-4 border-t pt-6">
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
