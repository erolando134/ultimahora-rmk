// src/components/services/FormularioServicioEventual.tsx
'use client';

import React, { useState } from 'react';

export default function FormularioServicioEventual() {
  const [tipoEvento, setTipoEvento] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [detalles, setDetalles] = useState('');
  const [telefono, setTelefono] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Solicitud de servicio eventual:', { tipoEvento, fecha, hora, ubicacion, detalles, telefono });
    alert('Solicitud enviada con éxito.');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow-md max-w-md mx-auto mt-10 space-y-4"
    >
      <h2 className="text-2xl font-bold text-blue-600 mb-4">Servicio Eventual</h2>

      <div>
        <label htmlFor="tipoEvento" className="block text-gray-700 mb-1">Tipo de evento</label>
        <input
          id="tipoEvento"
          type="text"
          placeholder="Ej: Boda, fiesta, reunión"
          title="Tipo de evento"
          value={tipoEvento}
          onChange={(e) => setTipoEvento(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
          required
        />
      </div>

      <div>
        <label htmlFor="fecha" className="block text-gray-700 mb-1">Fecha</label>
        <input
          id="fecha"
          type="date"
          title="Fecha del evento"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
          required
        />
      </div>

      <div>
        <label htmlFor="hora" className="block text-gray-700 mb-1">Hora de salida</label>
        <input
          id="hora"
          type="time"
          title="Hora de salida"
          value={hora}
          onChange={(e) => setHora(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
          required
        />
      </div>

      <div>
        <label htmlFor="ubicacion" className="block text-gray-700 mb-1">Ubicación</label>
        <input
          id="ubicacion"
          type="text"
          placeholder="Lugar del evento"
          title="Ubicación"
          value={ubicacion}
          onChange={(e) => setUbicacion(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
          required
        />
      </div>

      <div>
        <label htmlFor="detalles" className="block text-gray-700 mb-1">Detalles adicionales</label>
        <textarea
          id="detalles"
          placeholder="Ej: Necesitamos 3 taxis para transportar a los invitados"
          title="Detalles adicionales"
          value={detalles}
          onChange={(e) => setDetalles(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
          rows={3}
        />
      </div>

      <div>
        <label htmlFor="telefono" className="block text-gray-700 mb-1">Teléfono de contacto</label>
        <input
          id="telefono"
          type="tel"
          placeholder="Ej: 555-1234"
          title="Teléfono"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
          required
        />
      </div>

      <button type="submit" className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
        Enviar Solicitud
      </button>
    </form>
  );
}
