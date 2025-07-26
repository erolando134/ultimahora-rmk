"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <ul className="flex space-x-4">
        <li>
          <Link href="/">
            <span className="cursor-pointer hover:underline">Inicio</span>
          </Link>
        </li>
        <li>
          <Link href="/servicios">
            <span className="cursor-pointer hover:underline">Servicios</span>
          </Link>
        </li>
        <li>
          <Link href="/contacto">
            <span className="cursor-pointer hover:underline">Contacto</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
