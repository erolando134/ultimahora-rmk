// app/choferes/layout.tsx
import type { Metadata } from "next";
import ActualizarUbicacionChofer from "./ubicacion/actualizar"; // Asegúrate que existe este archivo

export const metadata: Metadata = {
  title: "Panel de Chófer - UltimaHora RMK",
  description: "Panel exclusivo para chóferes de UltimaHora RMK.",
};

export default function ChoferLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ActualizarUbicacionChofer />
      {children}
    </>
  );
}
