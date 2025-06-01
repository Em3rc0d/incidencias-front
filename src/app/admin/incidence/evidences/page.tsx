export default function EvidenciasPage() {
  const evidencias = [
    { url: 'http://imagenes.com/choque1.jpg', tipo: 'imagen' },
    { url: 'http://videos.com/choque1.mp4', tipo: 'video' },
    { url: 'http://documentos.com/reporte_frenos.pdf', tipo: 'documento' }
  ];

  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold text-gray-700 mb-2">Archivos relacionados:</p>
      <ul className="space-y-2">
        {evidencias.map((e, i) => (
          <li
            key={i}
            className="border rounded p-3 bg-gray-50 flex justify-between items-center"
          >
            <a
              href={e.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline break-all text-sm"
            >
              {e.url}
            </a>
            <span className="text-xs font-medium text-gray-500 capitalize">
              {e.tipo}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
