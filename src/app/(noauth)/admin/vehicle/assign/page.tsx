"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Table } from "@/components/ui/table";
import { AsignacionesCarousel } from "./Carrousel";

type Vehiculo = {
  id: number;
  placa: string;
  marca: string;
  modelo: string;
  anio: number;
  tipo: string;
  estado: string;
};

type Conductor = {
  id: number;
  nombre: string;
  correo: string;
  rol: string;
};

type HistorialDTO = {
  id?: number;
  vehiculo: { id: number };
  usuario: { id: number };
  numeroVueltas: number;
  dia: string;
  hora: string;
};

type Asignacion = {
  id?: number;
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
  "07:00",
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

export default function Page() {
  const [asignaciones, setAsignaciones] = useState<Asignacion[]>([]);
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [conductores, setConductores] = useState<Conductor[]>([]);
  const [form, setForm] = useState({
    dia: diasSemana[0],
    hora: horas[0],
    vehiculoId: 0,
    conductorId: 0,
  });
  const [modoEdicion, setModoEdicion] = useState<Asignacion | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vehRes, condRes, histRes] = await Promise.all([
          fetch("http://localhost:8080/api/vehiculos", fetchOptions()),
          fetch("http://localhost:8080/api/usuarios", fetchOptions()),
          fetch("http://localhost:8080/api/historial-uso", fetchOptions()),
        ]);

        if (!vehRes.ok || !condRes.ok || !histRes.ok)
          throw new Error("Error al cargar datos");

        const vehiculosData: Vehiculo[] = await vehRes.json();
        const usuarios: any = await condRes.json();
        const conductoresData = usuarios.filter((u: any) => u.rol === "CHOFER");
        const historialData: HistorialDTO[] = await histRes.json();

        setVehiculos(vehiculosData);
        setConductores(conductoresData);

        setForm((f) => ({
          ...f,
          vehiculoId: vehiculosData[0]?.id ?? 0,
          conductorId: conductoresData[0]?.id ?? 0,
        }));

        const conv = historialData.map(
          toAsignacion(vehiculosData, conductoresData)
        );
        console.log("Asignaciones convertidas:", conv);
        setAsignaciones(conv);
      } catch {
        alert("Error al cargar datos");
      }
    };

    fetchData();
  }, []);

  const handleChange = (campo: string, valor: string) => {
    setForm((p) => ({
      ...p,
      [campo]: campo.includes("Id") ? parseInt(valor) : valor,
    }));
  };

  const handleAsignar = async () => {
    const { dia, hora, vehiculoId, conductorId } = form;
    const veh = vehiculos.find((v) => v.id === vehiculoId)!;
    const cond = conductores.find((c) => c.id === conductorId)!;
    const [h, m] = hora.split(":").map(Number);
    const fi = new Date();
    fi.setHours(h, m, 0, 0);
    const ff = new Date(fi);
    ff.setHours(fi.getHours() + 1);

    const dto: HistorialDTO = {
      vehiculo: { id: vehiculoId },
      usuario: { id: conductorId },
      numeroVueltas: 1,
      dia,
      hora,
    };

    try {
      if (modoEdicion) {
        await fetch(
          `http://localhost:8080/api/historial-uso/${modoEdicion.id}`,
          {
            ...fetchOptions("PUT"),
            body: JSON.stringify(dto),
          }
        );

        setAsignaciones((prev) =>
          prev.map((a) =>
            a.id === modoEdicion.id
              ? { ...modoEdicion, dia, hora, vehiculo: veh, conductor: cond }
              : a
          )
        );
        setModoEdicion(null);
      } else {
        if (asignaciones.some((a) => a.dia === dia && a.hora === hora))
          return alert("Ya existe asignación en ese día y hora");

        const res = await fetch("http://localhost:8080/api/historial-uso", {
          ...fetchOptions("POST"),
          body: JSON.stringify(dto),
        });
        const nuevo = await res.json();
        setAsignaciones((a) => [
          ...a,
          { id: nuevo.id, dia, hora, vehiculo: veh, conductor: cond },
        ]);
      }
    } catch {
      alert("Error al guardar");
    }
  };

  const handleEliminar = async (id: string | number) => {
    const numId = typeof id === "string" ? parseInt(id, 10) : id;
    if (!numId) return;
    try {
      await fetch(
        `http://localhost:8080/api/historial-uso/${numId}`,
        fetchOptions("DELETE")
      );
      setAsignaciones((prev) => prev.filter((a) => a.id !== numId));
    } catch {
      alert("Error al eliminar");
    }
  };

  const fetchOptions = (method: string = "GET") => ({
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  const toAsignacion =
    (vehiculos: Vehiculo[], conductores: Conductor[]) =>
    (h: HistorialDTO): Asignacion => {
      const dia = h.dia || diasSemana[0];
      const hora = h.hora || horas[0];
      const veh = vehiculos.find((v) => v.id === h.vehiculo.id)!;
      const cond = conductores.find((c) => c.id === h.usuario.id)!;
      return { id: h.id, dia, hora, vehiculo: veh, conductor: cond };
    };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 space-y-8">
      <h1 className="text-3xl font-bold">Asignaciones Semanales</h1>

      <div className="bg-white rounded shadow p-6 space-y-4">
        <h2 className="text-xl font-semibold">
          {modoEdicion ? "Editar Asignación" : "Nueva Asignación"}
        </h2>
        <div className="flex flex-wrap gap-4">
          {/* Selects */}
          <Select
            value={form.dia}
            onValueChange={(val) => handleChange("dia", val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Día" />
            </SelectTrigger>
            <SelectContent>
              {diasSemana.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={form.hora}
            onValueChange={(val) => handleChange("hora", val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Hora" />
            </SelectTrigger>
            <SelectContent>
              {horas.map((h) => (
                <SelectItem key={h} value={h}>
                  {h}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={form.vehiculoId.toString()}
            onValueChange={(val) => handleChange("vehiculoId", val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Vehículo" />
            </SelectTrigger>
            <SelectContent>
              {vehiculos.map((v) => (
                <SelectItem key={v.id} value={v.id.toString()}>
                  {v.placa}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={form.conductorId.toString()}
            onValueChange={(val) => handleChange("conductorId", val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Conductor" />
            </SelectTrigger>
            <SelectContent>
              {conductores.map((c) => (
                <SelectItem key={c.id} value={c.id.toString()}>
                  {c?.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button onClick={handleAsignar}>
            {modoEdicion ? "Guardar cambios" : "Asignar"}
          </Button>
        </div>
      </div>

      <AsignacionesCarousel
        asignaciones={asignaciones}
        setModoEdicion={setModoEdicion}
        handleEliminar={handleEliminar}
      />
    </div>
  );
}
