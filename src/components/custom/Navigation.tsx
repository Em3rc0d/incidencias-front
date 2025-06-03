"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [role, setRole] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const match = document.cookie.match(/(?:^|; )role=([^;]*)/);
    setRole(match?.[1] || null);
  }, []);

  if (role === null) return null;

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-blue-600 text-white px-6 py-4 shadow-md fixed top-0 w-full z-50">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Mi App</h1>

        {/* Botón hamburguesa móvil */}
        <button
          className="md:hidden"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Menú en pantallas medianas y grandes */}
        <ul className="hidden md:flex gap-6">
          <CommonLinks role={role} />
        </ul>
      </div>

      {/* Menú desplegable para móviles */}
      {isOpen && (
        <ul className="md:hidden mt-4 flex flex-col gap-4">
          <CommonLinks role={role} />
        </ul>
      )}
    </nav>
  );
}

// Componente separado para mantener limpio el render
function CommonLinks({ role }: { role: string }) {
  return (
    <>
      <li>
        <Link href="/incidence/register" className="hover:underline">
          Inicio
        </Link>
      </li>
      <li>
        <Link href="/incidence" className="hover:underline">
          Incidencias
        </Link>
      </li>

      {role === "admin" && (
        <>
          <li>
            <Link href="incidence/affected" className="hover:underline">
              Afectados
            </Link>
          </li>
          <li>
            <Link href="affected/reports" className="hover:underline">
              Reporte de afectados
            </Link>
          </li>
          <li>
            <Link href="/admin/vehicle" className="hover:underline">
              Vehículos
            </Link>
          </li>
          <li>
            <Link href="/admin/vehicle/assign" className="hover:underline">
              Asignar vehículo
            </Link>
          </li>
        </>
      )}

      {role === "user" && (
        <li>
          <Link href="incidence/affected" className="hover:underline">
            Afectados
          </Link>
        </li>
      )}
    </>
  );
}
