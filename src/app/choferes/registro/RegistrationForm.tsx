"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";

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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { UserPlus, ArrowLeft, Home, Loader2 } from "lucide-react";

const modalityDetails = {
  taxi: { displayName: "Taxi Local", initialBalance: 1000 },
  mensajeria: { displayName: "Mensajería", initialBalance: 500 },
  carga: { displayName: "Carga", initialBalance: 1500 },
  interprovincial: { displayName: "Interprovincial", initialBalance: 1500 },
  excursiones: { displayName: "Excursiones", initialBalance: 1500 },
  lista_espera: { displayName: "Lista de Espera", initialBalance: 1000 },
  eventual: { displayName: "Eventual", initialBalance: 500 },
  empleo: { displayName: "Ofertas de Empleo", initialBalance: 0 },
};

export default function RegistrationForm() {
  const router = useRouter();
  const { toast } = useToast();
  const { data: session } = useSession();
  const userEmail = session?.user?.email;

  const [selectedModality, setSelectedModality] = useState("");
  const [fullName, setFullName] = useState("");
  const [ci, setCi] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isFormValid = fullName && ci && phone && selectedModality;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid || !userEmail) {
      toast({
        title: "Campos incompletos",
        description: "Completa todos los datos y asegúrate de estar logueado.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const ref = collection(db, "solicitar_datos");
      const q = query(
        ref,
        where("userId", "==", userEmail),
        where("tipo", "==", selectedModality)
      );
      const docs = await getDocs(q);

      if (!docs.empty) {
        toast({
          title: "Ya solicitaste esta modalidad",
          description:
            "No es necesario enviar otra solicitud para la misma modalidad.",
          variant: "default",
        });
        setIsLoading(false);
        return;
      }

      await addDoc(ref, {
        userId: userEmail,
        nombre: fullName,
        telefono: phone,
        mensaje: `CI: ${ci}`,
        tipo: selectedModality,
        estado: "pendiente",
        createdAt: Timestamp.now(),
      });

      toast({
        title: "Solicitud enviada",
        description: "El administrador te responderá pronto.",
      });

      router.push("/registro/completado");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo enviar la solicitud.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-lg mx-auto mt-8">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Registro de Chófer</CardTitle>
        <CardDescription>
          Selecciona una modalidad y completa los datos. Si deseas inscribirte en
          más de una, repite este formulario.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Accordion type="single" collapsible>
            {Object.entries(modalityDetails).map(([key, { displayName }]) => (
              <AccordionItem key={key} value={key}>
                <AccordionTrigger
                  onClick={() => setSelectedModality(key)}
                  className={selectedModality === key ? "bg-blue-100 text-blue-700" : ""}
                >
                  {displayName}
                </AccordionTrigger>
                <AccordionContent>Modalidad seleccionada: {displayName}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <Input
            placeholder="Nombre completo"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <Input
            placeholder="CI"
            value={ci}
            onChange={(e) => setCi(e.target.value)}
            required
          />
          <Input
            placeholder="Teléfono"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />

          <Button
            type="submit"
            className="w-full bg-blue-600 text-white hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="animate-spin mr-2 h-4 w-4" />
            ) : (
              <UserPlus className="mr-2 h-4 w-4" />
            )}
            Enviar Solicitud
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex justify-between">
        <Link
          href="/"
          className="text-muted-foreground hover:underline text-sm flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Volver al inicio
        </Link>
        <Link
          href="/inicio"
          className="text-muted-foreground hover:underline text-sm flex items-center"
        >
          <Home className="h-4 w-4 mr-1" />
          Ir a la página principal
        </Link>
      </CardFooter>
    </Card>
  );
}
