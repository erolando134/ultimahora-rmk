"use client";

import { useEffect } from "react";

export default function RedirectToVercel() {
  useEffect(() => {
    window.location.href =
      "https://ultima-hora-cbf1jw07m-rolando-espinosas-projects.vercel.app/servicios/modo";
  }, []);

  return <p>Redirigiendo a servicios en Vercel…</p>;
}
