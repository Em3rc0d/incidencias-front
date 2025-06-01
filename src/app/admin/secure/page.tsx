export default function AseguradorasPage() {
  const aseguradora = {
    nombre: "Seguros Perú",
    correo_contacto: "contacto@segurosperu.com",
    telefono: "987654321",
    emergencias: [
      { tipo: "Asistencia en carretera", numero: "0800-12345" },
      { tipo: "Reportar accidente", numero: "0800-54321" },
      { tipo: "Atención médica", numero: "0800-99999" },
    ],
  };

  const emergenciaNacional = [
    { tipo: "Bomberos", numero: "116" },
    { tipo: "Policía Nacional", numero: "105" },
    { tipo: "SAMU (ambulancia)", numero: "106" },
    { tipo: "Defensa Civil", numero: "115" },
  ];

  const empresa = "Orion";

  return (
    <div className="max-w-4xl mx-auto mt-20 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Aseguradora de {empresa}
      </h1>

      <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto text-center">
        <p className="text-xl font-semibold mb-2">{aseguradora.nombre}</p>
        <p className="text-gray-700 mb-1">
          📧{" "}
          <a
            href={`mailto:${aseguradora.correo_contacto}`}
            className="text-blue-600 underline"
          >
            {aseguradora.correo_contacto}
          </a>
        </p>
        <p className="text-gray-700 mb-4">
          📞{" "}
          <a
            href={`tel:${aseguradora.telefono}`}
            className="text-blue-600 underline"
          >
            {aseguradora.telefono}
          </a>
        </p>

        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          Emergencias de la aseguradora:
        </h2>
        <ul className="text-left text-gray-700 space-y-1 mb-6">
          {aseguradora.emergencias.map((e, i) => (
            <li
              key={i}
              className="flex justify-between items-center border-b py-1"
            >
              <span>🚨 {e.tipo}</span>
              <a href={`tel:${e.numero}`} className="text-blue-600 font-medium">
                {e.numero}
              </a>
            </li>
          ))}
        </ul>

        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          Números de emergencia nacionales:
        </h2>
        <ul className="text-left text-gray-700 space-y-1">
          {emergenciaNacional.map((e, i) => (
            <li
              key={i}
              className="flex justify-between items-center border-b py-1"
            >
              <span>🆘 {e.tipo}</span>
              <a href={`tel:${e.numero}`} className="text-blue-600 font-medium">
                {e.numero}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
