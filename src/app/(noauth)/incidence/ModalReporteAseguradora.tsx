"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import Cookies from "js-cookie";
type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  incidenciaId: number;
  onSuccess?: () => void; // opcional, si necesitas una función de éxito
};

export default function ModalReporteAseguradora({
  open,
  onOpenChange,
  incidenciaId,
  onSuccess = () => {}, // función por defecto si no se pasa
}: Props) {
  const [empresa, setEmpresa] = useState<string | null>(null);

  useEffect(() => {
    const id = Cookies.get("empresaId");
    if (!id) {
      return;
    }
    setEmpresa(id);
  }, []);

  const [form, setForm] = useState({
    aseguradoraId: "", // ← este es el ID que enviarás al backend
    aseguradoraNombre: "", // ← este es el que se muestra en pantalla
    asunto: "",
    cuerpo: "",
    observaciones: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        "http://localhost:8080/api/reportes-aseguradora",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            aseguradora: form.aseguradoraId,
            asunto: form.asunto,
            cuerpo: form.cuerpo,
            observaciones: form.observaciones,
            incidencia: incidenciaId,
          }),
        }
      );

      if (!res.ok) throw new Error("Error al registrar el reporte");

      toast.success("Reporte enviado correctamente");
      onOpenChange(false);
      onSuccess();
      setForm({
        aseguradoraId: "",
        aseguradoraNombre: "",
        asunto: "",
        cuerpo: "",
        observaciones: "",
      });
    } catch (error) {
      toast.error("No se pudo enviar el reporte");
    }
  };
  useEffect(() => {
    const fetchAseguradora = async () => {
      if (!empresa) return; // ⛔ evita petición si aún no se ha seteado
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Token no encontrado");

        const response = await fetch(
          `http://localhost:8080/api/empresas/${empresa}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) throw new Error("Error al obtener aseguradora");
        const asunto = await fetch(
          `http://localhost:8080/api/incidencias/${incidenciaId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!asunto.ok)
          throw new Error("Error al obtener asunto de la incidencia");
        const data = await response.json();
        const asuntoData = await asunto.json();
        console.log("Aseguradora cargada:", data);
        setForm((prev) => ({
          ...prev,
          aseguradoraId: data.aseguradora?.id?.toString() ?? "",
          aseguradoraNombre: data.aseguradora?.nombre ?? "",
          asunto: asuntoData.tipoIncidencia.nombre ?? "",
        }));
      } catch (error) {
        console.error("Error al cargar aseguradora:", error);
        toast.error("No se pudo cargar la aseguradora");
      }
    };

    fetchAseguradora();
  }, [empresa, incidenciaId]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reportar a la aseguradora</DialogTitle>
          <DialogDescription>
            Completa los siguientes campos para enviar el reporte.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="aseguradoraNombre">Aseguradora</Label>
            <Input
              id="aseguradoraNombre"
              name="aseguradoraNombre"
              value={form.aseguradoraNombre}
              disabled
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="asunto">Asunto</Label>
            <Input
              id="asunto"
              name="asunto"
              value={form.asunto}
              onChange={handleChange}
              placeholder="Ej: Daño vehicular"
              disabled
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="cuerpo">Cuerpo del reporte</Label>
            <Textarea
              id="cuerpo"
              name="cuerpo"
              rows={3}
              value={form.cuerpo}
              onChange={handleChange}
              placeholder="Detalles del incidente..."
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="observaciones">Observaciones</Label>
            <Textarea
              id="observaciones"
              name="observaciones"
              rows={2}
              value={form.observaciones}
              onChange={handleChange}
              placeholder="Observaciones adicionales..."
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>Enviar reporte</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
