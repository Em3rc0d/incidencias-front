export default function AfectadosPage() {
  const afectados = [
    {
      nombre: "Luis Fernandez",
      tipo: "persona",
      descripcion: "Lesiones leves",
    },
    {
      nombre: "Vehículo ABC-123",
      tipo: "vehiculo",
      descripcion: "Daño en parachoques trasero",
    },
    {
      nombre: "Infraestructura puente XYZ",
      tipo: "infraestructura",
      descripcion: "Daño parcial en barandas",
    },
  ];

  const tipoColor: Record<string, string> = {
    persona: "bg-blue-100 text-blue-800",
    vehiculo: "bg-yellow-100 text-yellow-800",
    infraestructura: "bg-red-100 text-red-800",
  };

  return (
    <div className="max-w-3xl mx-auto my-auto px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Afectados
      </h1>
      <ul className="space-y-4">
        {afectados.map((a, i) => (
          <li key={i} className="border rounded-lg p-4 bg-white shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-gray-800">
                {a.nombre}
              </h2>
              <span
                className={`text-xs px-2 py-1 rounded-full font-medium ${
                  tipoColor[a.tipo]
                }`}
              >
                {a.tipo}
              </span>
            </div>
            <p className="text-sm text-gray-600">{a.descripcion}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
