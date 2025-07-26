"use client";

import {
  collection,
  getDocs,
  query,
  orderBy,
  updateDoc,
  doc,
  Timestamp,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase/firebase";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

type DepositRequest = {
  id: string;
  ci: string;
  fullName: string;
  modality: string;
  status: "pending" | "responded";
  createdAt: Timestamp;
  cardNumber?: string;
  phoneConfirm?: string;
};

export default function SolicitudesAdminPage() {
  const [requests, setRequests] = useState<DepositRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, "depositRequests"),
          orderBy("createdAt", "desc")
        );
        const snapshot = await getDocs(q);
        const data: DepositRequest[] = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as Omit<DepositRequest, "id">),
        }));
        setRequests(data);
      } catch (err) {
        toast({
          title: "Error al cargar solicitudes",
          description: "No se pudieron obtener las solicitudes desde Firestore.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleResponder = async (
    id: string,
    cardNumber: string,
    phoneConfirm: string
  ) => {
    if (!cardNumber || !phoneConfirm) {
      toast({
        title: "Datos incompletos",
        description: "Debes ingresar el número de tarjeta y teléfono.",
        variant: "destructive",
      });
      return;
    }

    try {
      setUpdatingId(id);
      const ref = doc(db, "depositRequests", id);
      await updateDoc(ref, {
        status: "responded",
        cardNumber,
        phoneConfirm,
        responseAt: Timestamp.now(),
      });

      toast({
        title: "Solicitud respondida",
        description: "Los datos fueron enviados correctamente.",
      });

      // Actualizar el estado local
      setRequests((prev) =>
        prev.map((req) =>
          req.id === id
            ? { ...req, status: "responded", cardNumber, phoneConfirm }
            : req
        )
      );
    } catch (err: any) {
      toast({
        title: "Error al responder",
        description: err.message || "No se pudo actualizar la solicitud.",
        variant: "destructive",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin h-10 w-10 text-primary" />
        <span className="ml-4">Cargando solicitudes...</span>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="text-center mt-20 text-muted-foreground">
        No hay solicitudes por mostrar.
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-primary">Solicitudes de Depósito</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {requests.map((req) => (
          <Card key={req.id}>
            <CardHeader>
              <CardTitle>{req.fullName}</CardTitle>
              <CardDescription>
                Modalidad: {req.modality} | CI: {req.ci} | Estado:{" "}
                <span
                  className={
                    req.status === "pending" ? "text-yellow-600" : "text-green-600"
                  }
                >
                  {req.status === "pending" ? "Pendiente" : "Respondida"}
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {req.status === "responded" ? (
                <div className="text-sm space-y-1">
                  <p>
                    <strong>Tarjeta:</strong> {req.cardNumber}
                  </p>
                  <p>
                    <strong>Teléfono Transfermóvil:</strong> {req.phoneConfirm}
                  </p>
                  <p className="text-green-700 font-medium">
                    ✓ Datos enviados correctamente
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const form = e.currentTarget;
                    const card = (form.elements.namedItem("cardNumber") as HTMLInputElement).value;
                    const phone = (form.elements.namedItem("phoneConfirm") as HTMLInputElement).value;
                    handleResponder(req.id, card, phone);
                  }}
                  className="space-y-2"
                >
                  <Input name="cardNumber" placeholder="Número de tarjeta" />
                  <Input
                    name="phoneConfirm"
                    placeholder="Teléfono Transfermóvil"
                  />
                  <Button
                    type="submit"
                    disabled={updatingId === req.id}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    {updatingId === req.id ? (
                      <>
                        <Loader2 className="animate-spin h-4 w-4 mr-2" />
                        Enviando...
                      </>
                    ) : (
                      "Responder solicitud"
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
