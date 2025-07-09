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
import {
  Users,
  FileBarChart2,
  Car,
  AlertTriangle,
  PlusCircle,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function AdminPage() {
  const [empresa, setEmpresa] = useState("Empresa");

  useEffect(() => {
    const nombre = Cookies.get("empresaNombre");
    if (nombre) setEmpresa(nombre);
  }, []);

  const opciones = [
    {
      titulo: "Usuarios",
      descripcion: "Gestiona usuarios del sistema",
      detalle: "Administra roles, permisos y perfiles de usuarios.",
      icono: <Users className="h-6 w-6 text-blue-600" />,
      ruta: "/admin/personal",
    },
    {
      titulo: "Reportes",
      descripcion: "Visualiza reportes y estadísticas",
      detalle: "Accede a informes detallados del sistema.",
      icono: <FileBarChart2 className="h-6 w-6 text-purple-600" />,
      ruta: "/admin/dashboard",
    },
    {
      titulo: "Vehículos",
      descripcion: "Administra vehículos del sistema",
      detalle: "Agrega, modifica y elimina vehículos.",
      icono: <Car className="h-6 w-6 text-green-600" />,
      ruta: "/admin/vehicle",
    },
    {
      titulo: "Incidencias",
      descripcion: "Gestiona incidencias del sistema",
      detalle: "Administra el estado y seguimiento de las incidencias.",
      icono: <AlertTriangle className="h-6 w-6 text-red-600" />,
      ruta: "/incidence",
    },
    {
      titulo: "Registrar Vehículo",
      descripcion: "Agrega un nuevo vehículo",
      detalle: "Completa el formulario para registrar un nuevo vehículo.",
      icono: <PlusCircle className="h-6 w-6 text-green-500" />,
      ruta: "/admin/vehicle/register",
    },
    {
      titulo: "Registrar Incidencia",
      descripcion: "Agrega una nueva incidencia",
      detalle: "Completa el formulario para registrar una nueva incidencia.",
      icono: <PlusCircle className="h-6 w-6 text-orange-500" />,
      ruta: "/incidence/register",
    },
    {
      titulo: "Historial de Incidencias Finalizadas",
      descripcion: "Consulta el historial de incidencias",
      detalle: "Revisa todas las incidencias registradas en el sistema.",
      icono: <FileBarChart2 className="h-6 w-6 text-yellow-500" />,
      ruta: "/incidence/admin/history",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl sm:text-4xl font-bold text-center text-blue-800 mb-12">
        Panel de Administración de {empresa}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {opciones.map((opcion, index) => (
          <Link href={opcion.ruta} key={index} className="group">
            <Card className="h-full cursor-pointer border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 rounded-2xl">
              <CardHeader className="flex flex-row items-start gap-4">
                <div className="p-2 bg-gray-100 rounded-xl group-hover:bg-blue-50 transition">
                  {opcion.icono}
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold text-gray-800 group-hover:text-blue-700">
                    {opcion.titulo}
                  </CardTitle>
                  <CardDescription className="text-sm text-gray-500">
                    {opcion.descripcion}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="pt-0 pb-4 px-6">
                <p className="text-sm text-gray-600">{opcion.detalle}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
