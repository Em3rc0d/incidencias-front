"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Afectado {
  incidenciaId?: string;
  nombre: string;
  documentoIdentidad: string;
  tipoTercero: string;
  contacto: string;
  descripcionDanio: string;
}

export default function Register() {
  const [incidenceType, setIncidenceType] = useState("");
  const [priority, setPriority] = useState("");
  const [description, setDescription] = useState("");
  const [hayEvidencia, setHayEvidencia] = useState(false);
  const [huboAfectado, setHuboAfectado] = useState(false);
  const [afectados, setAfectados] = useState<Afectado[]>([
    {
      nombre: "",
      documentoIdentidad: "",
      tipoTercero: "",
      contacto: "",
      descripcionDanio: "",
    },
  ]);
  const [evidencias, setEvidencias] = useState<File[]>([]);
  const [ubicacion, setUbicacion] = useState<{ latitud: number | null; longitud: number | null }>({
    latitud: null,
    longitud: null,
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => setUbicacion({ latitud: coords.latitude, longitud: coords.longitude }),
      (err) => console.warn("Error obteniendo ubicación:", err),
      { enableHighAccuracy: true }
    );
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.length) {
      setEvidencias([...files]);
      setHayEvidencia(true);
    }
  };

  const updateAfectado = (index: number, field: keyof Afectado, value: string) => {
    const nuevos = [...afectados];
    nuevos[index] = { ...nuevos[index], [field]: value };
    setAfectados(nuevos);
  };

  const agregarAfectado = () =>
    setAfectados([
      ...afectados,
      {
        nombre: "",
        documentoIdentidad: "",
        tipoTercero: "",
        contacto: "",
        descripcionDanio: "",
      },
    ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) return alert("Token no disponible");

    const payloadIncidencia = {
      vehiculoId: 1,
      usuarioId: 1,
      tipoIncidenciaId: 1, // TODO: mapear según incidenceType
      descripcion: description,
      prioridad: priority,
      estado: "pendiente",
      fechaReporte: new Date().toISOString(),
      latitud: ubicacion.latitud,
      longitud: ubicacion.longitud,
    };

    try {
      const resInc = await fetch("http://localhost:8080/api/incidencias", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payloadIncidencia),
      });

      if (!resInc.ok) throw new Error(await resInc.text());

      const incidencia = await resInc.json();

      if (huboAfectado) {
        for (const afectado of afectados) {
          const payload = { ...afectado, incidenciaId: incidencia.id };
          const res = await fetch("http://localhost:8080/api/afectados", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          });

          if (!res.ok) {
            console.error(`Error guardando afectado ${afectado.nombre}:`, await res.text());
          }
        }
      }

      if (hayEvidencia) {
        for (const file of evidencias) {
          const formData = new FormData();
          formData.append("file", file);
          const fileType = file.type;
          const resUpload = await fetch("http://localhost:8080/api/files/upload", {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
          });

          if (!resUpload.ok) throw new Error("Error subiendo archivo");

          const filePath = await resUpload.text();

          await fetch("http://localhost:8080/api/evidencias", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              incidencia,
              urlArchivo: filePath,
              tipoArchivo: fileType,
              fechaSubida: new Date().toISOString(),
            }),
          });
        }
      }

      alert("Incidencia registrada correctamente");
    } catch (err: any) {
      console.error("Error durante el registro:", err);
      alert("Error al registrar incidencia.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Registrar Incidencia</h1>

      <Label htmlFor="vehicle">Vehículo</Label>
      <Input id="vehicle" placeholder="AMX-124" disabled />

      <Label htmlFor="user">Usuario</Label>
      <Input id="user" placeholder="Juancito Perez" disabled />

      <Label htmlFor="incidenceType">Tipo de Incidencia</Label>
      <Select onValueChange={setIncidenceType}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Selecciona una incidencia" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="accidente">Accidente</SelectItem>
            <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
            <SelectItem value="averiaMecanica">Avería Mecánica</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <Label htmlFor="description">Descripción</Label>
      <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />

      <Label htmlFor="prioridad">Prioridad</Label>
      <Select onValueChange={setPriority}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Selecciona la prioridad" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="alta">Alta</SelectItem>
            <SelectItem value="media">Media</SelectItem>
            <SelectItem value="baja">Baja</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      {ubicacion.latitud && ubicacion.longitud && (
        <div className="text-sm text-gray-600">
          Ubicación: Lat {ubicacion.latitud.toFixed(6)} | Lon {ubicacion.longitud.toFixed(6)}
        </div>
      )}

      {!huboAfectado ? (
        <Button type="button" variant="outline" onClick={() => setHuboAfectado(true)}>
          ¿Hubo algún afectado?
        </Button>
      ) : (
        afectados.map((afectado, index) => (
          <div key={index} className="border-t pt-4 mt-4 space-y-2">
            <h2 className="text-lg font-semibold text-gray-700">Afectado #{index + 1}</h2>
            <Input placeholder="Nombre" value={afectado.nombre} onChange={(e) => updateAfectado(index, "nombre", e.target.value)} />
            <Input placeholder="Documento" value={afectado.documentoIdentidad} onChange={(e) => updateAfectado(index, "documentoIdentidad", e.target.value)} />
            <Input placeholder="Contacto" value={afectado.contacto} onChange={(e) => updateAfectado(index, "contacto", e.target.value)} />
            <Textarea placeholder="Daño" value={afectado.descripcionDanio} onChange={(e) => updateAfectado(index, "descripcionDanio", e.target.value)} />
            <Select onValueChange={(val) => updateAfectado(index, "tipoTercero", val)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Tipo de tercero" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="persona">Persona</SelectItem>
                <SelectItem value="vehiculo">Vehículo</SelectItem>
                <SelectItem value="infraestructura">Infraestructura</SelectItem>
              </SelectContent>
            </Select>
          </div>
        ))
      )}

      {huboAfectado && (
        <Button type="button" onClick={agregarAfectado} className="w-full">
          Agregar otro afectado
        </Button>
      )}

      <Label htmlFor="evidencias">Subir Evidencias</Label>
      <Input id="evidencias" type="file" multiple onChange={handleFileChange} />

      <Button type="submit" className="mt-4">
        Registrar
      </Button>
    </form>
  );
}
