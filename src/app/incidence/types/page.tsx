import { Button } from "@/components/ui/button";

export default function TiposIncidenciaPage() {
  const tipos = [
    { nombre: 'Accidente', descripcion: 'Incidente que involucra daño físico o material' },
    { nombre: 'Mantenimiento', descripcion: 'Revisión o reparación programada' },
    { nombre: 'Avería mecánica', descripcion: 'Falla técnica del vehículo' }
  ];

  return (
    <div className="max-w-4xl mx-auto mt-20 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Tipos de Incidencia</h1>
      <Button className="mb-2">Agregar tipo de Incidencia</Button>
      <ul className="space-y-4">
        {tipos.map((t, i) => (
          <li
            key={i}
            className="border rounded-lg shadow-sm p-4 bg-white"
          >
            <p className="font-semibold text-lg">{t.nombre}</p>
            <p className="text-gray-600">{t.descripcion}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
