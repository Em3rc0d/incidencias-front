"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, PlusCircle } from "lucide-react";
import Link from "next/link";
import EvidenciasPage from "./evidences/page";
import AfectadosPage from "./affected/page";

type Incidencia = {
  id: number;
  vehiculo: any;
  usuario: any;
  tipoIncidencia: any;
  descripcion: string;
  prioridad: "alta" | "media" | "baja";
  estado: "abierta" | "cerrada";
  latitud: number;
  longitud: number;
};

export default function IncidenciasPage() {
  const [visibleEvidenceIndex, setVisibleEvidenceIndex] = useState<number | null>(null);
  const [map, setMap] = useState(false);
  const [incidencias, setIncidencias] = useState<Incidencia[]>([]);
  const [incidenciaId, setIncidenciaId] = useState<number>(0);

  useEffect(() => {
    const fetchIncidencias = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await fetch("http://localhost:8080/api/incidencias", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error("Error al obtener incidencias");
        const data = await response.json();
        setIncidencias(data);
      } catch (error) {
        console.error("Error cargando incidencias:", error);
      }
    };

    if (typeof window !== "undefined") fetchIncidencias();
  }, []);

  const prioridadStyles = {
    alta: "bg-red-100 text-red-700",
    media: "bg-yellow-100 text-yellow-700",
    baja: "bg-green-100 text-green-700",
  };

  const estadoStyles = {
    abierta: "bg-green-100 text-green-800",
    cerrada: "bg-gray-200 text-gray-800",
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">
        Estado de tus Incidencias
      </h1>

      <div className="flex justify-end mb-4">
        <Link href="/incidence/register">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Crear incidencia
          </Button>
        </Link>
      </div>

      <ul className="space-y-4">
        {incidencias.map((i, index) => (
          <li
            key={index}
            className="border rounded-lg shadow-sm p-5 bg-white hover:shadow-md transition-all"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">
                  Vehículo: <span className="font-semibold">{i.vehiculo?.placa}</span>
                </p>
                <p className="text-lg font-semibold text-gray-800 mt-1">{i.descripcion}</p>
              </div>

              <div className="flex flex-col items-end gap-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${prioridadStyles[i.prioridad]}`}
                >
                  Prioridad: {i.prioridad}
                </span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${estadoStyles[i.estado]}`}
                >
                  {i.estado}
                </span>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setVisibleEvidenceIndex(visibleEvidenceIndex === index ? null : index);
                  setIncidenciaId(i.id);
                }}
              >
                {visibleEvidenceIndex === index ? (
                  <>
                    <EyeOff className="mr-2 h-4 w-4" />
                    Ocultar detalles
                  </>
                ) : (
                  <>
                    <Eye className="mr-2 h-4 w-4" />
                    Ver detalles
                  </>
                )}
              </Button>
            </div>

            {visibleEvidenceIndex === index && (
              <div className="mt-6 border-t pt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-gray-600 font-medium">Detalles de la incidencia</p>
                  <Button variant="secondary" onClick={() => setMap(!map)}>
                    {map ? "Ocultar Preview" : "Ver Preview"}
                  </Button>
                </div>

                {map && (
                  <div className="border rounded-lg p-2 bg-gray-50">
                    <img
                      src="aspa roja.jpg"
                      alt="Mapa o imagen referencial"
                      className="w-full h-52 object-cover rounded"
                    />
                  </div>
                )}

                <div>
                  <AfectadosPage incidenciaId={incidenciaId} />
                </div>

                <div>
                  <EvidenciasPage incidenciaId={incidenciaId} />
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
