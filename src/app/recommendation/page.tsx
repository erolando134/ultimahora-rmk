"use client";

import RecommendationForm from "./recommendation-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";
import { useRouter } from 'next/navigation';

export default function RecommendationsPage() {
  const router = useRouter();
  return (
    <div className="space-y-6 p-4 md:p-6">
      <h1 className="text-3xl font-bold text-foreground">Recomendaciones Potenciadas por IA</h1>
      <RecommendationForm />
      <div className="mt-12 flex flex-col sm:flex-row justify-center items-center gap-4 border-t pt-6">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Ir Atrás
        </Button>
        <Link href="/" passHref>
          <Button variant="outline">
            <Home className="mr-2 h-4 w-4" />
            Volver al Inicio
          </Button>
        </Link>
      </div>
    </div>
  );
}
