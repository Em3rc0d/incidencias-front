"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Asegúrate que esto sea de shadcn/ui

type Vehiculo = {
  id: number;
  placa: string;
};

type Conductor = {
  id: number;
  nombre: string;
};

type Asignacion = {
  dia: string;
  hora: string;
  vehiculo: Vehiculo;
  conductor: Conductor;
};

const diasSemana = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
];

const horas = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
];

export default function VehicleAssignPage() {
  const vehiculos: Vehiculo[] = [
    { id: 1, placa: "ABC123" },
    { id: 2, placa: "XYZ789" },
  ];

  const conductores: Conductor[] = [
    { id: 1, nombre: "Juan Pérez" },
    { id: 2, nombre: "Ana Torres" },
  ];

  const [asignaciones, setAsignaciones] = useState<Asignacion[]>([]);
  const [form, setForm] = useState<{
    dia: string;
    hora: string;
    vehiculoId: number;
    conductorId: number;
  }>({
    dia: "Lunes",
    hora: "08:00",
    vehiculoId: vehiculos[0].id,
    conductorId: conductores[0].id,
  });

  const handleChange = (name: string, value: string) => {
    setForm((f) => ({
      ...f,
      [name]: name.includes("Id") ? parseInt(value) : value,
    }));
  };

  const handleAsignar = () => {
    const { dia, hora, vehiculoId, conductorId } = form;
    const existe = asignaciones.find((a) => a.dia === dia && a.hora === hora);
    if (existe) {
      alert("Ya existe una asignación para ese día y hora.");
      return;
    }

    const vehiculo = vehiculos.find((v) => v.id === vehiculoId)!;
    const conductor = conductores.find((c) => c.id === conductorId)!;

    setAsignaciones((prev) => [...prev, { dia, hora, vehiculo, conductor }]);
  };

  const handleEliminar = (dia: string, hora: string) => {
    setAsignaciones((prev) =>
      prev.filter((a) => !(a.dia === dia && a.hora === hora))
    );
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 p-4 space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Cronograma Semanal</h1>

      <div className="bg-white rounded shadow p-6 space-y-4">
        <h2 className="text-xl font-semibold">Asignar vehículo</h2>
        <div className="flex flex-row gap-4">
          <Select
            value={form.dia}
            onValueChange={(value) => handleChange("dia", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona día" />
            </SelectTrigger>
            <SelectContent>
              {diasSemana.map((dia) => (
                <SelectItem key={dia} value={dia}>
                  {dia}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={form.hora}
            onValueChange={(value) => handleChange("hora", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona hora" />
            </SelectTrigger>
            <SelectContent>
              {horas.map((hora) => (
                <SelectItem key={hora} value={hora}>
                  {hora}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={String(form.vehiculoId)}
            onValueChange={(value) => handleChange("vehiculoId", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona vehículo" />
            </SelectTrigger>
            <SelectContent>
              {vehiculos.map((v) => (
                <SelectItem key={v.id} value={String(v.id)}>
                  {v.placa}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={String(form.conductorId)}
            onValueChange={(value) => handleChange("conductorId", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona conductor" />
            </SelectTrigger>
            <SelectContent>
              {conductores.map((c) => (
                <SelectItem key={c.id} value={String(c.id)}>
                  {c.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button onClick={handleAsignar}>Asignar</Button>
        </div>
      </div>

      <div className="space-y-8">
        {diasSemana.map((dia) => {
          const asignados = asignaciones.filter((a) => a.dia === dia);
          return (
            <section key={dia} className="bg-white rounded shadow p-4">
              <h3 className="text-2xl font-semibold mb-4">{dia}</h3>
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr>
                    <th className="border p-2">Hora</th>
                    <th className="border p-2">Vehículo</th>
                    <th className="border p-2">Conductor</th>
                    <th className="border p-2">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {horas.map((hora) => {
                    const asignacion = asignados.find((a) => a.hora === hora);
                    return (
                      <tr key={hora} className="even:bg-gray-50">
                        <td className="border p-2">{hora}</td>
                        <td className="border p-2">
                          {asignacion ? asignacion.vehiculo.placa : "-"}
                        </td>
                        <td className="border p-2">
                          {asignacion ? asignacion.conductor.nombre : "-"}
                        </td>
                        <td className="border p-2 text-center">
                          {asignacion && (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleEliminar(dia, hora)}
                            >
                              Quitar
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </section>
          );
        })}
      </div>
    </div>
  );
}
