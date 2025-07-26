"use client";

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Coins, ClipboardList, Award, Ban, DollarSign, Home, ArrowLeft, Users, Briefcase, Percent, Clock, Store, CreditCard, Phone, Loader2 } from "lucide-react";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

export default function ParametersPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumbers: '',
    confirmationPhone: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchPaymentInfo = async () => {
      setIsLoading(true);
      try {
        const docRef = doc(db, "configuracion", "pagos");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPaymentInfo(docSnap.data() as any);
        } else {
          console.log("No se encontró el documento de configuración de pagos.");
        }
      } catch (error) {
        console.error("Error al cargar la información de pago: ", error);
        toast({
          title: "Error",
          description: "No se pudo cargar la configuración de pago.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaymentInfo();
  }, [toast]);

  const handlePaymentInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPaymentInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleSavePaymentInfo = async () => {
    setIsSaving(true);
    try {
      const docRef = doc(db, "configuracion", "pagos");
      await setDoc(docRef, paymentInfo, { merge: true });
      toast({
        title: "¡Éxito!",
        description: "La información de pago ha sido guardada correctamente.",
      });
    } catch (error) {
      console.error("Error al guardar la información de pago: ", error);
      toast({
        title: "Error",
        description: "No se pudo guardar la configuración de pago.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-foreground">Ajuste de Parámetros</h1>
      </div>
      <Tabs defaultValue="pricing" className="w-full">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-1 bg-muted rounded-md p-1">
          <TabsTrigger value="pricing"><Coins className="mr-2 h-4 w-4" />Tarifas</TabsTrigger>
          <TabsTrigger value="payments"><CreditCard className="mr-2 h-4 w-4" />Datos de Pago</TabsTrigger>
          <TabsTrigger value="rules"><ClipboardList className="mr-2 h-4 w-4" />Reglas</TabsTrigger>
          <TabsTrigger value="bonuses"><Award className="mr-2 h-4 w-4" />Bonificaciones</TabsTrigger>
          <TabsTrigger value="expulsions"><Ban className="mr-2 h-4 w-4" />Expulsiones</TabsTrigger>
        </TabsList>

        <TabsContent value="pricing" className="mt-6">
          {/* ... todo el contenido de tarifas permanece igual ... */}
        </TabsContent>

        <TabsContent value="payments" className="mt-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Información de Pago para Inscripciones</CardTitle>
              <CardDescription className="mt-2 text-center sm:text-left">
                Esta información se mostrará a los chóferes durante su proceso de registro para que puedan realizar el depósito.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {isLoading ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <>
                  <div className="space-y-1">
                    <Label htmlFor="cardNumbers" className="font-semibold mb-2 flex items-center">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Cuentas o Números de Tarjeta para Depósitos
                    </Label>
                    <Textarea
                      id="cardNumbers"
                      name="cardNumbers"
                      placeholder="Ej: 4580 **** **** 1234 (Banco A)&#10;1234-5678-9012-3456 (Banco B)&#10;Añade una cuenta por línea."
                      rows={4}
                      value={paymentInfo.cardNumbers}
                      onChange={handlePaymentInfoChange}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="confirmationPhone" className="font-semibold mb-2 flex items-center">
                      <Phone className="mr-2 h-4 w-4" />
                      Teléfono de Confirmación (WhatsApp)
                    </Label>
                    <Input
                      id="confirmationPhone"
                      name="confirmationPhone"
                      type="tel"
                      placeholder="Ej: +591 70011223"
                      value={paymentInfo.confirmationPhone}
                      onChange={handlePaymentInfoChange}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Los chóferes enviarán la foto del comprobante de depósito a este número.
                    </p>
                  </div>
                  <Button onClick={handleSavePaymentInfo} disabled={isSaving} className="btn-primary text-explicit-white mt-4">
                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {isSaving ? 'Guardando...' : 'Guardar Datos de Pago'}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Repite la misma lógica para las demás secciones si usaste `inline-block` con `flex` en labels */}
      </Tabs>

      <div className="mt-12 flex flex-col sm:flex-row justify-center items-center gap-4 border-t pt-8 pb-4">
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
