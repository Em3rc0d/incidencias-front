"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface ChoferIncidencia {
  nombre: string;
  cantidad: number;
}

export default function DashboardPage() {
  const [data, setData] = useState<ChoferIncidencia[]>([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/dashboard/top-choferes", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then(setData)
      .catch((err) => console.error("Error cargando dashboard:", err));
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">📊 Dashboard</h1>

      <Card>
        <CardHeader>
          <CardTitle>Top Choferes con más Incidencias</CardTitle>
        </CardHeader>
        <CardContent>
          {data.length === 0 ? (
            <p className="text-gray-500">No hay datos disponibles.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Chofer</TableHead>
                  <TableHead>Cantidad de Incidencias</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((c, i) => (
                  <TableRow key={i}>
                    <TableCell>{c.nombre}</TableCell>
                    <TableCell>{c.cantidad}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
