"use client";
import { useEffect } from "react";

export default function RedirectChat() {
  useEffect(() => {
    window.location.href =
      "https://ultima-hora-cbf1jw07m-rolando-espinosas-projects.vercel.app/cliente/chat";
  }, []);

  return <p>Redirigiendo al chat…</p>;
}
