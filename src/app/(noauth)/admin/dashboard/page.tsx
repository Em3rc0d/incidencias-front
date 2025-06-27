"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trophy, Users } from "lucide-react";

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

  const max = Math.max(...data.map((d) => d.cantidad), 1);

  return (
    <div className="max-w-5xl mx-auto mt-10 px-4 space-y-6">
      <motion.h1
        className="text-4xl font-extrabold text-center text-blue-800"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Users className="inline-block w-8 h-8 text-blue-500 mr-2 animate-bounce" />
        Dashboard de Incidencias
      </motion.h1>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="shadow-xl border-blue-100">
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Trophy className="text-yellow-500" />
              Top Choferes con más Incidencias
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.length === 0 ? (
              <p className="text-gray-500">No hay datos disponibles.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Chofer</TableHead>
                    <TableHead>Incidencias</TableHead>
                    <TableHead>Impacto</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((c, i) => (
                    <TableRow
                      key={i}
                      className={i === 0 ? "bg-yellow-50 font-semibold" : ""}
                    >
                      <TableCell>{i + 1}</TableCell>
                      <TableCell>{c.nombre}</TableCell>
                      <TableCell>{c.cantidad}</TableCell>
                      <TableCell>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className={`h-2.5 rounded-full ${i === 0
                              ? "bg-yellow-500"
                              : i === 1
                              ? "bg-gray-400"
                              : i === 2
                              ? "bg-amber-700"
                              : "bg-blue-400"
                              }`}
                            style={{ width: `${(c.cantidad / max) * 100}%` }}
                          ></div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
