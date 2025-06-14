"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import Cookies from "js-cookie";

interface Empresa {
  id: number;
  nombre: string;
}

interface Usuario {
  id: number;
  nombre: string;
  empresa: Empresa;
}

interface Incidencia {
  id: number;
  descripcion: string;
}

interface HistorialIncidencia {
  id: number;
  incidencia: Incidencia;
  usuario: Usuario;
  estado: string;
  observacion: string;
  fecha: string;
}

export default function HistoryPage() {
  const [historiales, setHistoriales] = useState<HistorialIncidencia[]>([]);
  const [loading, setLoading] = useState(true);
  const [empresaId, setEmpresaId] = useState("1");

  useEffect(() => {
    const storedId = Cookies.get("empresaId");
    if (storedId) setEmpresaId(storedId);
  }, []);

  useEffect(() => {
    fetch(`http://localhost:8080/api/historial-incidencias/empresa/${empresaId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setHistoriales(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al cargar historial", err);
        setLoading(false);
      });
  }, [empresaId]);

  return (
    <Card className="max-w-6xl mx-auto mt-10">
      <CardHeader>
        <CardTitle className="text-2xl">Historial de Incidencias</CardTitle>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-8 w-full rounded" />
            ))}
          </div>
        ) : historiales.length === 0 ? (
          <p className="text-muted-foreground">No hay registros disponibles para esta empresa.</p>
        ) : (
          <div className="w-full overflow-x-auto max-h-[600px] border rounded-md">
            <table className="min-w-[800px] w-full">
              <thead>
                <tr className="bg-muted text-muted-foreground">
                  <th className="px-4 py-2 text-left">ID</th>
                  <th className="px-4 py-2 text-left">Incidencia</th>
                  <th className="px-4 py-2 text-left">Usuario</th>
                  <th className="px-4 py-2 text-left">Estado</th>
                  <th className="px-4 py-2 text-left">Observación</th>
                  <th className="px-4 py-2 text-left">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {historiales.map((h) => (
                  <tr key={h.id} className="border-t">
                    <td className="px-4 py-2">{h.id}</td>
                    <td className="px-4 py-2">{h.incidencia.descripcion}</td>
                    <td className="px-4 py-2">{h.usuario.nombre}</td>
                    <td className="px-4 py-2">{h.estado}</td>
                    <td className="px-4 py-2">{h.observacion}</td>
                    <td className="px-4 py-2">{new Date(h.fecha).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
