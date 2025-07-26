'use client';

import { useState } from 'react';

export default function ChatFlotante({ onClose }: { onClose: () => void }) {
  const [mensajes, setMensajes] = useState([
    { autor: 'bot', texto: '¡Hola compay! ¿En qué puedo ayudarte hoy?' }
  ]);
  const [entrada, setEntrada] = useState('');

  const enviarMensaje = () => {
    if (!entrada.trim()) return;

    setMensajes([
      ...mensajes,
      { autor: 'usuario', texto: entrada },
      { autor: 'bot', texto: 'Gracias por tu mensaje. Pronto te ayudaremos.' }
    ]);

    setEntrada('');
  };

  return (
    <div className="bg-white shadow-2xl rounded-lg p-4 max-w-[300px] w-full h-[360px] flex flex-col justify-between relative border border-gray-200">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-sm font-bold"
      >
        ❌
      </button>

      <div className="overflow-y-auto space-y-2 mb-4 pr-1 max-h-[250px]">
        {mensajes.map((msg, idx) => (
          <div
            key={idx}
            className={`text-sm p-2 rounded max-w-[90%] ${
              msg.autor === 'bot'
                ? 'bg-gray-100 text-black self-start'
                : 'bg-blue-600 text-white self-end'
            }`}
          >
            {msg.texto}
          </div>
        ))}
      </div>

      <div className="flex gap-2 mt-2">
        <input
          type="text"
          placeholder="Escribe tu mensaje"
          className="flex-1 border rounded px-2 py-1 text-sm"
          value={entrada}
          onChange={(e) => setEntrada(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && enviarMensaje()}
        />
        <button
          onClick={enviarMensaje}
          className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
        >
          Enviar
        </button>
      </div>
    </div>
  );
}
