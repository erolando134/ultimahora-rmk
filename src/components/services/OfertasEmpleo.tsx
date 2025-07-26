'use client';

import React, { useState } from 'react';

type Oferta = {
  empresa: string;
  puesto: string;
  descripcion: string;
};

export default function OfertasEmpleo() {
  const [empresa, setEmpresa] = useState('');
  const [puesto, setPuesto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [ofertas, setOfertas] = useState<Oferta[]>([]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setOfertas((prev) => [
      ...prev,
      { empresa, puesto, descripcion }
    ]);
    setEmpresa('');
    setPuesto('');
    setDescripcion('');
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md mt-10">
      <h2 className="text-2xl font-bold text-yellow-600 mb-4">Ofertas de Empleo</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="empresa" className="block text-gray-700 mb-1">Nombre de la empresa</label>
          <input
            id="empresa"
            type="text"
            value={empresa}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmpresa(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="Ej: Taxi Express S.A."
            title="Nombre de la empresa"
            required
          />
        </div>

        <div>
          <label htmlFor="puesto" className="block text-gray-700 mb-1">Puesto disponible</label>
          <input
            id="puesto"
            type="text"
            value={puesto}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPuesto(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="Ej: Chofer urbano"
            title="Puesto disponible"
            required
          />
        </div>

        <div>
          <label htmlFor="descripcion" className="block text-gray-700 mb-1">Descripción del puesto</label>
          <textarea
            id="descripcion"
            value={descripcion}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescripcion(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="Ej: Se busca chofer con licencia actualizada..."
            title="Descripción del puesto"
            required
          />
        </div>

        <button type="submit" className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Publicar Oferta
        </button>
      </form>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-2 text-gray-800">Ofertas publicadas:</h3>
        <ul className="space-y-3">
          {ofertas.map((oferta, index) => (
            <li key={index} className="border p-4 rounded-lg bg-gray-50">
              <p><strong>Empresa:</strong> {oferta.empresa}</p>
              <p><strong>Puesto:</strong> {oferta.puesto}</p>
              <p><strong>Descripción:</strong> {oferta.descripcion}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
