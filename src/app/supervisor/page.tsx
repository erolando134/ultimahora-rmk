"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Eye, Users, FileText, MessageSquare, ArrowLeft, Loader2, Lock } from "lucide-react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useAuth } from "@/hooks/useAuth";

const supervisorSections = [
  {
    title: "Ver Actividad de Usuarios",
    description: "Monitorear la actividad de chóferes y clientes en tiempo real.",
    href: "/users", // Can reuse the same page, but with restricted actions
    icon: Users,
  },
  {
    title: "Consultar Reportes",
    description: "Ver informes operativos y de desempeño. Datos financieros ocultos.",
    href: "/reports",
    icon: FileText,
  },
  {
    title: "Revisar Chats",
    description: "Monitorear conversaciones para asegurar la calidad del servicio.",
    href: "/choferes/chat", // Could be a read-only version
    icon: MessageSquare,
  },
   {
    title: "Parámetros (Solo Lectura)",
    description: "Consultar las reglas y tarifas actuales de la plataforma.",
    href: "/parameters",
    icon: Lock,
  },
];

export default function SupervisorPage() {
  const router = useRouter();
  const { user, isSupervisor, loading } = useAuth();

  useEffect(() => {
    if (!loading && !isSupervisor) {
      router.push('/login');
    }
  }, [user, isSupervisor, loading, router]);

  if (loading || !isSupervisor) {
    return (
      <div className="container mx-auto py-10 px-4 flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Verificando acceso de supervisor...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-primary">Panel de Supervisión</h1>
        <p className="text-lg text-foreground/80 mt-2">
          Bienvenido, Supervisor {user?.displayName || user?.email}.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {supervisorSections.map((section) => (
          <Link href={section.href} key={section.title} passHref>
            <Card className="hover:shadow-xl hover:border-primary/50 transition-all duration-300 h-full flex flex-col cursor-pointer">
              <CardHeader className="flex-row items-center space-x-4 pb-4">
                <div className="p-3 rounded-full bg-primary/10 text-primary">
                  <section.icon className="h-8 w-8" />
                </div>
                <div>
                  <CardTitle className="text-xl text-primary">{section.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex-grow pb-4">
                <CardDescription className="text-base text-foreground/70">{section.description}</CardDescription>
              </CardContent>
               <CardFooter>
                <Button variant="link" className="text-primary p-0">
                  Acceder &rarr;
                </Button>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
