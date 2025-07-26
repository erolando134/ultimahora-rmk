"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Send, Phone, MapPin, Package, DollarSign, Home, Camera, ArrowLeft } from "lucide-react";
import React from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation';

export default function MensajeriaPage() {
  const router = useRouter();
  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="max-w-2xl mx-auto shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center flex items-center justify-center text-primary">
            <Send className="mr-3 h-8 w-8" />
            Solicitar Servicio de Mensajería
          </CardTitle>
          <CardDescription className="text-center text-lg text-foreground/80">
            Complete los datos para el envío rápido de sus paquetes.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="pickup-address-mensajeria" className="text-base font-medium flex items-center">
                <MapPin className="mr-2 h-5 w-5 text-muted-foreground" />
                Dirección de Recogida
              </Label>
              <Input id="pickup-address-mensajeria" placeholder="Ej: Oficina Central, Calle Sol 45" className="text-base" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="delivery-address-mensajeria" className="text-base font-medium flex items-center">
                <MapPin className="mr-2 h-5 w-5 text-muted-foreground" />
                Dirección de Entrega
              </Label>
              <Input id="delivery-address-mensajeria" placeholder="Ej: Residencia Luna, Av. Estrella 88" className="text-base" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="package-description" className="text-base font-medium flex items-center">
                <Package className="mr-2 h-5 w-5 text-muted-foreground" />
                Descripción del Paquete
            </Label>
            <Textarea id="package-description" placeholder="Ej: Documentos importantes, un pequeño regalo, llaves..." rows={3} className="text-base" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="client-phone-mensajeria" className="text-base font-medium flex items-center">
              <Phone className="mr-2 h-5 w-5 text-muted-foreground" />
              Teléfono del Cliente
            </Label>
            <Input id="client-phone-mensajeria" type="tel" placeholder="Ej: 912345678" className="text-base" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="max-payment-mensajeria" className="text-base font-medium flex items-center">
              <DollarSign className="mr-2 h-5 w-5 text-muted-foreground" />
              Precio Máximo a Pagar (Bs.)
            </Label>
            <Input id="max-payment-mensajeria" type="number" placeholder="Ej: 15" className="text-base" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location-screenshot-mensajeria" className="text-base font-medium flex items-center">
              <Camera className="mr-2 h-5 w-5 text-muted-foreground" />
              Captura de Ubicación de Recogida (Opcional)
            </Label>
            <Input id="location-screenshot-mensajeria" type="file" accept="image/*" className="text-base" />
            <p className="text-xs text-muted-foreground">Sube una captura de pantalla de tu ubicación de recogida para ayudar al mensajero.</p>
          </div>

        </CardContent>
        <CardFooter>
          <Button type="submit" size="lg" className="w-full btn-primary text-lg text-explicit-white">
            Solicitar Servicio
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
