"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import Logo from "@/components/common/Logo";
import {
  Home,
  ShoppingBag,
  UserPlus,
  Send,
  Truck,
  Car,
  Globe,
  MapPinned,
  Edit3,
  MessageSquare,
  Clock,
  ListChecks,
  CreditCard,
  Briefcase,
  Settings,
  FileText,
  Lightbulb,
  Users as UsersIcon,
  Shield,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const clientServiceNavItems = [
  { href: "/servicios/taxi-urbano", label: "Pedir Taxi", icon: Car },
  { href: "/servicios/mensajeria", label: "Pedir Mensajería", icon: Send },
  { href: "/servicios/carga", label: "Pedir Carga", icon: Truck },
  { href: "/servicios/viajes-interprovinciales", label: "Ver Viajes Interprov.", icon: Globe },
  { href: "/servicios/excursiones", label: "Ver Excursiones", icon: MapPinned },
  { href: "/servicios/lista-de-espera", label: "Lista de Espera", icon: ListChecks },
  { href: "/tienda", label: "Tienda", icon: ShoppingBag },
  { href: "/servicios/publicar-empleo-chofer", label: "Publicar Empleo Chófer", icon: UserPlus },
];

const driverNavItems = [
  { href: "/choferes/registro", label: "Inscribirse", icon: UserPlus },
  { href: "/choferes-eventuales", label: "Chófer Eventual", icon: Clock },
  { href: "/choferes/publicar-viaje", label: "Publicar Viaje/Excursión", icon: Edit3 },
  { href: "/choferes/publicar-lista-espera", label: "Publicar en Lista Espera", icon: ListChecks },
  { href: "/choferes/chat", label: "Ver Solicitudes", icon: MessageSquare },
  { href: "/choferes/recargar-saldo", label: "Recargar Saldo", icon: CreditCard },
  { href: "/choferes/ver-ofertas-empleo", label: "Ver Ofertas de Empleo", icon: Briefcase },
];

const adminNavItems = [
  { href: "/admin", label: "Panel de Admin", icon: Shield },
  { href: "/users", label: "Gestionar Usuarios", icon: UsersIcon },
  { href: "/parameters", label: "Ajustar Parámetros", icon: Settings },
  { href: "/reports", label: "Ver Reportes", icon: FileText },
  { href: "/recommendations", label: "Recomendaciones IA", icon: Lightbulb },
  { href: "/admin/employees", label: "Gestionar Empleados", icon: UserPlus },
  { href: "/admin/internal-chat", label: "Chat Interno", icon: MessageSquare },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar();
  const { isAdmin } = useAuth();
  const isCollapsed = state === "collapsed";

  const renderMenu = (items: any[], title: string) => (
    <SidebarMenu>
      <p className="px-4 py-2 mt-4 text-xs font-semibold text-sidebar-foreground/70 uppercase tracking-wider group-data-[collapsible=icon]:hidden">
        {title}
      </p>
      {items.map((item) => (
        <SidebarMenuItem key={item.href}>
          <Link href={item.href}>
            <SidebarMenuButton
              isActive={item.href === "/" ? pathname === item.href : pathname.startsWith(item.href)}
              tooltip={item.label}
              aria-label={item.label}
              className="text-explicit-white"
            >
              <item.icon className="h-5 w-5" />
              <span className={isCollapsed ? "sr-only" : ""}>{item.label}</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader>
        <Logo collapsed={isCollapsed} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <p className="px-4 py-2 text-xs font-semibold text-sidebar-foreground/70 uppercase tracking-wider group-data-[collapsible=icon]:hidden">
            Principal
          </p>
          <SidebarMenuItem>
            <Link href="/dashboard">
              <SidebarMenuButton
                isActive={pathname === "/dashboard"}
                tooltip="Panel Principal"
                aria-label="Panel Principal"
                className="text-explicit-white"
              >
                <Home className="h-5 w-5" />
                <span className={isCollapsed ? "sr-only" : ""}>Panel Principal</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>

        {isAdmin ? (
          <>
            <SidebarSeparator />
            {renderMenu(adminNavItems, "Administración")}
          </>
        ) : (
          <>
            <SidebarSeparator />
            {renderMenu(clientServiceNavItems, "Servicios Cliente")}
            <SidebarSeparator />
            {renderMenu(driverNavItems, "Para Chóferes")}
          </>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
