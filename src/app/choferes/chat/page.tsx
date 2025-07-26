"use client";
import { useEffect } from "react";

export default function Redirect() {
  useEffect(() => {
    window.location.href =
      "https://ultima-hora-cbf1jw07m-rolando-espinosas-projects.vercel.app/CHOFER/RUTA";
  }, []);

  return <p>Redirigiendo…</p>;
}
