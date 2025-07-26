"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Briefcase, Car, Wallet, Phone, Home, ArrowLeft, Search } from "lucide-react";
import React from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation';

const mockJobOffers = [
  {
    id: "job1",
    title: "Chófer de Taxi - Turno Día",
    modality: "Taxi Urbano",
    description: "Se requiere chófer responsable para taxi en zona céntrica. Buenas referencias indispensables.",
    providesVehicle: "Sí",
    salary: "4000 Bs. + comisiones",
    contact: "70011111",
    employer: "Cooperativa 'El Rápido'"
  },
  {
    id: "job2",
    title: "Conductor para Mensajería Urgente",
    modality: "Mensajería",
    description: "Buscamos motorista para entregas rápidas. Moto propia deseable pero no excluyente.",
    providesVehicle: "No (preferiblemente sí)",
    salary: "A convenir según envíos",
    contact: "70022222",
    employer: "Distribuciones Express"
  },
  {
    id: "job3",
    title: "Chófer de Carga Pesada - Rutas Nacionales",
    modality: "Carga",
    description: "Empresa de logística busca chófer con licencia categoría C para transporte de carga a nivel nacional. Vehículo provisto por la empresa.",
    providesVehicle: "Sí",
    salary: "6500 Bs. + viáticos",
    contact: "70033333",
    employer: "Logística Andina S.R.L."
  },
];

export default function VerOfertasEmpleoPage() {
  const router = useRouter();
  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="mb-8 shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-primary flex items-center justify-center">
            <Search className="mr-3 h-8 w-8" /> Ofertas de Empleo para Chóferes
          </CardTitle>
          <CardDescription className="text-center text-lg text-foreground/80">
            Encuentra oportunidades laborales publicadas por clientes y empresas.
          </CardDescription>
        </CardHeader>
      </Card>

      {mockJobOffers.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">No hay ofertas de empleo publicadas en este momento. ¡Vuelve pronto!</p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockJobOffers.map((offer) => (
          <Card key={offer.id} className="flex flex-col shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl text-primary flex items-center">
                <Briefcase className="mr-2 h-6 w-6" /> {offer.title}
              </CardTitle>
              <CardDescription className="text-sm">Publicado por: {offer.employer} | Modalidad: {offer.modality}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-3">
              <p className="text-sm text-muted-foreground">{offer.description}</p>
              <div className="flex items-center text-sm">
                <Car className="mr-2 h-4 w-4 text-muted-foreground" />
                <strong>Provee Vehículo:</strong> <span className="ml-1">{offer.providesVehicle}</span>
              </div>
              <div className="flex items-center text-sm">
                <Wallet className="mr-2 h-4 w-4 text-muted-foreground" />
                <strong>Salario:</strong> <span className="ml-1">{offer.salary}</span>
              </div>
              <div className="flex items-center text-sm">
                <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                <strong>Contacto Empleador:</strong> <span className="ml-1">{offer.contact}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full btn-primary text-explicit-white">
                Contactar Empleador / Aplicar
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
