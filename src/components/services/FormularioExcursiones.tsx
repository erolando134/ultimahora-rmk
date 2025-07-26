// src/components/services/FormularioExcursionProgramada.tsx
'use client';

import React, { useState } from 'react';

export default function FormularioExcursionProgramada() {
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [passengerCount, setPassengerCount] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Solicitud de excursión enviada:', {
      pickup,
      destination,
      date,
      departureTime,
      passengerCount,
      phone,
    });
    alert('Solicitud de excursión enviada con éxito.');
    // Aquí puedes añadir el envío a backend o Firestore
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md max-w-md mx-auto mt-10 space-y-4">
      <h2 className="text-2xl font-bold text-purple-600 mb-4">Excursión Programada</h2>

      <div>
        <label htmlFor="pickup" className="block text-gray-700">Lugar de salida:</label>
        <input
          id="pickup"
          type="text"
          placeholder="Introduce lugar de salida"
          value={pickup}
          onChange={(e) => setPickup(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
          required
        />
      </div>

      <div>
        <label htmlFor="destination" className="block text-gray-700">Destino:</label>
        <input
          id="destination"
          type="text"
          placeholder="Introduce destino"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
          required
        />
      </div>

      <div>
        <label htmlFor="date" className="block text-gray-700">Fecha:</label>
        <input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
          required
        />
      </div>

      <div>
        <label htmlFor="departureTime" className="block text-gray-700">Hora de salida:</label>
        <input
          id="departureTime"
          type="time"
          value={departureTime}
          onChange={(e) => setDepartureTime(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
          required
        />
      </div>

      <div>
        <label htmlFor="passengerCount" className="block text-gray-700">Número de pasajeros:</label>
        <input
          id="passengerCount"
          type="number"
          min="1"
          placeholder="Cantidad de pasajeros"
          value={passengerCount}
          onChange={(e) => setPassengerCount(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
          required
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-gray-700">Teléfono de contacto:</label>
        <input
          id="phone"
          type="tel"
          placeholder="Número de teléfono"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
          required
        />
      </div>

      <button type="submit" className="w-full py-2 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
        Enviar Solicitud
      </button>
    </form>
  );
}
