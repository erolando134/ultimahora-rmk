import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../src/lib/firebaseConfig';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  try {
    const { driverId, lat, lng } = req.body;

    if (!driverId || lat === undefined || lng === undefined) {
      return res.status(400).json({ message: 'Datos incompletos' });
    }

    const ref = doc(db, 'drivers', driverId);
    await updateDoc(ref, {
      ubicacion: {
        lat,
        lng,
        updatedAt: Date.now(),
      },
      lastUpdated: serverTimestamp(),
    });

    return res.status(200).json({ message: 'Ubicación actualizada correctamente' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
}
