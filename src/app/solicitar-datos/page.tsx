'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function SolicitudPagoPage() {
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [tipo, setTipo] = useState('');
  const [modalidadPago, setModalidadPago] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Opciones de modalidades según tipo
  const modalidadesPorTipo: Record<string, { value: string; label: string }[]> = {
    'chofer-taxi': [
      { value: 'porcentaje', label: 'Porcentaje (10% de cada viaje)' },
      { value: 'tarifa-fija', label: 'Tarifa fija por viaje' },
    ],
    'chofer-carga': [
      { value: 'porcentaje', label: 'Porcentaje (10% de cada carga)' },
      { value: 'tarifa-fija', label: 'Tarifa fija por carga' },
    ],
    'chofer-interprovincial': [
      { value: 'porcentaje', label: 'Porcentaje (20% de cada viaje interprovincial)' },
      { value: 'tarifa-fija', label: 'Tarifa fija por viaje interprovincial' },
    ],
    'cliente-tienda': [
      { value: 'pago-por-envio', label: 'Pago por envío' },
      { value: 'suscripcion', label: 'Suscripción mensual' },
    ],
    'otro': [],
  };

  // Limpiar modalidadPago al cambiar tipo
  useEffect(() => {
    setModalidadPago('');
  }, [tipo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre || !telefono || !tipo) {
      toast({
        title: 'Faltan campos obligatorios',
        description: 'Completa todos los campos marcados.',
        variant: 'destructive',
      });
      return;
    }

    // Validar modalidad si aplica
    if (modalidadesPorTipo[tipo]?.length > 0 && !modalidadPago) {
      toast({
        title: 'Modalidad de pago requerida',
        description: 'Selecciona la modalidad de pago correspondiente.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      await addDoc(collection(db, 'solicitud-datos'), {
        nombre,
        telefono,
        tipo,
        modalidadPago: modalidadPago || null,
        mensaje,
        timestamp: Timestamp.now(),
        estado: 'pendiente',
      });

      toast({
        title: 'Solicitud enviada',
        description:
          'Tu solicitud fue recibida correctamente. Espera confirmación.',
      });

      router.push('/');
    } catch (error: any) {
      console.error(error);
      toast({
        title: 'Error al enviar',
        description: error.message || 'Algo salió mal.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">
            Solicitar datos para efectuar pago
          </CardTitle>
          <CardDescription>
            Selecciona el tipo de solicitud y completa tus datos para que
            podamos enviarte la información correspondiente.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Tu nombre completo"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
            <Input
              placeholder="Tu número de teléfono"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              required
            />
            <select
              aria-label="Tipo de solicitud"
              className="w-full border rounded-md p-2 text-sm"
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              required
            >
              <option value="">Selecciona tipo de solicitud</option>
              <option value="chofer-taxi">Chofer Local (Taxi)</option>
              <option value="chofer-carga">Chofer de Carga</option>
              <option value="chofer-interprovincial">
                Chofer Interprovincial
              </option>
              <option value="cliente-tienda">Cliente - Publicación Tienda</option>
              <option value="otro">Otro</option>
            </select>

            {/* Modalidad de pago, solo si hay opciones para el tipo */}
            {modalidadesPorTipo[tipo]?.length > 0 && (
              <select
                aria-label="Modalidad de pago"
                className="w-full border rounded-md p-2 text-sm"
                value={modalidadPago}
                onChange={(e) => setModalidadPago(e.target.value)}
                required
              >
                <option value="">Selecciona modalidad de pago</option>
                {modalidadesPorTipo[tipo].map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            )}

            <Textarea
              placeholder="Mensaje adicional (opcional)"
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              rows={4}
            />
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enviando...
                </>
              ) : (
                'Enviar solicitud'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
