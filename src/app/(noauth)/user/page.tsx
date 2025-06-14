"use client";

import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import Cookies from "js-cookie";
import { AlertTriangle, PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";

export default function UserPage() {
  const [empresa, setEmpresa] = useState("Empresa");

  useEffect(() => {
    const nombre = Cookies.get("empresaNombre");
    if (nombre) setEmpresa(nombre);
  }, []);

  const opciones = [
    {
      id: "incidencias",
      titulo: "Incidencias",
      descripcion: "Gestiona incidencias del sistema",
      detalle: "Administra el estado y seguimiento de las incidencias.",
      icono: <AlertTriangle className="h-6 w-6 text-red-600" />,
      ruta: "/incidence",
    },
    {
      id: "registrar",
      titulo: "Registrar Incidencia",
      descripcion: "Agrega una nueva incidencia",
      detalle: "Completa el formulario para registrar una nueva incidencia.",
      icono: <PlusCircle className="h-6 w-6 text-orange-500" />,
      ruta: "/incidence/register",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-24">
      <h1 className="text-3xl sm:text-4xl font-bold text-blue-700 mb-10 text-center">
        Panel de Usuario - {empresa}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {opciones.map((opcion) => (
          <Link key={opcion.id} href={opcion.ruta} aria-label={opcion.titulo}>
            <Card className="cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
              <CardHeader className="flex items-center gap-4">
                {opcion.icono}
                <div>
                  <CardTitle>{opcion.titulo}</CardTitle>
                  <CardDescription>{opcion.descripcion}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {opcion.detalle}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
