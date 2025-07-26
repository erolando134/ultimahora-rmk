"use client";

import { useFormStatus } from "react-dom";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Lightbulb, Sparkles } from "lucide-react";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto btn-primary text-explicit-white mt-2">
      {pending ? "Generando..." : <> <Sparkles className="mr-2 h-4 w-4" /> Obtener Recomendaciones</>}
    </Button>
  );
}

export default function RecommendationForm() {
  // Esta función de ejemplo no hace nada real
  function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    alert("Esto es una vista de ejemplo. Las recomendaciones IA están desactivadas por el modo export.");
  }

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl text-foreground">
            <Lightbulb className="mr-2 h-6 w-6 text-accent" />
            Motor de Recomendaciones (Vista de Demostración)
          </CardTitle>
          <CardDescription className="mt-2">
            Esta versión estática no incluye procesamiento IA. Solo muestra la interfaz.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleFormSubmit} className="space-y-6">
            <div className="space-y-1">
              <Label htmlFor="historicalDataSummary" className="text-lg font-medium mb-2 inline-block">
                Resumen de Datos Históricos
              </Label>
              <Textarea
                id="historicalDataSummary"
                name="historicalDataSummary"
                placeholder="Escribe aquí un resumen de comportamiento de los viajes..."
                rows={8}
                className="text-sm"
                required
              />
            </div>
            <SubmitButton />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
