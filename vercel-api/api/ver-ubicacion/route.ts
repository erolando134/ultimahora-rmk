import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const driverId = searchParams.get('driverId');

    if (!driverId) {
      return NextResponse.json({ error: 'Falta driverId' }, { status: 400 });
    }

    const ubicacionRef = doc(db, 'ubicaciones', driverId);
    const docSnap = await getDoc(ubicacionRef);

    if (!docSnap.exists()) {
      return NextResponse.json({ error: 'No se encontró ubicación' }, { status: 404 });
    }

    return NextResponse.json({ driverId, ...docSnap.data() });
  } catch (error) {
    console.error('[ver-ubicacion] Error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
