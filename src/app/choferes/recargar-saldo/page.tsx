"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, DollarSign, Home, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";
import { useSession } from "next-auth/react";
import { toast } from "@/hooks/use-toast";
import ChoferGuia from "@/components/ChoferGuia"; // <-- Avatar importado

export default function RecargarSaldoPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const userEmail = session?.user?.email;

  const [mensajePago, setMensajePago] = useState("");
  const [estado, setEstado] = useState("");
  const [docId, setDocId] = useState<string | null>(null);

  // Escuchar en tiempo real el estado de solicitud del chofer
  useEffect(() => {
    if (!userEmail) return;

    const q = query(
      collection(db, "solicitar-datos"),
      where("userId", "==", userEmail)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.forEach((doc) => {
        setEstado(doc.data().estado);
        setDocId(doc.id);
      });
    });

    return () => unsubscribe();
  }, [userEmail]);

  // Enviar confirmación de pago al admin
  const handleConfirmarPago = async () => {
    if (!userEmail || !docId) return;

    try {
      await addDoc(collection(db, "pagos_confirmados"), {
        userId: userEmail,
        mensaje: mensajePago,
        timestamp: Timestamp.now(),
      });

      toast({
        title: "Pago enviado",
        description: "Tu confirmación fue enviada al administrador.",
      });
      setMensajePago("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      
      {/* Avatar con mensaje callejero pero simple */}
      <ChoferGuia mensaje="Oye, mi hermano, no te quedes sin la estilla. Recarga la pasta pa’ seguir rodando y trabajando tranquilo." />

      <Card className="max-w-lg mx-auto shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center flex items-center justify-center text-primary">
            <CreditCard className="mr-3 h-8 w-8" /> Recargar Saldo de Chófer
          </CardTitle>
          <CardDescription className="text-center text-lg text-foreground/80">
            Solicita los datos de pago al administrador, efectúa la recarga y espera el <b>CONFIRMADO</b>.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {estado !== "confirmado" ? (
            <>
              <div className="p-4 bg-accent/10 rounded-md border border-accent">
                <p className="text-sm text-accent/90">
                  Estado actual: <b>{estado || "esperando confirmación..."}</b>
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mensaje-pago" className="text-base font-medium">
                  Mensaje de pago (Ej: Ya envié la transferencia)
                </Label>
                <Input
                  id="mensaje-pago"
                  value={mensajePago}
                  onChange={(e) => setMensajePago(e.target.value)}
                  placeholder="Escribe aquí tu mensaje para el admin"
                />
              </div>

              <Button onClick={handleConfirmarPago} className="w-full">
                Enviar confirmación de pago
              </Button>

              <Link href="/solicitar-datos">
                <Button variant="outline" className="w-full mt-2">
                  Solicitar datos de pago
                </Button>
              </Link>
            </>
          ) : (
            <div className="p-4 bg-green-100 border border-green-400 rounded-md">
              <p className="text-green-800 text-center font-semibold">
                Tu pago ha sido <b>CONFIRMADO</b>. Puedes seguir trabajando.
              </p>
            </div>
          )}
        </CardContent>

        <CardFooter>
          <div className="w-full flex flex-col sm:flex-row justify-center items-center gap-4 border-t pt-6">
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Ir Atrás
            </Button>
            <Link href="/">
              <Button variant="outline">
                <Home className="mr-2 h-4 w-4" /> Volver al Inicio
              </Button>
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
