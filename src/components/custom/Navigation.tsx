"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function Navbar() {
  const [role, setRole] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [empresaNombre, setEmpresaNombre] = useState("");
  const [mounted, setMounted] = useState(false); // Para esperar el montaje

  useEffect(() => {
    const match = Cookies.get("role");
    const nombre = Cookies.get("empresaNombre");

    if (match) setRole(match);
    if (nombre) setEmpresaNombre(nombre);
    else setEmpresaNombre("");

    setMounted(true); // Ya está montado, se puede mostrar contenido dinámico
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  if (!mounted) return null; // Esperar a que el componente se monte para evitar errores de hidratación

  return (
    <nav className="bg-blue-600 text-white px-6 py-4 shadow-lg fixed top-0 w-full z-50 backdrop-blur">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-semibold tracking-wide">
          {empresaNombre || "Empresa"}
        </h1>

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
    // Limpiar localStorage
    localStorage.removeItem("userId");
    localStorage.removeItem("empresaNombre");
    localStorage.removeItem("empresaId");
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");

    // Limpiar cookies individualmente
    const cookiesToDelete = [
      "userId",
      "empresaNombre",
      "empresaId",
      "token",
      "username",
      "role",
    ];

    cookiesToDelete.forEach((name) => {
      document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
    });

    // Redirigir al login
    router.push("/login");
  };

  return (
    <>
      {role === "ADMIN" && (
        <>
          <NavItem href="/admin" label="Inicio" />
          <NavItem href="/incidence" label="Incidencias" />
          <NavItem href="/incidence/affected" label="Afectados" />
          <NavItem
            href="/incidence/affected/reports"
            label="Reportes a Aseguradora"
          />
          <NavItem href="/admin/vehicle" label="Vehículos" />
          <NavItem href="/admin/vehicle/assign" label="Asignar Vehículo" />
          <NavItem href="/admin/personal" label="Gestionar Personal" />
        </>
      )}

      {role != "ADMIN" && (
        <>
          <NavItem href="/user" label="Inicio" />
          <NavItem href="/incidence" label="Incidencias" />
        </>
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
