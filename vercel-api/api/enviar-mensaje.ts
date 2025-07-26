import { NextRequest, NextResponse } from 'next/server';
import { getFirestore, doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { initializeApp, getApps } from 'firebase/app';
import { firebaseConfig } from '../../src/lib/firebaseConfig';

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { chatId, text, sender = "driver" } = body;

    if (!chatId || !text) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
    }

    const chatRef = doc(db, "chats", chatId);
    const chatSnap = await getDoc(chatRef);

    if (!chatSnap.exists()) {
      return NextResponse.json({ error: "Chat no encontrado" }, { status: 404 });
    }

    const existingMessages = chatSnap.data()?.messages || [];
    const message = { sender, text, timestamp: Timestamp.now() };

    await updateDoc(chatRef, {
      messages: [...existingMessages, message],
      lastMessageSnippet: text,
      lastActivity: Timestamp.now(),
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Error interno:", e);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

