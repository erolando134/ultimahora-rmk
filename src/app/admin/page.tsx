"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Home,
  Users,
  Settings2,
  FileText,
  Lightbulb,
  ShieldCheck,
  ArrowLeft,
  Loader2,
  MessageSquare,
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

const adminSections = [
  {
    title: "Gestionar Usuarios",
    description: "Aprobar, suspender y gestionar chóferes y clientes.",
    href: "/admin/users", // <-- Aquí cambié la ruta para que siga la estructura
    icon: Users,
  },
  {
    title: "Ajustar Parámetros",
    description: "Configurar precios, reglas, bonificaciones y más.",
    href: "/parameters",
    icon: Settings2,
  },
  {
    title: "Ver Reportes",
    description: "Generar y consultar informes de la aplicación.",
    href: "/reports",
    icon: FileText,
  },
  {
    title: "Recomendaciones IA",
    description: "Obtener sugerencias para optimizar operaciones.",
    href: "/recommendations",
    icon: Lightbulb,
  },
  {
    title: "Gestionar Empleados",
    description: "Añadir o remover supervisores y otros roles.",
    href: "/admin/employees",
    icon: UserPlus,
  },
  {
    title: "Chat Interno",
    description: "Comunicación con el equipo de supervisores.",
    href: "/admin/internal-chat",
    icon: MessageSquare,
  },
  {
    title: "Gestionar Notificaciones",
    description: "Revisar y enviar notificaciones manuales.",
    href: "/admin/notificaciones",
    icon: ShieldCheck,
  },
  {
    title: "Solicitudes de Depósito",
    description: "Ver y responder solicitudes de inscripción.",
    href: "/admin/solicitudes",
    icon: ShieldCheck,
  },
];

export default function AdminPage() {
  const router = useRouter();
  const { user, isAdmin, loading, logout } = useAuth();

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push("/login");
    }
  }, [user, isAdmin, loading, router]);

  if (loading || !isAdmin) {
    return (
      <div className="container mx-auto py-10 px-4 flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">
          Verificando acceso de administrador...
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="text-center mb-12">
        <Image
          src="/logo.png"
          data-ai-hint="logo app"
          alt="Logo UltimaHora RMK"
          width={100}
          height={100}
          className="rounded-full mx-auto shadow-lg mb-4"
          unoptimized
        />
        <h1 className="text-4xl font-bold text-primary">
          Panel de Administración
        </h1>
        <p className="text-lg text-foreground/80 mt-2">
          Bienvenido, {user?.displayName || user?.email}. Desde aquí puedes
          gestionar toda la plataforma.
        </p>

        <Button
          variant="outline"
          onClick={async () => {
            await logout();
            router.push("/login");
          }}
          className="mt-4"
        >
          Cerrar sesión
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminSections.map((section) => (
          <Link href={section.href} key={section.title} passHref>
            <Card className="hover:shadow-xl hover:border-primary/50 transition-all duration-300 h-full flex flex-col cursor-pointer">
              <CardHeader className="flex-row items-center space-x-4 pb-4">
                <div className="p-3 rounded-full bg-primary/10 text-primary">
                  <section.icon className="h-8 w-8" />
                </div>
                <div>
                  <CardTitle className="text-xl text-primary">
                    {section.title}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex-grow pb-4">
                <CardDescription className="text-base text-foreground/70">
                  {section.description}
                </CardDescription>
              </CardContent>
              <CardFooter>
                <Button variant="link" className="text-primary p-0">
                  Acceder a {section.title} &rarr;
                </Button>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
