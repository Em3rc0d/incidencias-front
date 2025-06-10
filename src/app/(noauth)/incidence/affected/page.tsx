"use client";

import { useEffect, useState } from "react";

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
    <div className="max-w-3xl mx-auto my-auto px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Afectados
      </h1>

      {loading ? (
        <p className="text-center text-gray-500">Cargando...</p>
      ) : afectados.length === 0 ? (
        <p className="text-center text-gray-500">
          No hay afectados registrados.
        </p>
      ) : (
        <ul className="space-y-4">
          {afectados.map((a, i) => (
            <li key={i} className="border rounded-lg p-4 bg-white shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold text-gray-800">
                  {a.nombre}
                </h2>
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${
                    tipoColor[a.tipoTercero] || "bg-gray-100 text-gray-800"
                  }`}
                >
                  {a.tipoTercero}
                </span>
              </div>
              <p className="text-sm text-gray-600">{a.descripcionDanio}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
