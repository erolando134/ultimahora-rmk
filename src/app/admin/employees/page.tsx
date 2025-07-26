"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Home, ArrowLeft, UserPlus, Trash2, Mail, KeyRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";

const employeesData = [
  { id: "EMP001", name: "Elena Ramos", email: "elena.r@example.com", role: "supervisor" },
  { id: "EMP002", name: "Marco Diaz", email: "marco.d@example.com", role: "supervisor" },
];

export default function EmployeesPage() {
  const router = useRouter();
  const { toast } = useToast();

  const handleInviteEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get("email");
    // En una app real, aquí llamarías a una Cloud Function para:
    // 1. Crear el usuario en Firebase Auth (o invitarlo).
    // 2. Establecer el custom claim (ej. { supervisor: true }).
    // 3. Guardar sus datos en una colección 'employees' en Firestore.
    toast({
      title: "Invitación Enviada (Simulación)",
      description: `Se ha enviado una invitación a ${email} para unirse como supervisor.`
    });
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <h1 className="text-3xl font-bold text-foreground mb-6">Gestionar Empleados</h1>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><UserPlus className="mr-2 h-5 w-5" />Invitar Nuevo Supervisor</CardTitle>
          <CardDescription>El nuevo supervisor recibirá un correo para establecer su contraseña y acceder a su panel.</CardDescription>
        </CardHeader>
        <form onSubmit={handleInviteEmployee}>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="employee-email">Correo Electrónico del Empleado</Label>
              <Input id="employee-email" name="email" type="email" placeholder="nuevo.supervisor@example.com" required />
            </div>
            <div className="space-y-2 self-end">
              <Button type="submit" className="w-full btn-primary text-explicit-white">Invitar Supervisor</Button>
            </div>
          </CardContent>
        </form>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Lista de Empleados</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employeesData.map((emp) => (
                <TableRow key={emp.id}>
                  <TableCell>{emp.id}</TableCell>
                  <TableCell>{emp.name}</TableCell>
                  <TableCell>{emp.email}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{emp.role}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="destructive" size="icon">
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Eliminar</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="mt-12 flex flex-col sm:flex-row justify-center items-center gap-4 border-t pt-8 pb-4">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Ir Atrás
        </Button>
        <Link href="/admin" passHref>
          <Button variant="outline">
            <Home className="mr-2 h-4 w-4" />
            Volver al Panel de Admin
          </Button>
        </Link>
      </div>
    </div>
  );
}
