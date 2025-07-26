"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Bike, Car, Truck, Phone, MapPin, Package, DollarSign, Home, Camera, ArrowLeft } from "lucide-react";
import React from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation';

export default function CargaPage() {
  const router = useRouter();
  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="max-w-2xl mx-auto shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center flex items-center justify-center text-primary">
            <Truck className="mr-3 h-8 w-8" />
            Solicitar Servicio de Carga
          </CardTitle>
          <CardDescription className="text-center text-lg text-foreground/80">
            Indique los detalles para el transporte de su mercancía.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="pickup-address" className="text-base font-medium flex items-center">
                <MapPin className="mr-2 h-5 w-5 text-muted-foreground" />
                Punto de Origen
              </Label>
              <Input id="pickup-address" placeholder="Ej: Almacén Central, Zona Industrial" className="text-base" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="delivery-address" className="text-base font-medium flex items-center">
                <MapPin className="mr-2 h-5 w-5 text-muted-foreground" />
                Punto de Entrega
              </Label>
              <Input id="delivery-address" placeholder="Ej: Tienda XYZ, Av. Comercial" className="text-base" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cargo-type" className="text-base font-medium flex items-center">
                <Package className="mr-2 h-5 w-5 text-muted-foreground" />
                Tipo de Carga
            </Label>
            <Input id="cargo-type" placeholder="Ej: Electrodomésticos, Materiales de construcción" className="text-base" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cargo-dimensions-weight" className="text-base font-medium flex items-center">
                <Package className="mr-2 h-5 w-5 text-muted-foreground" />
                Dimensiones y Peso Estimado
            </Label>
            <Textarea id="cargo-dimensions-weight" placeholder="Ej: 1 caja de 50x50x30cm, 20kg; o Muebles varios, aprox 150kg total" className="text-base" rows={3} />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="client-phone-carga" className="text-base font-medium flex items-center">
              <Phone className="mr-2 h-5 w-5 text-muted-foreground" />
              Teléfono del Cliente
            </Label>
            <Input id="client-phone-carga" type="tel" placeholder="Ej: 912345678" className="text-base" />
          </div>

           <div className="space-y-2">
            <Label htmlFor="payment-offer-carga" className="text-base font-medium flex items-center">
                <DollarSign className="mr-2 h-5 w-5 text-muted-foreground" />
                Precio que está dispuesto a pagar (Bs.)
            </Label>
            <Input id="payment-offer-carga" type="number" placeholder="Ej: 100" className="text-base" />
          </div>
          
          <div className="space-y-2">
            <Label className="text-base font-medium">Tipo de Vehículo Requerido</Label>
            <RadioGroup defaultValue="auto-carga" className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              <div>
                <RadioGroupItem value="moto-carga" id="moto-carga" className="peer sr-only" />
                <Label
                  htmlFor="moto-carga"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer h-full"
                >
                  <Bike className="mb-3 h-8 w-8" />
                  Moto
                </Label>
              </div>
              <div>
                <RadioGroupItem value="auto-carga" id="auto-carga" className="peer sr-only" />
                <Label
                  htmlFor="auto-carga"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer h-full"
                >
                  <Car className="mb-3 h-8 w-8" />
                  Auto
                </Label>
              </div>
              <div>
                <RadioGroupItem value="camion-pequeno" id="camion-pequeno" className="peer sr-only" />
                <Label
                  htmlFor="camion-pequeno"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer h-full"
                >
                  <Truck className="mb-3 h-8 w-8" />
                  Camión Pequeño
                </Label>
              </div>
              <div>
                <RadioGroupItem value="camion-grande" id="camion-grande" className="peer sr-only" />
                <Label
                  htmlFor="camion-grande"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer h-full"
                >
                  <Truck className="mb-3 h-8 w-8" />
                  Camión Grande
                </Label>
              </div>
            </RadioGroup>
          </div>

           <div className="space-y-2">
            <Label htmlFor="location-screenshot-carga" className="text-base font-medium flex items-center">
              <Camera className="mr-2 h-5 w-5 text-muted-foreground" />
              Captura de Ubicación de Origen (Opcional)
            </Label>
            <Input id="location-screenshot-carga" type="file" accept="image/*" className="text-base" />
            <p className="text-xs text-muted-foreground">Sube una captura de pantalla de la ubicación de origen de la carga.</p>
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
