export default function EmpresasPage() {
  const empresas = [
    { nombre: 'Transportes XYZ S.A.', ruc: '20123456789' },
    { nombre: 'Logística ABC S.R.L.', ruc: '20456789123' }
  ];

  return (
    <div className="max-w-3xl mx-auto mt-20 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Empresas Registradas
      </h1>
      <ul className="space-y-4">
        {empresas.map((e, i) => (
          <li key={i} className="bg-white p-4 rounded-lg shadow-md">
            <p className="text-lg font-semibold text-gray-900">{e.nombre}</p>
            <p className="text-gray-600">RUC: {e.ruc}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
