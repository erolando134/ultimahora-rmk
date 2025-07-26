// src/components/services/FormularioTaxiUrbano.tsx
'use client';

import React, { useState } from 'react';

export default function FormularioTaxiUrbano() {
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [passengers, setPassengers] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [phone, setPhone] = useState('');
  const [offer, setOffer] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Solicitud Taxi Urbano:', { pickup, dropoff, passengers, vehicleType, phone, offer });
    alert('Solicitud de Taxi Urbano enviada con éxito.');
    // Aquí agregar envío a backend o Firestore
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md max-w-md mx-auto mt-10 space-y-4">
      <h2 className="text-2xl font-bold text-green-600 mb-4">Solicitud Taxi Urbano</h2>

      <div>
        <label htmlFor="pickup" className="block text-gray-700 font-medium mb-1">Lugar de recogida:</label>
        <input
          id="pickup"
          type="text"
          placeholder="Introduce lugar de recogida"
          value={pickup}
          onChange={(e) => setPickup(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
          required
          title="Lugar donde deseas ser recogido"
        />
      </div>

      <div>
        <label htmlFor="dropoff" className="block text-gray-700 font-medium mb-1">Lugar de destino:</label>
        <input
          id="dropoff"
          type="text"
          placeholder="Introduce destino"
          value={dropoff}
          onChange={(e) => setDropoff(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
          required
          title="Destino donde deseas llegar"
        />
      </div>

      <div>
        <label htmlFor="passengers" className="block text-gray-700 font-medium mb-1">Número de pasajeros:</label>
        <input
          id="passengers"
          type="number"
          placeholder="Ejemplo: 1, 2, 3..."
          value={passengers}
          onChange={(e) => setPassengers(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
          min={1}
          required
          title="Cantidad de pasajeros"
        />
      </div>

      <div>
        <label htmlFor="vehicleType" className="block text-gray-700 font-medium mb-1">Tipo de vehículo:</label>
        <select
          id="vehicleType"
          value={vehicleType}
          onChange={(e) => setVehicleType(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
          required
          title="Selecciona el tipo de vehículo"
        >
          <option value="">Seleccione</option>
          <option value="auto">Auto</option>
          <option value="taxi">Taxi</option>
          <option value="van">Van</option>
          <option value="camioneta">Camioneta</option>
        </select>
      </div>

      <div>
        <label htmlFor="phone" className="block text-gray-700 font-medium mb-1">Teléfono de contacto:</label>
        <input
          id="phone"
          type="tel"
          placeholder="Ejemplo: +53 5xxxxxxx"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
          pattern="^\+?\d{7,15}$"
          required
          title="Número de teléfono válido"
        />
      </div>

      <div>
        <label htmlFor="offer" className="block text-gray-700 font-medium mb-1">Oferta de pago (opcional):</label>
        <input
          id="offer"
          type="text"
          placeholder="Indica tu oferta (si tienes)"
          value={offer}
          onChange={(e) => setOffer(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
          title="Puedes indicar un monto a pagar o dejar vacío"
        />
      </div>

      <button
        type="submit"
        className="w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
      >
        Enviar Solicitud
      </button>
    </form>
  );
}
