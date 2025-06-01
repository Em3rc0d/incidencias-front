export default function VehiculosPage() {
  const vehiculos = [
    { placa: 'ABC-123', marca: 'Toyota', modelo: 'Hilux', anio: 2018 },
    { placa: 'DEF-456', marca: 'Hyundai', modelo: 'Tucson', anio: 2020 },
    { placa: 'GHI-789', marca: 'Mercedes', modelo: 'Sprinter', anio: 2019 }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Lista de Vehículos</h1>

      <ul className="space-y-4">
        {vehiculos.map((v, i) => (
          <li
            key={i}
            className="p-4 rounded-xl shadow-md border border-gray-200 bg-white hover:shadow-lg transition"
          >
            <div className="text-lg font-semibold text-gray-700">{v.placa}</div>
            <div className="text-gray-600">
              {v.marca} {v.modelo} — <span className="font-medium">{v.anio}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
