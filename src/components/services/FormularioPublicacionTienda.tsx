'use client';

import React, { useState } from 'react';

export default function FormularioPublicacionTienda() {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [foto, setFoto] = useState<File | null>(null);
  const [telefono, setTelefono] = useState('');
  const [ubicacion, setUbicacion] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Aquí puedes subir el archivo y guardar la info a Firestore si lo deseas
    console.log({
      titulo,
      descripcion,
      telefono,
      ubicacion,
      foto,
    });

    alert('Publicación enviada correctamente. Será visible durante 15 días.');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow-md max-w-md mx-auto mt-10 space-y-4"
    >
      <h2 className="text-2xl font-bold text-green-700 mb-4">Publicar artículo en la Tienda</h2>

      <p className="text-sm text-gray-600">
        📌 Solo se aceptan publicaciones relacionadas con <strong>partes y piezas de autos</strong>.
        <br />
        💰 La publicación tendrá una duración de <strong>15 días</strong> y un costo de <strong>50 CUP</strong> por artículo.
        <br />
        🔁 Para mantenerla activa, deberá renovar el pago después de ese plazo.
        <br />
        💳 El pago debe realizarse a la tarjeta: <strong>XXXX-XXXX-XXXX-1234</strong> (definir el número real).
      </p>

      <div>
        <label htmlFor="titulo" className="block text-gray-700 font-semibold">Título del artículo:</label>
        <input
          id="titulo"
          type="text"
          placeholder="Ej. Bomba de gasolina Toyota"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
          required
        />
      </div>

      <div>
        <label htmlFor="descripcion" className="block text-gray-700 font-semibold">Descripción:</label>
        <textarea
          id="descripcion"
          placeholder="Detalles del artículo, estado, compatibilidad, etc."
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
          required
        />
      </div>

      <div>
        <label htmlFor="foto" className="block text-gray-700 font-semibold">Foto del artículo:</label>
        <input
          id="foto"
          type="file"
          accept="image/*"
          onChange={(e) => setFoto(e.target.files?.[0] || null)}
          className="w-full"
          required
        />
      </div>

      <div>
        <label htmlFor="telefono" className="block text-gray-700 font-semibold">Teléfono de contacto:</label>
        <input
          id="telefono"
          type="tel"
          placeholder="Ej. 5XXXXXXX"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
          required
        />
      </div>

      <div>
        <label htmlFor="ubicacion" className="block text-gray-700 font-semibold">Ubicación:</label>
        <input
          id="ubicacion"
          type="text"
          placeholder="Ciudad o municipio"
          value={ubicacion}
          onChange={(e) => setUbicacion(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full py-2 px-4 bg-green-700 text-white rounded-lg hover:bg-green-800"
      >
        Publicar en la tienda
      </button>
    </form>
  );
}
