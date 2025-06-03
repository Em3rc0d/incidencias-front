export default function ReportesAseguradoraPage() {
  const reportes = [
    { asunto: 'Reporte accidente vehicular', estado: 'enviado' },
    { asunto: 'Reporte falla mecánica', estado: 'pendiente' }
  ];

  return (
    <div className="max-w-3xl mx-auto mt-20 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Reportes a Aseguradora
      </h1>
      <ul className="space-y-4">
        {reportes.map((r, i) => (
          <li
            key={i}
            className="bg-white shadow-md rounded-lg p-4 border-l-4"
            style={{
              borderLeftColor: r.estado === 'enviado' ? '#22c55e' : '#facc15' // verde o amarillo
            }}
          >
            <p className="text-lg font-semibold text-gray-900">{r.asunto}</p>
            <p className="text-sm text-gray-600">
              Estado:{' '}
              <span className={`font-bold ${r.estado === 'enviado' ? 'text-green-600' : 'text-yellow-600'}`}>
                {r.estado}
              </span>
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
