'use client';

import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";

export default function FormularioServicioEventual() {
  const [nombre, setNombre] = useState("");
  const [asientos, setAsientos] = useState(1);
  const [telefono, setTelefono] = useState("");
  const [enviando, setEnviando] = useState(false);
  const { toast } = useToast();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!nombre.trim() || !telefono.trim() || asientos < 1) {
      toast({
        title: "Campos incompletos",
        description: "Por favor completa todos los campos correctamente.",
        variant: "destructive",
      });
      return;
    }

    setEnviando(true);

    try {
      const solicitudesRef = collection(db, "solicitudes_eventuales");
      await addDoc(solicitudesRef, {
        nombre,
        asientos,
        telefono,
        creadoEn: Timestamp.now(),
        estado: "pendiente", // puedes usar para gestionar estado más adelante
      });

      toast({
        title: "Solicitud enviada",
        description: "Tu solicitud fue enviada correctamente.",
      });

      // Limpiar formulario
      setNombre("");
      setAsientos(1);
      setTelefono("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema enviando la solicitud.",
        variant: "destructive",
      });
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md w-full space-y-6 bg-gray-800 p-6 rounded-lg"
    >
      <div>
        <label className="block mb-1">Nombre Completo</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          className="w-full p-2 rounded text-black"
          placeholder="Tu nombre completo"
        />
      </div>
      <div>
        <label className="block mb-1">Cantidad de Asientos</label>
        <input
          type="number"
          value={asientos}
          min={1}
          onChange={(e) => setAsientos(Number(e.target.value))}
          required
          className="w-full p-2 rounded text-black"
          placeholder="Número de asientos"
        />
      </div>
      <div>
        <label className="block mb-1">Teléfono de Contacto</label>
        <input
          type="tel"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          required
          className="w-full p-2 rounded text-black"
          placeholder="Tu teléfono"
        />
      </div>

      <button
        type="submit"
        disabled={enviando}
        className="btn-primary w-full py-2 rounded"
      >
        {enviando ? "Enviando..." : "Enviar Solicitud"}
      </button>
    </form>
  );
}
