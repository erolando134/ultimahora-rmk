import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Image from "next/image";

export const metadata: Metadata = {
  title: "UltimaHora RMK - Panel de Administración",
  description: "Panel de administración para la aplicación UltimaHora RMK.",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.png",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "hsl(50 100% 92%)",
};

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable}`}>
      <body className="font-sans antialiased relative">
        {/* Marca de agua (no depende de hooks ni cliente) */}
        <div className="fixed inset-0 z-[-1]">
          <Image
            alt="Marca de agua del logo de UltimaHora RMK"
            src="/logo.png"
            fill
            style={{ objectFit: "cover", opacity: 0.1 }}
            data-ai-hint="logo app watermark"
            unoptimized
          />
        </div>
        {children}
      </body>
    </html>
  );
}
