'use client';

import { useState, ChangeEvent, FormEvent } from 'react';

export default function ServicioEventual() {
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    fecha: '',
    descripcion: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Aquí puedes manejar el envío del formulario (por ejemplo, llamar una API o guardar datos)
    alert(`Solicitud enviada:\nNombre: ${formData.nombre}\nTeléfono: ${formData.telefono}\nFecha: ${formData.fecha}\nDescripción: ${formData.descripcion}`);
  };

  return (
    <div className="max-w-lg mx-auto p-6 text-black">
      <h1 className="text-2xl font-bold mb-4">Servicio Eventual</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label>
          Nombre:
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            className="w-full border border-gray-400 rounded px-3 py-2"
          />
        </label>

        <label>
          Teléfono:
          <input
            type="tel"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            required
            className="w-full border border-gray-400 rounded px-3 py-2"
          />
        </label>

        <label>
          Fecha del servicio:
          <input
            type="date"
            name="fecha"
            value={formData.fecha}
            onChange={handleChange}
            required
            className="w-full border border-gray-400 rounded px-3 py-2"
          />
        </label>

        <label>
          Descripción:
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            rows={4}
            className="w-full border border-gray-400 rounded px-3 py-2"
          />
        </label>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
        >
          Enviar Solicitud
        </button>
      </form>
    </div>
  );
}
