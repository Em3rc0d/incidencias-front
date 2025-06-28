"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

type Afectado = {
  nombre: string;
  tipoTercero: string;
  descripcionDanio: string;
};

type Props = {
  incidenciaId: number;
};

export default function AfectadosPage({ incidenciaId }: Props) {
  const [afectados, setAfectados] = useState<Afectado[]>([]);
  const [loading, setLoading] = useState(true);

  const tipoColor: Record<string, string> = {
    persona: "bg-blue-100 text-blue-800",
    vehiculo: "bg-yellow-100 text-yellow-800",
    infraestructura: "bg-red-100 text-red-800",
  };

  useEffect(() => {
    const fetchAfectados = async () => {
      try {
        const token = localStorage.getItem("token");
        const endpoint =
          incidenciaId === null || incidenciaId === undefined
            ? "http://localhost:8080/api/afectados"
            : `http://localhost:8080/api/afectados/incidence/${incidenciaId}`;

        const response = await fetch(endpoint, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Error al obtener afectados");
        const data = await response.json();
        setAfectados(data);
      } catch (error) {
        console.error("Error al obtener los afectados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAfectados();
  }, [incidenciaId]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-8">
        Lista de Afectados
      </h1>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      ) : afectados.length === 0 ? (
        <div className="text-center text-gray-500 text-sm">
          No hay afectados registrados para esta incidencia.
        </div>
      ) : (
        <ul className="space-y-4">
          {afectados.map((afectado, i) => (
            <li
              key={i}
              className="rounded-xl border border-gray-200 bg-white shadow-sm p-5 transition hover:shadow-md"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    {afectado.nombre}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {afectado.descripcionDanio}
                  </p>
                </div>
                <Badge
                  className={`text-xs font-medium px-3 py-1 rounded-full capitalize ${
                    tipoColor[afectado.tipoTercero] || "bg-gray-100 text-gray-800"
                  }`}
                >
                  {afectado.tipoTercero}
                </Badge>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
