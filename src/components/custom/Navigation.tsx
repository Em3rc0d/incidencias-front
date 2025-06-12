"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

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
    <nav className="bg-blue-600 text-white px-6 py-4 shadow-lg fixed top-0 w-full z-50 backdrop-blur">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-semibold tracking-wide">Mi App</h1>

        <button
          className="md:hidden p-2 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>

        <ul className="hidden md:flex gap-6 items-center text-sm font-medium">
          <CommonLinks role={role} />
        </ul>
      </div>

      {/* Menú móvil */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? "max-h-[500px] mt-4" : "max-h-0"
        }`}
      >
        <ul className="flex flex-col gap-4 text-base font-medium">
          <CommonLinks role={role} />
        </ul>
      </div>
    </nav>
  );
}

function CommonLinks({ role }: { role: string }) {
  const router = useRouter();

  const handleLogout = () => {
    document.cookie = "role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    router.push("/");
  };

  return (
    <>
      <NavItem href="/admin" label="Inicio" />
      <NavItem href="/incidence" label="Incidencias" />

      {role === "ADMIN" && (
        <>
          <NavItem href="/incidence/affected" label="Afectados" />
          <NavItem
            href="/incidence/affected/reports"
            label="Reporte de Afectados"
          />
          <NavItem href="/admin/vehicle" label="Vehículos" />
          <NavItem href="/admin/vehicle/assign" label="Asignar Vehículo" />
          <NavItem href="/admin/personal" label="Gestionar Personal" />
        </>
      )}

      {role === "user" && (
        <NavItem href="/incidence/affected" label="Afectados" />
      )}

      <li>
        <Button
          onClick={handleLogout}
          className="bg-white text-blue-600 hover:bg-gray-100 transition-all"
        >
          Cerrar Sesión
        </Button>
      </li>
    </>
  );
}

function NavItem({ href, label }: { href: string; label: string }) {
  return (
    <li>
      <Link
        href={href}
        className="hover:underline underline-offset-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        {label}
      </Link>
    </li>
  );
}
