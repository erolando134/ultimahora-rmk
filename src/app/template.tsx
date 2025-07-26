"use client";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import AppHeader from "@/components/AppHeader";
import { Toaster } from "@/components/ui/toaster";
import FCMHandler from "@/components/FCMHandler";
import { AuthProvider } from "@/hooks/useAuth";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <SidebarProvider defaultOpen>
        <div className="flex min-h-screen">
          <AppSidebar />
          <SidebarInset className="flex-1 flex flex-col bg-background/95 backdrop-blur-sm">
            <AppHeader />
            <main className="flex-1 p-4 md:p-6 overflow-auto">{children}</main>
          </SidebarInset>
        </div>
      </SidebarProvider>
      <Toaster />
      <FCMHandler />
    </AuthProvider>
  );
}
