"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

const diasSemana = [
  "Lunes",
  "Martes",
  "Miercoles",
  "Jueves",
  "Viernes",
  "Sabado",
  "Domingo",
];
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

interface AsignacionesCarouselProps {
  asignaciones: Asignacion[];
  setModoEdicion: (a: Asignacion) => void;
  handleEliminar: (id: string | number) => void;
}

export function AsignacionesCarousel({
  asignaciones,
  setModoEdicion,
  handleEliminar,
}: AsignacionesCarouselProps) {
  const [indice, setIndice] = useState(0);
  const diaActual = diasSemana[indice];

  const asignacionesFiltradas = asignaciones.filter((a) => a.dia === diaActual).sort(
    (a, b) => a.hora.localeCompare(b.hora)
  );

  const avanzar = () => setIndice((prev) => (prev + 1) % diasSemana.length);
  const retroceder = () =>
    setIndice((prev) => (prev - 1 + diasSemana.length) % diasSemana.length);

  return (
    <Card className="space-y-4">
      <CardContent className="pt-6 space-y-4">
        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={retroceder}>
            ← Anterior
          </Button>
          <h2 className="text-xl font-semibold">{diaActual}</h2>
          <Button variant="outline" onClick={avanzar}>
            Siguiente →
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Hora</TableHead>
              <TableHead>Vehículo</TableHead>
              <TableHead>Conductor</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {asignacionesFiltradas.length > 0 ? (
              asignacionesFiltradas.map((a) => (
                <TableRow key={a.id}>
                  <TableCell>{a.hora}</TableCell>
                  <TableCell>{a.vehiculo.placa}</TableCell>
                  <TableCell>{a.conductor?.nombre}</TableCell>
                  <TableCell className="space-x-2">
                    <Button size="sm" onClick={() => setModoEdicion(a)}>
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => a.id !== undefined && handleEliminar(a.id)}
                    >
                      Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center text-muted-foreground py-4"
                >
                  Sin asignaciones
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
