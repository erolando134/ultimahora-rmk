'use client';

import React, { useState } from 'react';
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';
import { getApp, getApps, initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_AUTH_DOMAIN",
  projectId: "TU_PROJECT_ID",
  // agrega los campos necesarios según tu configuración
};

if (!getApps().length) {
  initializeApp(firebaseConfig);
}
const db = getFirestore();

// Tipado para los campos del formulario
type FormFields = {
  nombre: string;
  telefono: string;
  lugarSalida: string;
  destino: string;
  horario: string;
  capacidad: string;
  precio: string;
};

export default function FormularioListaEspera() {
  const [formData, setFormData] = useState<FormFields>({
    nombre: '',
    telefono: '',
    lugarSalida: '',
    destino: '',
    horario: '',
    capacidad: '',
    precio: '',
  });

  const [mensaje, setMensaje] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, 'lista-espera-viajes'), {
        ...formData,
        creadoEn: Timestamp.now(),
        tipo: 'chofer-interprovincial',
        estado: 'pendiente',
        confirmacion: 'CONFIRMADO',
      });
      setMensaje('✅ Viaje publicado con éxito.');
      setFormData({
        nombre: '',
        telefono: '',
        lugarSalida: '',
        destino: '',
        horario: '',
        capacidad: '',
        precio: '',
      });
    } catch (err) {
      console.error(err);
      setMensaje('❌ Error al publicar el viaje.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold text-yellow-600 mb-4">
        Publicar viaje en Lista de Espera
      </h2>

      {(
        [
          { name: 'nombre', label: 'Nombre del Chofer' },
          { name: 'telefono', label: 'Teléfono' },
          { name: 'lugarSalida', label: 'Lugar de Salida' },
          { name: 'destino', label: 'Destino' },
          { name: 'horario', label: 'Horario de Salida' },
          { name: 'capacidad', label: 'Capacidad (cupos)' },
          { name: 'precio', label: 'Precio por cupo (CUP)' },
        ] as const
      ).map(({ name, label }) => (
        <div key={name} className="mb-3">
          <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
          <input
            id={name}
            name={name}
            type="text"
            value={formData[name]}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>
      ))}

      <button
        type="submit"
        className="w-full bg-yellow-600 text-white py-2 rounded hover:bg-yellow-700"
      >
        Publicar
      </button>

      {mensaje && <p className="mt-4 text-center text-green-600">{mensaje}</p>}
    </form>
  );
}
