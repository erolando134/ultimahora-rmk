"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { UserPlus, Briefcase, Car, CalendarCheck, Wallet, Clock, Phone, Home, ArrowLeft } from "lucide-react";
import React from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation';

const modalidadesChofer = [
  { value: "taxi", label: "Chófer de Taxi Urbano" },
  { value: "mensajeria", label: "Chófer de Mensajería" },
  { value: "carga", label: "Chófer de Carga" },
  { value: "interprovincial", label: "Chófer Interprovincial" },
  { value: "excursiones", label: "Chófer de Excursiones" },
];

export default function PublicarEmpleoChoferPage() {
  const router = useRouter();
  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="max-w-2xl mx-auto shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center flex items-center justify-center text-primary">
            <UserPlus className="mr-3 h-8 w-8" />
            Publicar Oferta de Empleo para Chófer
          </CardTitle>
          <CardDescription className="text-center text-lg text-foreground/80">
            Describe la vacante para que los chóferes interesados puedan postularse.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="titulo-oferta" className="text-base font-medium flex items-center">
              <Briefcase className="mr-2 h-5 w-5 text-muted-foreground" />
              Título de la Oferta
            </Label>
            <Input id="titulo-oferta" placeholder="Ej: Se necesita chófer para taxi en turno nocturno" className="text-base" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="modalidad-requerida" className="text-base font-medium flex items-center">
              <Car className="mr-2 h-5 w-5 text-muted-foreground" />
              Tipo de Modalidad Requerida
            </Label>
            <Select name="modalidad-requerida">
              <SelectTrigger id="modalidad-requerida" className="text-base">
                <SelectValue placeholder="Selecciona la modalidad" />
              </SelectTrigger>
              <SelectContent>
                {modalidadesChofer.map(modalidad => (
                  <SelectItem key={modalidad.value} value={modalidad.value} className="text-base">
                    {modalidad.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion-trabajo" className="text-base font-medium flex items-center">
              <Briefcase className="mr-2 h-5 w-5 text-muted-foreground" />
              Descripción Detallada del Trabajo
            </Label>
            <Textarea id="descripcion-trabajo" placeholder="Ej: Responsabilidades, requisitos específicos, zonas de operación, etc." rows={4} className="text-base" />
          </div>
          
          <div className="space-y-2">
            <Label className="text-base font-medium flex items-center">
                <Car className="mr-2 h-5 w-5 text-muted-foreground" />
                ¿Se Provee Vehículo?
            </Label>
            <RadioGroup defaultValue="no" name="provee-vehiculo" className="flex space-x-4 pt-1">
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="si" id="vehiculo-si" />
                    <Label htmlFor="vehiculo-si" className="text-base">Sí</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="vehiculo-no" />
                    <Label htmlFor="vehiculo-no" className="text-base">No</Label>
                </div>
            </RadioGroup>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="tiempo-contratacion" className="text-base font-medium flex items-center">
                <CalendarCheck className="mr-2 h-5 w-5 text-muted-foreground" />
                Tiempo de Contratación
              </Label>
              <Input id="tiempo-contratacion" placeholder="Ej: Indefinido, 3 meses, Por proyecto" className="text-base" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="salario-ofrecido" className="text-base font-medium flex items-center">
                <Wallet className="mr-2 h-5 w-5 text-muted-foreground" />
                Salario Ofrecido (Bs.)
              </Label>
              <Input id="salario-ofrecido" type="number" placeholder="Ej: 3500" className="text-base" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dias-horario" className="text-base font-medium flex items-center">
              <Clock className="mr-2 h-5 w-5 text-muted-foreground" />
              Días de Trabajo / Horario
            </Label>
            <Input id="dias-horario" placeholder="Ej: Lunes a Viernes, 8am - 5pm" className="text-base" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="telefono-contacto-oferta" className="text-base font-medium flex items-center">
              <Phone className="mr-2 h-5 w-5 text-muted-foreground" />
              Teléfono de Contacto del Empleador
            </Label>
            <Input id="telefono-contacto-oferta" type="tel" placeholder="Ej: 70012345" className="text-base" />
          </div>

        </CardContent>
        <CardFooter>
          <Button type="submit" size="lg" className="w-full btn-primary text-lg text-explicit-white">
            Publicar Oferta de Empleo
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
