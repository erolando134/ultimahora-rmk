"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bike, Car, CarFront, Users as UsersIcon, Phone, MapPin, DollarSign, Home, Camera, ArrowLeft } from "lucide-react"; 
import { Slider } from "@/components/ui/Slider";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { db, auth } from "@/lib/firebase/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "@/hooks/useAuth";

export default function TaxiUrbanoPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const [paymentOffer, setPaymentOffer] = useState([30]); 
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    if (!user) {
        toast({ title: "Error", description: "Debes iniciar sesión para solicitar un servicio.", variant: "destructive" });
        setIsSubmitting(false);
        return;
    }

    const formData = new FormData(event.currentTarget);
    const serviceDetails = {
      clientName: user.displayName || user.email || "Cliente Anónimo",
      clientId: user.uid,
      serviceType: "Taxi Urbano",
      pickupPoint: formData.get("pickup-point") as string,
      contactPhone: formData.get("contact-phone") as string,
      tripPrice: paymentOffer[0],
      passengers: formData.get("passengers") as string,
      vehicleType: formData.get("vehicle-type") as string,
      status: "pending", 
      isCompleted: false,
      isUnread: true,
      createdAt: serverTimestamp(),
      lastActivity: serverTimestamp(),
      messages: [
        {
          sender: "system",
          text: `Nueva solicitud de Taxi Urbano:\n- Recogida: ${formData.get("pickup-point")}\n- Contacto: ${formData.get("contact-phone")}\n- Oferta: ${paymentOffer[0]} Bs.\n- Pasajeros: ${formData.get("passengers")}\n- Vehículo: ${formData.get("vehicle-type")}`,
          timestamp: new Date(),
        }
      ],
      // TODO: Implement logic to find and assign the nearest available driver
      driverId: "DRV001", // Placeholder driver ID
    };

    if (!serviceDetails.pickupPoint || !serviceDetails.contactPhone) {
        toast({ title: "Error", description: "Por favor, completa los campos de recogida y contacto.", variant: "destructive" });
        setIsSubmitting(false);
        return;
    }

    try {
      const docRef = await addDoc(collection(db, "chats"), serviceDetails);
      console.log("Document written with ID: ", docRef.id);
      
      toast({
        title: "¡Solicitud Enviada!",
        description: "Tu solicitud ha sido enviada a los chóferes cercanos. Serás notificado pronto.",
      });

      // Redirect user to a page where they can see their active requests
      router.push('/dashboard'); 
    } catch (error) {
      console.error("Error adding document: ", error);
      toast({ title: "Error", description: "No se pudo enviar la solicitud. Por favor, inténtalo de nuevo.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="max-w-2xl mx-auto shadow-xl">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center flex items-center justify-center text-primary">
              <Car className="mr-3 h-8 w-8" />
              Solicitar Taxi Urbano
            </CardTitle>
            <CardDescription className="text-center text-lg text-foreground/80">
              Complete el formulario para encontrar un taxi para su viaje en la ciudad.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="pickup-point" className="text-base font-medium flex items-center">
                <MapPin className="mr-2 h-5 w-5 text-muted-foreground" />
                Lugar de Recogida
              </Label>
              <Input id="pickup-point" name="pickup-point" placeholder="Ej: Av. Principal 123, Centro" className="text-base" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact-phone" className="text-base font-medium flex items-center">
                <Phone className="mr-2 h-5 w-5 text-muted-foreground" />
                Teléfono de Contacto
              </Label>
              <Input id="contact-phone" name="contact-phone" type="tel" placeholder="Ej: 70012345" className="text-base" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="payment-offer" className="text-base font-medium flex items-center">
                  <DollarSign className="mr-2 h-5 w-5 text-muted-foreground" />
                  ¿Cuánto está dispuesto a pagar? (Bs.)
              </Label>
              <div className="flex items-center space-x-4">
                <Slider
                  id="payment-offer-slider"
                  min={5}
                  max={200}
                  step={1}
                  value={paymentOffer}
                  onValueChange={setPaymentOffer}
                  className="w-full"
                />
                <span className="text-base font-semibold text-primary w-24 text-right">{paymentOffer[0]} Bs.</span>
              </div>
              <Input 
                id="payment-offer-input"
                name="payment-offer"
                type="number" 
                value={paymentOffer[0]}
                onChange={(e) => setPaymentOffer([parseInt(e.target.value, 10) || 0])}
                className="mt-2 text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="passengers" className="text-base font-medium flex items-center">
                  <UsersIcon className="mr-2 h-5 w-5 text-muted-foreground" />
                  ¿Cuántos Pasajeros?
              </Label>
              <Select name="passengers" defaultValue="1">
                <SelectTrigger id="passengers" className="text-base">
                  <SelectValue placeholder="Seleccione cantidad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1" className="text-base">1 Pasajero</SelectItem>
                  <SelectItem value="2-3" className="text-base">2-3 Pasajeros</SelectItem>
                  <SelectItem value="4+" className="text-base">4+ Pasajeros</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-base font-medium">Tipo de Vehículo Deseado</Label>
              <RadioGroup defaultValue="auto-normal" name="vehicle-type" className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <RadioGroupItem value="moto" id="moto" className="peer sr-only" />
                  <Label
                    htmlFor="moto"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer h-full"
                  >
                    <Bike className="mb-3 h-8 w-8" />
                    Moto
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="auto-normal" id="auto-normal" className="peer sr-only" />
                  <Label
                    htmlFor="auto-normal"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer h-full"
                  >
                    <Car className="mb-3 h-8 w-8" />
                    Auto Normal
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="auto-confort" id="auto-confort" className="peer sr-only" />
                  <Label
                    htmlFor="auto-confort"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer h-full"
                  >
                    <CarFront className="mb-3 h-8 w-8" />
                    Auto Confortable
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="van-minivan" id="van-minivan" className="peer sr-only" />
                  <Label
                    htmlFor="van-minivan"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer h-full"
                  >
                    <UsersIcon className="mb-3 h-8 w-8" /> 
                    Van/Minivan
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location-screenshot" className="text-base font-medium flex items-center">
                <Camera className="mr-2 h-5 w-5 text-muted-foreground" />
                Captura de Ubicación (Opcional)
              </Label>
              <Input id="location-screenshot" name="location-screenshot" type="file" accept="image/*" className="text-base" />
              <p className="text-xs text-muted-foreground">Sube una captura de pantalla de tu ubicación actual para ayudar al conductor.</p>
            </div>

          </CardContent>
          <CardFooter>
            <Button type="submit" size="lg" className="w-full btn-primary text-lg text-explicit-white" disabled={isSubmitting}>
              {isSubmitting ? 'Enviando...' : 'Solicitar Servicio'}
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
