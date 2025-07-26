"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn, Mail, KeyRound, Loader2, AlertCircle, UserPlus, Shield } from "lucide-react";
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const { user, isAdmin, isSupervisor, login, loading: authLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      if (isAdmin) {
        router.push('/admin');
      } else if (isSupervisor) {
        router.push('/supervisor');
      } else {
        router.push('/choferes/chat');
      }
    }
  }, [user, isAdmin, isSupervisor, authLoading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setError(null);
    try {
      await login(email, password);
    } catch (err: any) {
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError("Correo o contraseña incorrectos. Por favor, inténtelo de nuevo.");
      } else {
        setError("Ocurrió un error inesperado al iniciar sesión.");
      }
      console.error(err);
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (authLoading || user) {
    return (
      <div className="container mx-auto py-10 px-4 flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4 flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <LogIn className="mx-auto h-12 w-12 text-primary mb-4" />
          <CardTitle className="text-2xl font-bold text-primary">Inicio de Sesión</CardTitle>
          <CardDescription className="mt-2">Ingrese sus credenciales para acceder a su panel.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email-login" className="flex items-center">
                <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                Correo Electrónico
              </Label>
              <Input
                id="email-login"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="su-correo@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password-login" className="flex items-center">
                <KeyRound className="mr-2 h-4 w-4 text-muted-foreground" />
                Contraseña
              </Label>
              <Input
                id="password-login"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="flex items-center p-3 text-sm rounded-md bg-destructive/10 text-destructive border border-destructive/20">
                <AlertCircle className="mr-2 h-4 w-4" />
                {error}
              </div>
            )}

            <Button type="submit" className="w-full btn-primary text-explicit-white" disabled={isLoggingIn}>
              {isLoggingIn ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isLoggingIn ? 'Ingresando...' : 'Ingresar'}
            </Button>
            <div className="text-center text-sm text-muted-foreground pt-4 border-t space-y-2">
              <div>
                <p>¿No tienes una cuenta de chófer?</p>
                <Link href="/choferes/registro?modalidad=taxi" className="inline-flex items-center underline text-primary mt-1">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Regístrate como chófer aquí
                </Link>
              </div>
              <div>
                <Link href="/admin/registro" className="inline-flex items-center underline text-primary mt-1 text-xs">
                  <Shield className="mr-2 h-3 w-3" />
                  Registrar cuenta de Administrador
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
