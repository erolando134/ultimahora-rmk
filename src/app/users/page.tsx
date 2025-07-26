// /users/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  User,
  Briefcase,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  ShieldOff,
  DollarSign,
  Home,
  ArrowLeft,
  Send,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  updateDoc,
  doc,
  addDoc,
  getDoc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";

type DriverStatus = "active" | "suspended" | "pending_approval";

interface Driver {
  id: string;
  name: string;
  email: string;
  modalidades: string[];
  serviceType: string;
  status: DriverStatus;
  registrationDate: string;
}

const clientsData = [
  { id: "CLI001", name: "Juan Perez", contact: "juan.p@example.com", serviceHistoryCount: 15 },
  { id: "CLI002", name: "Sofia Castillo", contact: "*******@example.com", serviceHistoryCount: 5 },
  { id: "CLI003", name: "Pedro Ramirez", contact: "+9876543210", serviceHistoryCount: 22 },
];

export default function UsersPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [sending, setSending] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, "drivers"), orderBy("registrationDate", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const driversData: Driver[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.fullName || "Sin nombre",
          email: data.email || "",
          modalidades: data.modalidades || (data.modality ? [data.modality] : []),
          serviceType: data.modalidades ? data.modalidades.join(", ") : data.modality || "N/A",
          status: data.status || "pending_approval",
          registrationDate:
            data.registrationDate?.toDate?.().toISOString().split("T")[0] || "N/A",
        };
      });
      setDrivers(driversData);
    });

    return () => unsubscribe();
  }, []);

  const enviarNotificacion = async (uid: string, title: string, message: string) => {
    await addDoc(collection(db, "notificaciones"), {
      uid,
      title,
      message,
      timestamp: serverTimestamp(),
      read: false,
    });
  };

  const handleEnviarDatosPago = async (driverId: string, driverName: string) => {
    setSending(driverId);
    try {
      const docRef = doc(db, "plataforma", "configuracion_pago");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const tarjeta = data.numeroTarjeta;
        const telefono = data.numeroTelefono;

        const mensaje = `Realiza el pago de inscripción mediante Transfermóvil.\n\n💳 Tarjeta: ${tarjeta}\n📱 Teléfono: ${telefono}`;
        await enviarNotificacion(driverId, "Datos para pago de inscripción", mensaje);

        toast({
          title: "Datos enviados",
          description: `Los datos de pago fueron enviados a ${driverName}.`,
        });
      } else {
        toast({
          title: "Falta configuración",
          description: "Aún no se han configurado los datos de pago en la plataforma.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo enviar los datos de pago.",
        variant: "destructive",
      });
    }
    setSending(null);
  };

  const handleDriverAction = async (driverId: string, action: "approve" | "toggle_suspend" | "exempt") => {
    const driverRef = doc(db, "drivers", driverId);
    const driver = drivers.find((d) => d.id === driverId);
    if (!driver) return;

    if (action === "approve") {
      await updateDoc(driverRef, { status: "active" });
      await enviarNotificacion(
        driverId,
        "Depósito aprobado",
        "Tu depósito ha sido aprobado. Ya puedes trabajar."
      );
      toast({ title: "Depósito aprobado", description: `El chófer ${driver.name} ahora está activo.` });
    }

    if (action === "toggle_suspend") {
      const newStatus = driver.status === "active" ? "suspended" : "active";
      await updateDoc(driverRef, { status: newStatus });
      await enviarNotificacion(
        driverId,
        newStatus === "active"
          ? "Reactivado"
          : "Suspendido",
        newStatus === "active"
          ? "Has sido reactivado. Puedes volver a trabajar."
          : "Has sido suspendido por incumplimiento de reglas."
      );
      toast({
        title: "Estado actualizado",
        description: `${driver.name} ha sido ${newStatus === "active" ? "reactivado" : "suspendido"}.`,
      });
    }

    if (action === "exempt") {
      await enviarNotificacion(
        driverId,
        "Comisión exenta",
        "Has sido exento del próximo cobro de comisión."
      );
      toast({
        title: "Exonerado",
        description: `Se ha exonerado a ${driver.name} del próximo cobro.`,
      });
    }
  };

  const getStatusBadge = (status: DriverStatus) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-500 hover:bg-green-600 text-white">
            <CheckCircle className="mr-1 h-3 w-3" />
            Activo
          </Badge>
        );
      case "suspended":
        return (
          <Badge variant="destructive">
            <XCircle className="mr-1 h-3 w-3" />
            Suspendido
          </Badge>
        );
      case "pending_approval":
        return (
          <Badge variant="secondary" className="bg-amber-500 hover:bg-amber-600 text-white">
            <Clock className="mr-1 h-3 w-3" />
            Pendiente
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <h1 className="text-3xl font-bold text-foreground mb-6">Directorio de Usuarios</h1>
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>Gestionar Usuarios</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar usuarios..." className="pl-10" />
            </div>
          </div>
          <CardDescription className="mt-2">
            Ver y gestionar información de conductores y clientes.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 overflow-auto max-h-[600px]">
          <Tabs defaultValue="drivers" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="drivers">
                <User className="mr-2 h-4 w-4" />
                Conductores
              </TabsTrigger>
              <TabsTrigger value="clients">
                <Briefcase className="mr-2 h-4 w-4" />
                Clientes
              </TabsTrigger>
            </TabsList>

            <TabsContent value="drivers" className="mt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Modalidades</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {drivers.map((driver) => (
                    <TableRow key={driver.id}>
                      <TableCell className="font-medium">{driver.id}</TableCell>
                      <TableCell>{driver.name}</TableCell>
                      <TableCell>{driver.email}</TableCell>
                      <TableCell>{driver.serviceType}</TableCell>
                      <TableCell>{getStatusBadge(driver.status)}</TableCell>
                      <TableCell className="text-right space-y-1 space-x-1">
                        {driver.status === "pending_approval" && (
                          <>
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => handleEnviarDatosPago(driver.id, driver.name)}
                              disabled={sending === driver.id}
                            >
                              <Send className="h-4 w-4 mr-2" />
                              {sending === driver.id ? "Enviando..." : "Enviar datos de pago"}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDriverAction(driver.id, "approve")}
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Aprobar Depósito
                            </Button>
                          </>
                        )}
                        {driver.status !== "pending_approval" && (
                          <Button
                            variant={driver.status === "active" ? "destructive" : "default"}
                            size="sm"
                            onClick={() => handleDriverAction(driver.id, "toggle_suspend")}
                            className={driver.status === "active" ? "" : "bg-green-500 hover:bg-green-600"}
                          >
                            {driver.status === "active" ? (
                              <XCircle className="h-4 w-4 mr-2" />
                            ) : (
                              <CheckCircle className="h-4 w-4 mr-2" />
                            )}
                            {driver.status === "active" ? "Suspender" : "Reactivar"}
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDriverAction(driver.id, "exempt")}
                        >
                          <DollarSign className="h-4 w-4 mr-2" />
                          Excusar Comisión
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="clients" className="mt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Contacto (Oculto)</TableHead>
                    <TableHead># Servicios Historial</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clientsData.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell className="font-medium">{client.id}</TableCell>
                      <TableCell>{client.name}</TableCell>
                      <TableCell>{client.contact}</TableCell>
                      <TableCell>{client.serviceHistoryCount}</TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button variant="ghost" size="icon" aria-label="Ver Cliente">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="icon" aria-label="Suspender Cliente">
                          <ShieldOff className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

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
