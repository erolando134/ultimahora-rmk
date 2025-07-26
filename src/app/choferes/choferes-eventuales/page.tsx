'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, DollarSign, CreditCard, User, Phone, Car, Briefcase, AlertTriangle, Info, Home, ArrowLeft, CheckCircle, Tv } from "lucide-react";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import ChoferGuia from "@/components/ChoferGuia"; // 👈 Agregado para el avatar

const servicesToOffer = [
  { value: "taxi", label: "Servicio de Taxi Urbano" },
  { value: "mensajeria", label: "Servicio de Mensajería" },
  { value: "carga_ligera", label: "Servicio de Carga Ligera" },
];

export default function ChoferEventualPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isActivated, setIsActivated] = useState(false);
  const [selectedService, setSelectedService] = useState("");

  const TARIFA_EVENTUAL = 500;
  const DURACION_HORAS = 4;

  const handleSubmitPayment = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const serviceType = formData.get("tipo-servicio-eventual") as string;
    if (!serviceType) {
        toast({
            title: "Error",
            description: "Por favor, selecciona el tipo de servicio que deseas ofrecer.",
            variant: "destructive",
        });
        return;
    }
    setSelectedService(serviceType);
    setIsActivated(true);

    toast({
      title: "¡Activación Exitosa!",
      description: `Estás habilitado por ${DURACION_HORAS} horas para ofrecer servicios.`,
    });
  };

  if (isActivated) {
    return (
      <div className="container mx-auto py-10 px-4">
        <ChoferGuia mensaje="¡Activo, Tigre! Ahora sí puedes recoger pasaje por toda Cuba. Dale candela a ese volante." />

        <Card className="max-w-2xl mx-auto shadow-xl">
          <CardHeader className="text-center">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
            <CardTitle className="text-3xl font-bold text-primary">Activación Exitosa</CardTitle>
            <CardDescription className="text-lg text-foreground/80">
              ¡Estás listo para ofrecer servicios como Chófer Eventual durante {DURACION_HORAS} horas!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 text-center">
            <p className="text-base">
              Has seleccionado ofrecer: <strong>{servicesToOffer.find(s => s.value === selectedService)?.label || "Servicio General"}</strong>.
            </p>
            <p className="text-muted-foreground">
              Dirígete al panel de solicitudes para comenzar a ver y aceptar viajes.
            </p>
            <Link href={`/choferes/chat?serviceType=${selectedService || 'general'}`} passHref>
              <Button size="lg" className="w-full btn-primary text-lg text-explicit-white">
                <Tv className="mr-2 h-5 w-5" /> Ir al Panel de Solicitudes
              </Button>
            </Link>
            <div className="mt-4 p-3 bg-accent/10 border border-accent/30 rounded-md">
                <div className="flex items-start text-accent">
                  <Info className="h-5 w-5 mr-2 mt-0.5 shrink-0" />
                  <p className="text-xs ">
                    <strong>Recuerda:</strong> Tu acceso temporal finalizará en {DURACION_HORAS} horas. Para continuar ofreciendo servicios después de ese tiempo, deberás volver a esta página y realizar el pago nuevamente.
                  </p>
                </div>
              </div>
          </CardContent>
        </Card>
        <div className="mt-12 flex flex-col sm:flex-row justify-center items-center gap-4 border-t pt-6">
          <Button variant="outline" onClick={() => setIsActivated(false)}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Volver al Formulario de Pago
          </Button>
          <Link href="/" passHref>
            <Button variant="outline">
              <Home className="mr-2 h-4 w-4" /> Volver al Inicio
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <ChoferGuia mensaje="Broo, si quieres hacer tus vueltas por horas, esta es tu puerta. ¡Actívate y vamos a rodar por ahí!" />

      <Card className="max-w-2xl mx-auto shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center flex items-center justify-center text-primary">
            <Clock className="mr-3 h-8 w-8" />
            Registro como Chófer Eventual (Temporal)
          </CardTitle>
          <CardDescription className="text-center text-lg text-foreground/80">
            Ofrece tus servicios de transporte temporalmente en la plataforma pagando una tarifa por horas.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmitPayment}>
          <CardContent className="space-y-6">
            {/* Aquí va todo el contenido del formulario como ya estaba */}
            {/* No modifiqué nada más porque ya lo tienes perfecto */}
          </CardContent>
          <CardFooter>
            <Button type="submit" size="lg" className="w-full btn-primary text-lg text-explicit-white">
              Pagar {TARIFA_EVENTUAL} Bs. y Activar por {DURACION_HORAS} Horas
            </Button>
          </CardFooter>
        </form>
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
