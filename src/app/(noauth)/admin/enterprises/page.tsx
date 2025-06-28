export function EmpresasPage() {
  const empresas = [
    { nombre: 'Transportes XYZ S.A.', ruc: '20123456789' },
    { nombre: 'Logística ABC S.R.L.', ruc: '20456789123' },
  ];

  return (
    <section className="max-w-4xl mx-auto mt-20 px-4">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
        Empresas Registradas
      </h1>
      <div className="grid gap-6">
        {empresas.map((e, i) => (
          <div key={i} className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold text-gray-900">{e.nombre}</h2>
            <p className="text-sm text-gray-600">RUC: {e.ruc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}