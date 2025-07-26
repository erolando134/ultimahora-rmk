"use client";

import { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { actualizarEstadisticaCliente } from "@/lib/firebase/clienteStats";

type Usuario = {
  id: string;
  fullName: string;
  ci: string;
  phone: string;
  modality: string;
  status: string; // pending_approval | approved | suspended
};

type ClienteStats = {
  cantidadSolicitudes: number;
  modalidades: { [key: string]: number };
  ultimaSolicitud: any;
};

export default function UsersPage() {
  const [choferes, setChoferes] = useState<Usuario[]>([]);
  const [clientesStats, setClientesStats] = useState<Record<string, ClienteStats>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Escuchar choferes en tiempo real
    const q = query(collection(db, "drivers"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: Usuario[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        list.push({
          id: doc.id,
          fullName: data.fullName,
          ci: data.ci,
          phone: data.phone,
          modality: data.modality,
          status: data.status,
        });
      });
      setChoferes(list);
      setLoading(false);
    });

    // Obtener clientes stats una sola vez (no hay muchísimos datos)
    getDocs(collection(db, "clientStats")).then((snap) => {
      const stats: Record<string, ClienteStats> = {};
      snap.forEach((doc) => {
        stats[doc.id] = doc.data() as ClienteStats;
      });
      setClientesStats(stats);
    });

    return () => unsubscribe();
  }, []);

  async function cambiarEstadoChofer(id: string, nuevoEstado: string) {
    try {
      const ref = doc(db, "drivers", id);
      await updateDoc(ref, { status: nuevoEstado });
    } catch (error) {
      alert("Error al actualizar estado del chofer");
      console.error(error);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin h-10 w-10 text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Gestión de Usuarios</h1>

      <h2 className="text-2xl font-semibold mb-4">Chóferes</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {choferes.map((chofer) => (
          <Card key={chofer.id}>
            <CardHeader>
              <CardTitle>{chofer.fullName}</CardTitle>
              <CardDescription>
                Modalidad: {chofer.modality} | Estado: {chofer.status}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>CI: {chofer.ci}</p>
              <p>Teléfono: {chofer.phone}</p>
            </CardContent>
            <CardFooter className="flex space-x-2">
              {chofer.status !== "approved" && (
                <Button
                  variant="outline"
                  onClick={() => cambiarEstadoChofer(chofer.id, "approved")}
                >
                  Aprobar
                </Button>
              )}
              {chofer.status !== "suspended" && (
                <Button
                  variant="destructive"
                  onClick={() => cambiarEstadoChofer(chofer.id, "suspended")}
                >
                  Suspender
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      <h2 className="text-2xl font-semibold mt-10 mb-4">Estadísticas de Clientes</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(clientesStats).map(([telefono, stats]) => (
          <Card key={telefono}>
            <CardHeader>
              <CardTitle>Teléfono: {telefono}</CardTitle>
              <CardDescription>Cantidad solicitudes: {stats.cantidadSolicitudes}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Modalidades:</p>
              <ul className="list-disc list-inside">
                {Object.entries(stats.modalidades).map(([modalidad, cantidad]) => (
                  <li key={modalidad}>
                    {modalidad}: {cantidad}
                  </li>
                ))}
              </ul>
              <p>
                Última solicitud:{" "}
                {stats.ultimaSolicitud?.toDate
                  ? stats.ultimaSolicitud.toDate().toLocaleString()
                  : "No disponible"}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

