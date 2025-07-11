"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { saveAs } from "file-saver";

export default function Warehouse() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const viewName = "view_incidencia_warehouse";

  useEffect(() => {
    fetch(`http://localhost:8080/api/warehouse/${viewName}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al cargar datos:", err);
        setLoading(false);
      });
  }, []);

  const headers = data.length > 0 ? Object.keys(data[0]) : [];

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Exportación de datos Warehouse", 14, 10);
    autoTable(doc, {
      head: [headers],
      body: data.map((row) => headers.map((key) => row[key])),
    });
    doc.save(`${viewName}.pdf`);
  };

  const exportTXT = () => {
    const lines = [headers.join("\t")];
    data.forEach((row) => {
      lines.push(headers.map((key) => row[key]).join("\t"));
    });
    const blob = new Blob([lines.join("\n")], {
      type: "text/plain;charset=utf-8",
    });
    saveAs(blob, `${viewName}.txt`);
  };

  const renderTable = () => {
    if (data.length === 0) {
      return (
        <p className="text-center text-muted-foreground">
          No hay datos disponibles.
        </p>
      );
    }

    return (
      <div className="overflow-auto rounded-lg border border-muted">
        <Table>
          <TableHeader className="bg-muted text-muted-foreground">
            <TableRow>
              {headers.map((key) => (
                <TableHead key={key} className="capitalize font-semibold">
                  {key}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={index}>
                {headers.map((key) => (
                  <TableCell key={key}>{row[key]}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <Card className="mt-8 mx-auto w-full max-w-7xl border border-border shadow-md">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">
            Data Warehouse: <span className="text-primary">{viewName}</span>
          </h2>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                Exportar <ChevronDown size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <CSVLink
                  data={data}
                  headers={headers.map((h) => ({ label: h, key: h }))}
                  filename={`${viewName}.csv`}
                  className="w-full h-full"
                >
                  CSV
                </CSVLink>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={exportPDF}>PDF</DropdownMenuItem>
              <DropdownMenuItem onClick={exportTXT}>TXT</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : (
          renderTable()
        )}
      </CardContent>
    </Card>
  );
}
