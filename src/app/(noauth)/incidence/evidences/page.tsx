"use client";
import { useEffect, useState } from "react";

type Evidencia = {
  urlArchivo: string;
  tipoArchivo: string;
  fechaSubida: string;
};

type Props = {
  incidenciaId: number;
};

export default function EvidenciasPage({ incidenciaId }: Props) {
  const [evidencias, setEvidencias] = useState<Evidencia[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvidencias = async () => {
      try {
        const token = localStorage.getItem("token");
        const endpoint =
          incidenciaId === null || incidenciaId === undefined
            ? "http://localhost:8080/api/evidencias"
            : `http://localhost:8080/api/evidencias/incidencia/${incidenciaId}`;

        const response = await fetch(endpoint, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Error al obtener evidencias");

        const data = await response.json();
        setEvidencias(data);
      } catch (error) {
        console.error("Error cargando evidencias:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvidencias();
  }, [incidenciaId]);

  const isImage = (tipo: string) =>
    ["imagen", "image", "jpg", "jpeg", "png", "gif"].includes(
      tipo.toLowerCase()
    );

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Evidencias del Incidente
      </h2>

      {loading ? (
        <p className="text-gray-500">Cargando evidencias...</p>
      ) : evidencias.length === 0 ? (
        <p className="text-gray-500">No se encontraron evidencias.</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {evidencias.map((e, i) => (
            <li key={i} className="border rounded-lg bg-white shadow-sm p-4">
              {isImage(e.tipoArchivo) ? (
                <img
                  src={e.urlArchivo}
                  alt={`Evidencia ${i + 1}`}
                  className="w-full h-48 object-cover rounded mb-2"
                />
              ) : (
                <a
                  href={e.urlArchivo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm break-all"
                >
                  {e.urlArchivo}
                </a>
              )}

              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-600 capitalize">
                  {e.tipoArchivo}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(e.fechaSubida).toLocaleDateString()}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
