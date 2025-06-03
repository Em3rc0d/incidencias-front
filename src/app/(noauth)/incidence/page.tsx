"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import EvidenciasPage from "./evidences/page";
import AfectadosPage from "./affected/page";

export default function IncidenciasPage() {
  const [visibleEvidenceIndex, setVisibleEvidenceIndex] = useState<
    number | null
  >(null);
  const [map, setMap] = useState(false);
  const incidencias = [
    {
      vehiculo: "ABC-123",
      descripcion: "Choque leve en la parte trasera",
      prioridad: "media",
      estado: "abierta",
    },
    {
      vehiculo: "CDG-456",
      descripcion: "Cambio de aceite programado",
      prioridad: "baja",
      estado: "cerrada",
    },
    {
      vehiculo: "HRS-789",
      descripcion: "Falla en sistema de frenos",
      prioridad: "alta",
      estado: "abierta",
    },
  ];

  const prioridadColor = {
    alta: "text-red-600 font-semibold",
    media: "text-yellow-600 font-semibold",
    baja: "text-green-600 font-semibold",
  };

  const estadoColor = {
    abierta: "bg-green-100 text-green-800",
    cerrada: "bg-gray-200 text-gray-800",
  };

  return (
    <div className="max-w-4xl mx-auto my-auto px-4">
      <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">
        Estado de tus Incidencias
      </h1>

      <div className="flex justify-end mb-4">
        <Link href="/incidence/register">
          <Button>Crear incidencia</Button>
        </Link>
      </div>

      <ul className="space-y-2">
        {incidencias.map((i, index) => (
          <li
            key={index}
            className="border rounded-lg shadow p-5 bg-white flex flex-col gap-3"
          >
            <div>
              <p className="text-base text-gray-600">
                <span className="font-semibold text-black">Vehículo:</span>{" "}
                {i.vehiculo}
              </p>
              <p className="text-lg font-medium text-gray-800">
                {i.descripcion}
              </p>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span
                className={
                  prioridadColor[i.prioridad as keyof typeof prioridadColor]
                }
              >
                Prioridad: {i.prioridad}
              </span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  estadoColor[i.estado as keyof typeof estadoColor]
                }`}
              >
                {i.estado}
              </span>
            </div>

            <div className="mt-2">
              <Button
                variant="outline"
                onClick={() =>
                  setVisibleEvidenceIndex(
                    visibleEvidenceIndex === index ? null : index
                  )
                }
              >
                {visibleEvidenceIndex === index
                  ? "Ocultar detalles"
                  : "Ver detalles"}
              </Button>
            </div>

            {visibleEvidenceIndex === index && (
              <div className="mt-4 border-t pt-4">
                <p className="text-gray-600">Detalles de la incidencia: <Button onClick={() => setMap(!map)}>Ver Preview</Button></p>
                  {
                    map &&
                    <div>
                      <img src="aspa roja.jpg" alt="" />
                      </div>
                  }
                <AfectadosPage/>
                <EvidenciasPage />
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
