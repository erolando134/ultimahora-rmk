'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  addDoc,
  query,
  where,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Mensaje {
  texto: string;
  enviadoPor: 'cliente' | 'chofer';
  creadoEn: Date;
}

export default function ChatServicio() {
  const { id } = useParams(); // id del servicio aceptado
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const [rol, setRol] = useState<'cliente' | 'chofer'>('chofer');

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'servicios', id as string, 'chat'),
      (snap) => {
        const msgs = snap.docs.map((doc) => doc.data() as Mensaje);
        setMensajes(msgs.sort((a, b) => a.creadoEn.getTime() - b.creadoEn.getTime()));
      }
    );
    return () => unsub();
  }, [id]);

  const enviarMensaje = async () => {
    if (!nuevoMensaje.trim()) return;
    await addDoc(collection(db, 'servicios', id as string, 'chat'), {
      texto: nuevoMensaje,
      enviadoPor: rol,
      creadoEn: new Date(),
    });
    setNuevoMensaje('');
  };

  return (
    <div className="max-w-2xl mx-auto py-6 px-4">
      <h2 className="text-xl font-bold mb-4">Chat del Servicio</h2>

      <div className="border rounded-md p-4 h-96 overflow-y-auto bg-white">
        {mensajes.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-2 p-2 rounded-md text-sm w-fit max-w-xs ${
              msg.enviadoPor === 'chofer' ? 'bg-blue-100 ml-auto' : 'bg-gray-100'
            }`}
          >
            <span className="block">{msg.texto}</span>
            <span className="block text-[10px] text-muted-foreground mt-1">
              {msg.enviadoPor === 'chofer' ? 'Tú' : 'Cliente'}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        <Input
          value={nuevoMensaje}
          onChange={(e) => setNuevoMensaje(e.target.value)}
          placeholder="Escribe tu mensaje"
        />
        <Button onClick={enviarMensaje}>Enviar</Button>
      </div>
    </div>
  );
}
