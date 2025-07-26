"use client";

import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

// Definimos una interfaz para las propiedades que nuestro logo puede recibir
interface LogoProps {
  collapsed?: boolean;
  className?: string;
  showText?: boolean;
}

// Usamos la interfaz para definir las props del componente
export default function Logo({ collapsed = false, className, showText = true }: LogoProps) {
  return (
    <Link href="/" className={cn("flex items-center gap-2 px-2 py-4", className)}>
      <Image 
        src="/logo.png"
        alt="Logo UltimaHora RMK" 
        width={40} 
        height={40} 
        className="rounded-md animate-spin-y"
        data-ai-hint="logo app"
        unoptimized
      />
      {/* Usamos !collapsed y showText para decidir si mostrar el texto */}
      {!collapsed && showText && (
        <h1 className="text-xl font-bold text-sidebar-foreground whitespace-nowrap">
          UltimaHora
        </h1>
      )}
    </Link>
  );
}
