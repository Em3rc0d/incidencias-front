"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, PlusCircle } from "lucide-react";
import Link from "next/link";
import EvidenciasPage from "./evidences/page";
import AfectadosPage from "./affected/page";
import dynamic from "next/dynamic";
import Cookies from "js-cookie";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { Toaster } from "sonner";
import ModalReporteAseguradora from "./ModalReporteAseguradora";

const MapPreview = dynamic(() => import("./MapPreview"), { ssr: false });

type Incidencia = {
  id: number;
  vehiculo: any;
  usuario: any;
  tipoIncidencia: any;
  descripcion: string;
  prioridad: "alta" | "media" | "baja";
  estado: "ABIERTA" | "CERRADA" | "PENDIENTE" | "NOTIFICADO" | "ANULADA";
  latitud: number;
  longitud: number;
};

export default function IncidenciasPage() {
  const [visibleEvidenceIndex, setVisibleEvidenceIndex] = useState<
    number | null
  >(null);
  const [map, setMap] = useState(false);
  const [incidencias, setIncidencias] = useState<Incidencia[]>([]);
  const [incidenciaId, setIncidenciaId] = useState<number>(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedIncidenciaId, setSelectedIncidenciaId] = useState<
    number | null
  >(null);
  const fetchIncidencias = async () => {
    const token = localStorage.getItem("token");
    const role = Cookies.get("role");
    const userId = Cookies.get("userId");
    if (!token) return;

    try {
      const url =
        role === "ADMIN"
          ? "http://localhost:8080/api/incidencias"
          : `http://localhost:8080/api/incidencias/user/${userId}`;

      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error al obtener incidencias");
      }

      const data = await response.json();
      setIncidencias(data);
    } catch (error) {
      setIncidencias([]);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron obtener las incidencias.",
      });
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") fetchIncidencias();
  }, []);

  const prioridadStyles = {
    alta: "bg-red-100 text-red-700",
    media: "bg-yellow-100 text-yellow-700",
    baja: "bg-green-100 text-green-700",
  };

  const estadoStyles = {
    ABIERTA: "bg-green-100 text-green-800",
    CERRADA: "bg-gray-200 text-gray-800",
    PENDIENTE: "bg-yellow-100 text-yellow-800",
    NOTIFICADO: "bg-blue-100 text-blue-800",
    ANULADA: "bg-red-100 text-red-800",
  };

  const openModal = (id: number) => {
    setSelectedIncidenciaId(id);
    setModalOpen(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <Toaster richColors />
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
        {incidencias.length === 0 ? (
          <p className="text-center text-gray-500 mt-10 text-sm">
            No hay datos
          </p>
        ) : (
          incidencias.map((i, index) => (
            <li
              key={index}
              className="border rounded-lg shadow-sm p-5 bg-white hover:shadow-md transition-all"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500">
                    Vehículo:{" "}
                    <span className="font-semibold">{i.vehiculo?.placa}</span>
                  </p>
                  <p className="text-lg font-semibold text-gray-800 mt-1">
                    {i.descripcion}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      prioridadStyles[i.prioridad]
                    }`}
                  >
                    Prioridad: {i.prioridad}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      estadoStyles[i.estado]
                    }`}
                  >
                    {i.estado}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                {i.estado.toUpperCase() === "PENDIENTE" ? (
                  <Button
                    type="button"
                    onClick={() => openModal(i.id)}
                    className="w-full sm:w-auto text-xs px-4 py-2 mx-2"
                  >
                    Reportar a la aseguradora
                  </Button>
                ) : (
                  <Button
                    type="button"
                    disabled
                    className="w-full sm:w-auto text-xs px-4 py-2 mx-2 opacity-50 cursor-not-allowed"
                  >
                    Ya notificado
                  </Button>
                )}

                <Button
                  variant="outline"
                  onClick={() => {
                    setVisibleEvidenceIndex(
                      visibleEvidenceIndex === index ? null : index
                    );
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
                    <p className="text-gray-600 font-medium">
                      Detalles de la incidencia
                    </p>
                    <Button variant="secondary" onClick={() => setMap(!map)}>
                      {map ? "Ocultar Preview" : "Ver Preview"}
                    </Button>
                  </div>

                  {map && (
                    <div className="border rounded-lg bg-gray-50">
                      <MapPreview
                        lat={i.latitud}
                        lng={i.longitud}
                        descripcion={i.descripcion}
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
          ))
        )}
      </ul>
      {selectedIncidenciaId !== null && (
        <ModalReporteAseguradora
          open={modalOpen}
          onOpenChange={setModalOpen}
          incidenciaId={selectedIncidenciaId}
          onSuccess={() => {
            fetchIncidencias();
          }}
        />
      )}
    </div>
  );
}
