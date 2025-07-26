import { NextRequest, NextResponse } from 'next/server';
import { collection, doc, getDoc, updateDoc, Timestamp, getFirestore } from 'firebase/firestore';
import { initializeApp, getApps } from 'firebase/app';
import { firebaseConfig, db } from '../../src/lib/firebaseConfig';

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

export async function POST(req: NextRequest) {
  try {
    const { chatId, price = 0 } = await req.json();
    if (!chatId) return NextResponse.json({ error: "Falta chatId" }, { status: 400 });

    // Obtener la referencia a la colección chats
    const chatsCollection = collection(db, "chats");
    // Referencia al documento del chat
    const chatRef = doc(chatsCollection, chatId);

    const chatSnap = await getDoc(chatRef);
    if (!chatSnap.exists()) return NextResponse.json({ error: "Chat no encontrado" }, { status: 404 });

    const commission = price * 0.10;
    const existingMessages = chatSnap.data()?.messages || [];
    const message = {
      sender: "system",
      text: `Viaje TERMINADO. Comisión de ${commission.toFixed(2)} Bs. (10%) registrada.`,
      timestamp: Timestamp.now(),
    };

    await updateDoc(chatRef, {
      messages: [...existingMessages, message],
      isCompleted: true,
      isUnread: false,
      lastMessageSnippet: "Viaje Terminado.",
      lastActivity: Timestamp.now(),
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
