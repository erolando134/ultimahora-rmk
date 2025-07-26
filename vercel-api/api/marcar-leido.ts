import { NextRequest, NextResponse } from 'next/server';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import { initializeApp, getApps } from 'firebase/app';
import { firebaseConfig } from '../../src/lib/firebaseConfig';

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

export async function POST(req: NextRequest) {
  try {
    const { chatId } = await req.json();
    if (!chatId) return NextResponse.json({ error: "Falta chatId" }, { status: 400 });

    const chatRef = doc(db, "chats", chatId);
    await updateDoc(chatRef, { isUnread: false });

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
