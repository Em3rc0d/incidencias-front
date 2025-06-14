"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { X, Check, Pencil } from "lucide-react";

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
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ReporteAseguradora | null>(null);
  const actualizarEstado = async (id: number, nuevoEstado: string) => {
    const reporteOriginal = reportes.find((r) => r.id === id);
    if (!reporteOriginal) return;

    const label = nuevoEstado === "CERRADA" ? "PAGADO" : "ANULADO";

    const confirmacion = await Swal.fire({
      title: `¿Estás seguro?`,
      text: `Esto cambiará el estado a "${label}"`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, confirmar",
      cancelButtonText: "Cancelar",
    });

    if (!confirmacion.isConfirmed) return;

    const reporteActualizado = {
      ...reporteOriginal,
      estadoEnvio: nuevoEstado,
    };

    try {
      const res = await fetch(
        `http://localhost:8080/api/reportes-aseguradora/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(reporteActualizado),
        }
      );

      if (!res.ok) throw new Error("Error al actualizar el estado");

      toast.success(`Estado actualizado a "${label}"`);
      fetchReportes();
    } catch (error) {
      toast.error("No se pudo actualizar el estado");
    }
  };

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

  useEffect(() => {
    fetchReportes();
  }, []);

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!editing) return;
    setEditing({ ...editing, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async () => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/reportes-aseguradora/${editing?.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(editing),
        }
      );
      if (!res.ok) throw new Error("Error al actualizar el reporte");

      toast.success("Reporte actualizado correctamente");
      setModalOpen(false);
      setEditing(null);
      fetchReportes(); // recarga los datos
    } catch (error) {
      toast.error("No se pudo actualizar el reporte");
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-20 px-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-10 text-center">
        Reportes a Aseguradora
      </h1>

      {loading ? (
        <p className="text-center text-gray-500">Cargando reportes...</p>
      ) : reportes.length === 0 ? (
        <p className="text-center text-gray-500">
          No hay reportes registrados.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reportes
            .filter((r) => r.estadoEnvio === "ENVIADO")
            .map((r) => (
              <div
                key={r.id}
                className={`bg-white shadow-lg rounded-2xl p-5 border-t-4 transition-transform hover:scale-[1.02] ${
                  r.estadoEnvio === "enviado"
                    ? "border-green-500"
                    : "border-yellow-400"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {r.asunto}
                  </h2>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      r.estadoEnvio === "ENVIADO"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {r.estadoEnvio}
                  </span>
                </div>

                <p className="text-sm text-gray-500">
                  <strong className="text-gray-700">Fecha de envío:</strong>{" "}
                  {new Date(r.fechaEnvio).toLocaleString()}
                </p>

                {r.observaciones && (
                  <p className="text-sm text-gray-500 mt-2">
                    <strong className="text-gray-700">Observaciones:</strong>{" "}
                    {r.observaciones}
                  </p>
                )}

                <div className="mt-4 flex gap-2 justify-end">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => actualizarEstado(r.id, "CERRADA")}
                  >
                    <Check className="w-4 h-4 text-green-600" />
                  </Button>

                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => actualizarEstado(r.id, "ANULADA")}
                  >
                    <X className="w-4 h-4" />
                  </Button>

                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      setEditing(r);
                      setModalOpen(true);
                    }}
                    className="flex gap-1 items-center"
                  >
                    <Pencil className="w-4 h-4" />
                    Editar
                  </Button>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Modal de edición */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Reporte</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4 py-2">
              <div>
                <Label htmlFor="asunto">Asunto</Label>
                <Input
                  name="asunto"
                  value={editing.asunto}
                  onChange={handleEditChange}
                />
              </div>
              <div>
                <Label htmlFor="cuerpo">Cuerpo</Label>
                <Textarea
                  name="cuerpo"
                  value={editing.cuerpo}
                  onChange={handleEditChange}
                />
              </div>
              <div>
                <Label htmlFor="observaciones">Observaciones</Label>
                <Textarea
                  name="observaciones"
                  value={editing.observaciones}
                  onChange={handleEditChange}
                />
              </div>
              <Button className="w-full" onClick={handleEditSubmit}>
                Guardar cambios
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
