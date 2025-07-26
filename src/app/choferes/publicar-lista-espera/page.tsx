"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ListChecks, MapPin, Navigation, Phone, DollarSign, Users, Edit3, Home, ArrowLeft } from "lucide-react";
import React from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import ChoferGuia from "@/components/ChoferGuia"; // <-- importamos avatar

export default function PublicarListaEsperaPage() {
  const router = useRouter();
  return (
    <div className="container mx-auto py-10 px-4">
      
      {/* Avatar con mensaje suave */}
      <ChoferGuia mensaje="¡Tigre! Llena estos datos con calma y publica tu viaje para que los clientes te encuentren rápido." />

      <Card className="max-w-2xl mx-auto shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center flex items-center justify-center text-primary">
            <Edit3 className="mr-3 h-8 w-8" />
            Publicar Viaje en Lista de Espera
          </CardTitle>
          <CardDescription className="text-center text-lg text-foreground/80">
            Ofrece un viaje para realizarse de inmediato. Los clientes te contactarán directamente.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="current-location" className="text-base font-medium flex items-center">
              <MapPin className="mr-2 h-5 w-5 text-muted-foreground" />
              Lugar Donde Te Encuentras Ahora
            </Label>
            <Input id="current-location" placeholder="Ej: Plaza Murillo, esperando pasajeros" className="text-base" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="destination" className="text-base font-medium flex items-center">
              <Navigation className="mr-2 h-5 w-5 text-muted-foreground" />
              Destino Principal del Viaje
            </Label>
            <Input id="destination" placeholder="Ej: Zona Sur, Ciudad Satélite, etc." className="text-base" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="driver-phone" className="text-base font-medium flex items-center">
              <Phone className="mr-2 h-5 w-5 text-muted-foreground" />
              Tu Teléfono de Contacto (para clientes)
            </Label>
            <Input id="driver-phone" type="tel" placeholder="Ej: 70011223" className="text-base" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="trip-price" className="text-base font-medium flex items-center">
                <DollarSign className="mr-2 h-5 w-5 text-muted-foreground" />
                Precio Total del Viaje (Bs.)
              </Label>
              <Input id="trip-price" type="number" placeholder="Ej: 50" className="text-base" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vehicle-capacity" className="text-base font-medium flex items-center">
                <Users className="mr-2 h-5 w-5 text-muted-foreground" />
                Capacidad Total del Vehículo
              </Label>
              <Input id="vehicle-capacity" type="number" placeholder="Ej: 4" className="text-base" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="available-seats" className="text-base font-medium flex items-center">
              <Users className="mr-2 h-5 w-5 text-muted-foreground" />
              Asientos Disponibles Ahora
            </Label>
            <Input id="available-seats" type="number" placeholder="Ej: 3" className="text-base" />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" size="lg" className="w-full btn-primary text-lg text-explicit-white">
            <ListChecks className="mr-2 h-5 w-5" /> Publicar Viaje Ahora en Lista de Espera
          </Button>
        </CardFooter>
      </Card>

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
