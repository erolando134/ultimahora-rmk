"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { MapPinned, CalendarDays, Clock, Users, DollarSign, Phone, Info, Home, ArrowLeft } from "lucide-react";
import React from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation';

const mockExcursions = [
  {
    id: "exc1",
    titulo: "Tour a las Ruinas Ancestrales",
    destino: "Sitio Arqueológico Principal",
    fecha: "2024-09-05",
    duracion: "Full Day (8 horas)",
    tipoVehiculo: "Minibus Turístico",
    cuposDisponibles: 10,
    precioPorPersona: 250, 
    telefonoGuia: "+591 70099887",
    guia: "Ana Quispe",
    incluye: "Transporte, guía, almuerzo ligero."
  },
  {
    id: "exc2",
    titulo: "Aventura en el Parque Nacional",
    destino: "Parque Nacional Las Cumbres",
    fecha: "2024-09-12",
    duracion: "6 horas",
    tipoVehiculo: "Vehículo 4x4",
    cuposDisponibles: 4,
    precioPorPersona: 300,
    telefonoGuia: "+591 70066554",
    guia: "Luis Mendoza",
    incluye: "Transporte, guía especializado, snacks."
  },
];

export default function ExcursionesPage() {
  const router = useRouter();
  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="mb-8 shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-primary">
            Excursiones Programadas
          </CardTitle>
          <CardDescription className="text-center text-lg text-foreground/80">
            Descubre aventuras y tours organizados por nuestros guías y choferes.
          </CardDescription>
        </CardHeader>
      </Card>

      {mockExcursions.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">No hay excursiones publicadas en este momento. ¡Vuelve pronto!</p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockExcursions.map((excursion) => (
          <Card key={excursion.id} className="flex flex-col shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl text-primary flex items-center">
                <MapPinned className="mr-2 h-6 w-6" /> {excursion.titulo}
              </CardTitle>
              <CardDescription className="text-sm">Destino: {excursion.destino} | Guía: {excursion.guia}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-3">
              <div className="flex items-center text-sm">
                <CalendarDays className="mr-2 h-4 w-4 text-muted-foreground" />
                <strong>Fecha:</strong> <span className="ml-1">{new Date(excursion.fecha + 'T00:00:00').toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <div className="flex items-center text-sm">
                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                <strong>Duración:</strong> <span className="ml-1">{excursion.duracion}</span>
              </div>
               <div className="flex items-center text-sm">
                <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                <strong>Vehículo:</strong> <span className="ml-1">{excursion.tipoVehiculo}</span> | <strong>Cupos:</strong> {excursion.cuposDisponibles}
              </div>
              <div className="flex items-center text-sm">
                <DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />
                <strong>Precio por Persona:</strong> <span className="ml-1">{excursion.precioPorPersona} Bs.</span>
              </div>
              <div className="flex items-center text-sm">
                <Info className="mr-2 h-4 w-4 text-muted-foreground" />
                <strong>Incluye:</strong> <span className="ml-1">{excursion.incluye}</span>
              </div>
              <div className="flex items-center text-sm">
                <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                <strong>Contacto Guía:</strong> <span className="ml-1">{excursion.telefonoGuia}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full btn-primary text-explicit-white">
                Reservar Excursión
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
