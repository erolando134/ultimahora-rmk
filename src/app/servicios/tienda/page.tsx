"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Home, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/navigation';

export default function TiendaPage() {
  const router = useRouter();
  return (
    <div className="space-y-6 p-4 md:p-6">
      <h1 className="text-3xl font-bold text-foreground flex items-center">
        <ShoppingBag className="mr-3 h-8 w-8" /> Tienda de Productos
      </h1>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Nuestros Productos</CardTitle>
          <CardDescription className="text-center">Explora los productos disponibles en la tienda de UltimaHora RMK.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <Card key={item} className="hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div 
                    className="aspect-video bg-muted rounded-md flex items-center justify-center mb-4 relative overflow-hidden"
                  >
                     <Image 
                        src={`https://placehold.co/300x200.png`} 
                        alt={`Producto ${item}`} 
                        fill
                        style={{ objectFit: 'cover' }}
                        data-ai-hint="producto mercancia"  
                     />
                  </div>
                  <CardTitle>Producto {item}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">Descripción breve del producto {item}. Ideal para conductores y clientes.</p>
                  <p className="text-lg font-semibold text-primary">$XX.XX</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="mt-6 text-center text-muted-foreground">
            Más productos próximamente...
          </p>
        </CardContent>
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
