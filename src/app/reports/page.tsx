"use client"; 

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Filter, LineChart, UserCheck, Landmark, CalendarDays, Home, ArrowLeft } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { es } from "date-fns/locale"; 
import Link from "next/link";
import { useRouter } from 'next/navigation';

interface ReportData {
  title: string;
  period: string;
  summary: string[];
  details?: Record<string, string | number>;
  chartData?: any[]; 
}

export default function ReportsPage() {
  const router = useRouter();
  const [reportType, setReportType] = useState<string>("operations");
  const [startDate, setStartDate] = useState<Date | undefined>(new Date(new Date().setDate(new Date().getDate() - 30)));
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [generatedReport, setGeneratedReport] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateReport = () => {
    setIsLoading(true);
    // Simulación de carga
    setTimeout(() => {
      const formattedStartDate = startDate ? format(startDate, "PPP", { locale: es }) : "N/D";
      const formattedEndDate = endDate ? format(endDate, "PPP", { locale: es }) : "N/D";
      let report: ReportData = {
        title: "Informe",
        period: `${formattedStartDate} - ${formattedEndDate}`,
        summary: ["No hay datos para los criterios seleccionados."],
      };

      // Datos de ejemplo para diferentes tipos de informe
      if (reportType === "operations") {
        report = {
          title: "Informe General de Operaciones",
          period: `${formattedStartDate} - ${formattedEndDate}`,
          summary: [
            "Servicios Totales Completados: 1,250",
            "Calificación Promedio de Servicio: 4.3 Estrellas",
            "Horas Pico de Servicio: 8 AM - 10 AM, 5 PM - 7 PM",
          ],
          details: { "Nuevas Registraciones de Usuarios": 75, "Tickets de Soporte Resueltos": 120 },
        };
      } else if (reportType === "driver_performance") {
        report = {
          title: "Informe de Desempeño de Conductores",
          period: `${formattedStartDate} - ${formattedEndDate}`,
          summary: [
            "Conductor con Mejor Desempeño: DRV001 (4.9 Estrellas)",
            "Viajes Promedio por Conductor: 25",
            "Comentarios Comunes: Comentarios positivos sobre profesionalismo.",
          ],
          details: { "Conductores con Bono": 15, "Conductores con Advertencias": 2 },
        };
      } else if (reportType === "financial") {
        report = {
          title: "Informe Resumen Financiero",
          period: `${formattedStartDate} - ${formattedEndDate}`,
          summary: [
            "Ingresos Totales: $15,750.00",
            "Comisiones Recaudadas: $1,575.00 (10%)",
            "Pagos a Conductores: $12,175.00",
          ],
          details: { "Valor Promedio de Transacción": "$12.60", "Tarifas de Procesamiento de Pago": "$315.00" },
        };
      }
      setGeneratedReport(report);
      setIsLoading(false);
    }, 1500);
  };

  useEffect(() => {
    // Generar un informe inicial al cargar la página
    handleGenerateReport();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // El array vacío asegura que esto solo se ejecute al montar


  return (
    <div className="space-y-6 p-4 md:p-6">
      <h1 className="text-3xl font-bold text-foreground mb-6">Generación de Informes</h1>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><Filter className="mr-2 h-5 w-5" />Filtros de Informe</CardTitle>
          <CardDescription className="mt-2">Seleccione criterios para generar un informe específico.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
          <div className="space-y-1">
            <Label htmlFor="report-type" className="mb-2 inline-block">Tipo de Informe</Label>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger id="report-type">
                <SelectValue placeholder="Seleccionar tipo de informe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="operations"><LineChart className="inline-block mr-2 h-4 w-4" />Operaciones Generales</SelectItem>
                <SelectItem value="driver_performance"><UserCheck className="inline-block mr-2 h-4 w-4" />Desempeño de Conductores</SelectItem>
                <SelectItem value="financial"><Landmark className="inline-block mr-2 h-4 w-4" />Datos Financieros</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="start-date" className="mb-2 inline-block">Fecha de Inicio</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="start-date"
                  variant={"outline"}
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarDays className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP", { locale: es }) : <span>Elegir una fecha</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                  locale={es}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-1">
            <Label htmlFor="end-date" className="mb-2 inline-block">Fecha de Fin</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="end-date"
                  variant={"outline"}
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarDays className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP", { locale: es }) : <span>Elegir una fecha</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                  locale={es}
                />
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
        <CardFooter className="pt-4">
          <Button onClick={handleGenerateReport} disabled={isLoading} className="btn-primary text-explicit-white">
            {isLoading ? "Generando..." : "Generar Informe"}
          </Button>
        </CardFooter>
      </Card>

      {isLoading && (
        <div className="flex justify-center items-center p-10">
          <LineChart className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-2 text-muted-foreground">Generando informe, por favor espere...</p>
        </div>
      )}

      {generatedReport && !isLoading && (
        <Card className="shadow-lg mt-6">
          <CardHeader className="flex flex-row justify-between items-start">
            <div>
              <CardTitle>{generatedReport.title}</CardTitle>
              <CardDescription className="mt-1">Período: {generatedReport.period}</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Descargar PDF
            </Button>
          </CardHeader>
          <CardContent className="pt-4">
            <h3 className="font-semibold mb-2 text-foreground">Resumen:</h3>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground mb-4">
              {generatedReport.summary.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            {generatedReport.details && (
              <>
                <h3 className="font-semibold mt-4 mb-2 text-foreground">Detalles Adicionales:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm text-muted-foreground">
                  {Object.entries(generatedReport.details).map(([key, value]) => (
                    <div key={key}><span className="font-medium text-foreground/80">{key}:</span> {value}</div>
                  ))}
                </div>
              </>
            )}
             {reportType === 'operations' && (
              <div className="mt-6">
                <h3 className="font-semibold mb-3 text-foreground">Gráfico General de Servicios</h3>
                <div className="h-64 w-full bg-muted rounded-md flex items-center justify-center text-muted-foreground" data-ai-hint="services barchart">
                  [Espacio para Gráfico de Barras de Servicios]
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
      <div className="mt-12 flex flex-col sm:flex-row justify-center items-center gap-4 border-t pt-8 pb-4">
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
