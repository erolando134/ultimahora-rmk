"use client";

import dynamic from "next/dynamic";

const DynamicMapaAdmin = dynamic(() => import("./MapaAdminCliente"), {
  ssr: false,
});

export default function AdminMapaPage() {
  return (
    <div className="h-screen w-full">
      <DynamicMapaAdmin />
    </div>
  );
}
