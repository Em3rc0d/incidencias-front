"use client";

import { useEffect, useState } from "react";

interface ReporteAseguradora {
  id: number;
  asunto: string;
  estadoEnvio: string;
  cuerpo: string;
  observaciones: string;
  fechaEnvio: string;
}

export default function ReportesAseguradoraPage() {
  const [reportes, setReportes] = useState<ReporteAseguradora[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReportes = async () => {
      try {
        const res = await fetch(
          "http://localhost:8080/api/reportes-aseguradora",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (!res.ok) throw new Error("Error al obtener los reportes");

        const data = await res.json();
        setReportes(data);
      } catch (error) {
        console.error("Error al cargar reportes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReportes();
  }, []);

  return (
    <div className="max-w-3xl mx-auto mt-20 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Reportes a Aseguradora
      </h1>

      {loading ? (
        <p className="text-center text-gray-500">Cargando reportes...</p>
      ) : reportes.length === 0 ? (
        <p className="text-center text-gray-500">
          No hay reportes registrados.
        </p>
      ) : (
        <ul className="space-y-4">
          {reportes.map((r) => (
            <li
              key={r.id}
              className="bg-white shadow-md rounded-lg p-4 border-l-4"
              style={{
                borderLeftColor:
                  r.estadoEnvio === "enviado" ? "#22c55e" : "#facc15", // verde o amarillo
              }}
            >
              <p className="text-lg font-semibold text-gray-900">{r.asunto}</p>
              <p className="text-sm text-gray-600">
                Estado:{" "}
                <span
                  className={`font-bold ${
                    r.estadoEnvio === "enviado"
                      ? "text-green-600"
                      : "text-yellow-600"
                  }`}
                >
                  {r.estadoEnvio}
                </span>
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Fecha de envío: {new Date(r.fechaEnvio).toLocaleString()}
              </p>
              {r.observaciones && (
                <p className="text-sm text-gray-500 mt-1">
                  Observaciones: {r.observaciones}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
