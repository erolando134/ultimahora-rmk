"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Notificacion {
  id: string;
  titulo: string;
  mensaje: string;
  fecha: string;
}

export default function NotificacionesAdminPage() {
  const { toast } = useToast();
  const [titulo, setTitulo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, "notificaciones"),
      orderBy("fecha", "desc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: Notificacion[] = snapshot.docs.map((doc) => {
        const d = doc.data();
        return {
          id: doc.id,
          titulo: d.titulo || "Sin título",
          mensaje: d.mensaje || "",
          fecha: d.fecha?.toDate().toLocaleString() || "",
        };
      });
      setNotificaciones(data);
    });

    return () => unsubscribe();
  }, []);

  const enviarNotificacion = async () => {
    if (!titulo || !mensaje) {
      toast({ title: "Completa los campos", description: "Falta el título o el mensaje." });
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "notificaciones"), {
        titulo,
        mensaje,
        fecha: Timestamp.now(),
      });

      toast({ title: "Enviado", description: "Notificación enviada con éxito." });
      setTitulo("");
      setMensaje("");
    } catch (error) {
      console.error("Error al enviar:", error);
      toast({ title: "Error", description: "No se pudo enviar la notificación." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-8">
      <h1 className="text-3xl font-bold text-primary">Gestionar Notificaciones</h1>

      <Card>
        <CardHeader>
          <CardTitle>Enviar nueva notificación</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Título de la notificación"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />
          <Textarea
            placeholder="Escribe el mensaje..."
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
          />
        </CardContent>
        <CardFooter>
          <Button onClick={enviarNotificacion} disabled={loading}>
            {loading && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
            Enviar Notificación
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Historial de Notificaciones</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 max-h-[400px] overflow-y-auto">
          {notificaciones.length === 0 && (
            <p className="text-muted-foreground">No hay notificaciones enviadas.</p>
          )}
          {notificaciones.map((n) => (
            <div key={n.id} className="border-b pb-2">
              <h3 className="font-semibold">{n.titulo}</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-line">
                {n.mensaje}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{n.fecha}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
