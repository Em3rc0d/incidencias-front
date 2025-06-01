export default function HistorialUsoPage() {
  const historial = [
    { vehiculo: 'ABC-123', usuario: 'Juan Perez', vueltas: 5 },
    { vehiculo: 'ABC-123', usuario: 'Maria Lopez', vueltas: 3 },
    { vehiculo: 'GHI-789', usuario: 'Juan Perez', vueltas: 10 }
  ];

  return (
    <div>
      <h1>Historial de Uso de Vehículos</h1>
      <ul>
        {historial.map((h, i) => (
          <li key={i}>{h.vehiculo} - {h.usuario} - Vueltas: {h.vueltas}</li>
        ))}
      </ul>
    </div>
  );
}
