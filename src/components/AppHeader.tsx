"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Bell, UserCircle, LogIn, LogOut } from "lucide-react";
import Logo from "@/components/common/Logo";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AppHeader() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/80 backdrop-blur-sm px-6 shrink-0">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="md:hidden" />
        <h1 className="text-lg font-semibold text-foreground">
          {/* El título puede ser dinámico según la página */}
        </h1>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" aria-label="Notificaciones">
          <Bell className="h-5 w-5" />
        </Button>
        {user ? (
          <>
            <Button variant="ghost" size="icon" aria-label="Perfil de Usuario">
              <UserCircle className="h-6 w-6" />
            </Button>
            <Button variant="ghost" size="icon" aria-label="Cerrar Sesión" onClick={handleLogout}>
              <LogOut className="h-6 w-6" />
            </Button>
          </>
        ) : (
          <Link href="/login" passHref>
            <Button variant="ghost" size="icon" aria-label="Iniciar Sesión">
              <LogIn className="h-6 w-6" />
            </Button>
          </Link>
        )}
        <Logo showText={false} className="py-0 px-0"/>
      </div>
    </header>
  );
}

