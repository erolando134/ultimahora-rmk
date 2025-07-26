"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Car,
  Truck,
  Send,
  ShoppingCart,
  Globe,
  MapPinned,
  Briefcase,
  User,
  Users,
  Edit3,
  Clock,
  ListChecks,
  UserPlus,
  Bell,
} from "lucide-react";
import { useRouter } from "next/navigation";

const clientServices = [
  { name: "Taxis Urbanos", description: "Servicio de taxi rápido en la ciudad.", href: "/servicios/taxi-urbano", icon: Car },
  { name: "Mensajería Urbana", description: "Envío ágil de paquetes pequeños.", href: "/servicios/mensajeria", icon: Send },
  { name: "Servicio de Carga", description: "Transporte de mercancías y paquetes.", href: "/servicios/carga", icon: Truck },
  { name: "Viajes Interprovinciales", description: "Encuentra viajes publicados por chóferes.", href: "/servicios/viajes-interprovinciales", icon: Globe },
  { name: "Excursiones Programadas", description: "Descubre destinos con tours organizados.", href: "/servicios/excursiones", icon: MapPinned },
  { name: "Lista de Espera", description: "Viajes inmediatos disponibles ahora.", href: "/servicios/lista-de-espera", icon: ListChecks },
  { name: "Tienda", description: "Vehículos, piezas y partes.", href: "/tienda", icon: ShoppingCart },
  { name: "Publicar Oferta de Empleo para Chófer", description: "Encuentra conductores para tus necesidades.", href: "/servicios/publicar-empleo-chofer", icon: UserPlus },
];

const driverServices = [
  { name: "Choferes Locales (Taxi)", modality: "taxi", description: "Inscríbete para ofrecer taxis.", href: "/choferes/registro?modalidad=taxi", icon: Car },
  { name: "Choferes de Mensajería", modality: "mensajeria", description: "Inscríbete para realizar entregas.", href: "/choferes/registro?modalidad=mensajeria", icon: Send },
  { name: "Choferes de Carga", modality: "carga", description: "Inscríbete para transportar mercancías.", href: "/choferes/registro?modalidad=carga", icon: Truck },
  { name: "Choferes Interprovinciales", modality: "interprovincial", description: "Publica y gestiona viajes interprovinciales.", href: "/choferes/registro?modalidad=interprovincial", icon: Globe },
  { name: "Choferes de Excursiones", modality: "excursiones", description: "Organiza y ofrece excursiones.", href: "/choferes/registro?modalidad=excursiones", icon: MapPinned },
  { name: "Choferes de Lista de Espera", modality: "lista_espera", description: "Ofrece viajes inmediatos.", href: "/choferes/registro?modalidad=lista_espera", icon: ListChecks },
  { name: "Chófer Eventual (Temporal)", modality: "eventual", description: "Servicios temporales pagando una tarifa.", href: "/choferes-eventuales", icon: Clock },
  { name: "Publicar en Lista de Espera", modality: "publicar_lista_espera", description: "Ofrece un viaje para ahora.", href: "/choferes/publicar-lista-espera", icon: Edit3 },
  { name: "Ver Ofertas de Empleo", modality: "ver_ofertas_empleo", description: "Encuentra oportunidades laborales.", href: "/choferes/ver-ofertas-empleo", icon: Briefcase },
  { name: "Tienda para Chóferes", modality: "tienda", description: "Accede a productos y repuestos.", href: "/tienda", icon: ShoppingCart },
];

export default function DashboardPage() {
  const router = useRouter();

  const handleRequestFcmPermission = () => {
    if (typeof window !== "undefined" && (window as any).requestFcmPermission) {
      (window as any).requestFcmPermission();
    } else {
      console.warn("FCM permission function not available.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center p-4 md:p-8 pt-10 md:pt-16 min-h-[calc(100vh-4rem)]">
      <div className="mb-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-primary drop-shadow-md">
          Panel de Control
        </h1>
        <p className="text-lg text-foreground/80 mt-2">
          Tu solución integral de transporte.
        </p>
      </div>

      <div className="w-full max-w-2xl space-y-4 my-8">
        {/* Servicios para clientes */}
        <Accordion type="single" collapsible className="w-full bg-card text-card-foreground rounded-lg shadow-md">
          <AccordionItem value="client-services">
            <AccordionTrigger className="text-xl font-semibold px-6 py-4 hover:bg-accent/10 rounded-t-lg data-[state=open]:rounded-b-none group">
              <span className="flex items-center text-primary">
                <Users className="mr-3 h-6 w-6" />
                ¿Qué necesitas hoy? (Clientes)
              </span>
            </AccordionTrigger>
            <AccordionContent className="p-4 sm:p-6 bg-card rounded-b-lg">
              <ul className="space-y-4 text-left">
                {clientServices.map((service) => (
                  <li key={service.href}>
                    <Link href={service.href} className="flex items-start space-x-4 p-3 rounded-md hover:bg-muted/50 transition-colors">
                      <service.icon className="h-6 w-6 mt-1 text-primary shrink-0" />
                      <div>
                        <h3 className="font-semibold text-md text-foreground">{service.name}</h3>
                        <p className="text-sm text-muted-foreground">{service.description}</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Servicios para chóferes */}
        <Accordion type="single" collapsible className="w-full bg-card text-card-foreground rounded-lg shadow-md">
          <AccordionItem value="driver-services">
            <AccordionTrigger className="text-xl font-semibold px-6 py-4 hover:bg-accent/10 rounded-t-lg data-[state=open]:rounded-b-none group">
              <span className="flex items-center text-primary">
                <User className="mr-3 h-6 w-6" />
                ¿Eres Conductor? Explora Opciones
              </span>
            </AccordionTrigger>
            <AccordionContent className="p-4 sm:p-6 bg-card rounded-b-lg">
              <p className="text-left text-muted-foreground mb-4">
                Inscríbete en la modalidad que prefieras o gestiona tus servicios desde aquí.
              </p>
              <ul className="space-y-4 text-left">
                {driverServices.map((service) => (
                  <li key={service.modality}>
                    <Link href={service.href} className="flex items-start space-x-4 p-3 rounded-md hover:bg-muted/50 transition-colors">
                      <service.icon className="h-6 w-6 mt-1 text-primary shrink-0" />
                      <div>
                        <h3 className="font-semibold text-md text-foreground">{service.name}</h3>
                        <p className="text-sm text-muted-foreground">{service.description}</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:space-x-4 items-center">
        <Link href="/admin">
          <Button size="lg" className="btn-primary px-10 py-3 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-shadow text-explicit-white">
            Acceder como Administrador
          </Button>
        </Link>
        <Button
          size="lg"
          variant="outline"
          onClick={handleRequestFcmPermission}
          className="px-10 py-3 text-lg font-semibold rounded-lg shadow-lg"
        >
          <Bell className="mr-2 h-5 w-5" />
          Activar Notificaciones
        </Button>
      </div>
    </div>
  );
}
