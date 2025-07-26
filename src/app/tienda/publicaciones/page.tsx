'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase/firebase';
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
  Timestamp,
} from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface Publicacion {
  id: string;
  titulo: string;
  descripcion: string;
  imagenes: string[];
  creadoEn: Timestamp;
  autor: string;
  telefono: string;
  estado: string;
}

export default function PublicacionesPage() {
  const [publicaciones, setPublicaciones] = useState<Publicacion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const obtenerPublicaciones = async () => {
      try {
        const publicacionesRef = collection(db, 'publicaciones');
        const q = query(publicacionesRef, where("estado", "==", "activo"));
        const snapshot = await getDocs(q);
        const activas: Publicacion[] = [];

        const ahora = Timestamp.now();
        const sieteDiasEnSegundos = 7 * 24 * 60 * 60;

        snapshot.forEach((docItem) => {
          const data = docItem.data() as Omit<Publicacion, 'id'>;
          const diferenciaSegundos = ahora.seconds - data.creadoEn.seconds;

          if (diferenciaSegundos <= sieteDiasEnSegundos) {
            activas.push({ ...data, id: docItem.id });
          }
        });

        setPublicaciones(activas);
      } catch (error) {
        console.error("Error al obtener publicaciones:", error);
      } finally {
        setLoading(false);
      }
    };

    obtenerPublicaciones();
  }, []);

  const marcarComoVendido = async (id: string) => {
    try {
      await updateDoc(doc(db, "publicaciones", id), {
        estado: "vendido",
      });

      toast({
        title: "✅ Publicación marcada como vendida",
        description: "La publicación fue retirada de la tienda.",
      });

      setPublicaciones(prev => prev.filter(pub => pub.id !== id));
    } catch (error) {
      console.error("Error al marcar como vendido:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado.",
        variant: "destructive",
      });
    }
  };

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center">Artículos Publicados</h1>

      {loading ? (
        <p className="text-center">Cargando publicaciones...</p>
      ) : publicaciones.length === 0 ? (
        <p className="text-center text-muted-foreground">No hay artículos activos en este momento.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {publicaciones.map((pub) => (
            <Card key={pub.id}>
              <CardHeader>
                <CardTitle>{pub.titulo}</CardTitle>
              </CardHeader>
              <CardContent>
                {pub.imagenes.length > 0 && (
                  <div className="mb-4">
                    <Image
                      src={pub.imagenes[0]}
                      alt={pub.titulo}
                      width={300}
                      height={200}
                      className="rounded object-cover w-full h-[200px]"
                    />
                  </div>
                )}
                <p className="text-sm text-muted-foreground mb-2">{pub.descripcion}</p>
                <p className="text-sm text-muted-foreground">📞 {pub.telefono}</p>
              </CardContent>
              <CardFooter className="pt-4 flex justify-center">
                <Button
                  variant="destructive"
                  onClick={() => marcarComoVendido(pub.id)}
                >
                  🔴 Marcar como vendido
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
