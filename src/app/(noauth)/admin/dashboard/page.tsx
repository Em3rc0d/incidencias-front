"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Trophy,
  Users,
  AlertTriangle,
  Activity,
  Building2,
} from "lucide-react";

interface ChoferIncidencia {
  nombre: string;
  cantidad: number;
}

interface IncidenciaAntigua {
  id: number;
  usuarioNombre: string;
  fechaReporte: string;
  estado: string;
}

interface IncidenciaAfectado {
  id: number;
  descripcion: string;
  usuarioNombre: string;
  fechaReporte: string;
  cantidadAfectados: number;
}

interface EmpresaIncidencia {
  nombreEmpresa: string;
  total: number;
  abiertas: number;
  pendientes: number;
  cerradas: number;
}

export default function DashboardPage() {
  const [choferes, setChoferes] = useState<ChoferIncidencia[]>([]);
  const [incidenciasAntiguas, setIncidenciasAntiguas] = useState<
    IncidenciaAntigua[]
  >([]);
  const [incidenciasAfectados, setIncidenciasAfectados] = useState<
    IncidenciaAfectado[]
  >([]);
  const [empresas, setEmpresas] = useState<EmpresaIncidencia[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const empresaId = localStorage.getItem("empresaId");

    if (!token || !empresaId) return;

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    fetch(
      `http://localhost:8080/api/dashboard/top-choferes?empresaId=${empresaId}`,
      { headers }
    )
      .then((res) => res.json())
      .then(setChoferes)
      .catch((err) => console.error("Error cargando top choferes:", err));

    fetch(
      `http://localhost:8080/api/incidencias/dashboard/incidencias-antiguas?empresaId=${empresaId}`,
      { headers }
    )
      .then((res) => res.json())
      .then(setIncidenciasAntiguas)
      .catch((err) =>
        console.error("Error cargando incidencias antiguas:", err)
      );

    fetch(
      `http://localhost:8080/api/dashboard/top-incidencias-afectados?empresaId=${empresaId}`,
      { headers }
    )
      .then((res) => res.json())
      .then(setIncidenciasAfectados)
      .catch((err) =>
        console.error("Error cargando incidencias con más afectados:", err)
      );

    fetch(
      `http://localhost:8080/api/dashboard/incidencias-por-empresa?empresaId=${empresaId}`,
      { headers }
    )
      .then((res) => res.json())
      .then(setEmpresas)
      .catch((err) =>
        console.error("Error cargando incidencias por empresa:", err)
      );
  }, []);

  const max = Math.max(...choferes.map((d) => d.cantidad), 1);

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

      {/* INCIDENCIAS SIN RESOLVER > 7 DÍAS */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="shadow-xl border-red-200">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-red-600 flex items-center gap-2">
              <AlertTriangle className="text-red-500" />
              Incidencias sin resolver hace más de 7 días
            </CardTitle>
          </CardHeader>
          <CardContent>
            {incidenciasAntiguas.length === 0 ? (
              <p className="text-gray-500">
                No hay incidencias antiguas pendientes.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Chofer</TableHead>
                    <TableHead>Fecha de Reporte</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {incidenciasAntiguas.map((i) => (
                    <TableRow key={i.id}>
                      <TableCell>{i.id}</TableCell>
                      <TableCell>{i.usuarioNombre}</TableCell>
                      <TableCell>
                        {new Date(i.fechaReporte).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            i.estado === "abierta"
                              ? "bg-green-100 text-green-800"
                              : i.estado === "pendiente"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {i.estado}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* TOP INCIDENCIAS CON MÁS AFECTADOS */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="shadow-xl border-purple-200">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-purple-700 flex items-center gap-2">
              <Activity className="text-purple-600" />
              Incidencias con más Afectados
            </CardTitle>
          </CardHeader>
          <CardContent>
            {incidenciasAfectados.length === 0 ? (
              <p className="text-gray-500">No hay registros disponibles.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Chofer</TableHead>
                    <TableHead>Fecha Reporte</TableHead>
                    <TableHead>Afectados</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {incidenciasAfectados.map((i) => (
                    <TableRow key={i.id}>
                      <TableCell>{i.id}</TableCell>
                      <TableCell>{i.descripcion}</TableCell>
                      <TableCell>{i.usuarioNombre}</TableCell>
                      <TableCell>
                        {new Date(i.fechaReporte).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{i.cantidadAfectados}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* TOP CHOFERES */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="shadow-xl border-blue-100">
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Trophy className="text-yellow-500" />
              Top Choferes con más Incidencias
            </CardTitle>
          </CardHeader>
          <CardContent>
            {choferes.length === 0 ? (
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
                  {choferes.map((c, i) => (
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
                            className={`h-2.5 rounded-full ${
                              i === 0
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

      {/* INCIDENCIAS POR EMPRESA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="shadow-xl border-green-200">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-green-700 flex items-center gap-2">
              <Building2 className="text-green-600" />
              Incidencias por Empresa
            </CardTitle>
          </CardHeader>
          <CardContent>
            {empresas.length === 0 ? (
              <p className="text-gray-500">No hay datos disponibles.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Empresa</TableHead>
                    <TableHead>Incidencias Reportadas</TableHead>
                    <TableHead>Abiertas</TableHead>
                    <TableHead>Pendientes</TableHead>
                    <TableHead>Cerradas</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {empresas.map((e, i) => (
                    <TableRow key={i}>
                      <TableCell>{e.nombreEmpresa}</TableCell>
                      <TableCell>{e.total}</TableCell>
                      <TableCell>{e.abiertas}</TableCell>
                      <TableCell>{e.pendientes}</TableCell>
                      <TableCell>{e.cerradas}</TableCell>
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
