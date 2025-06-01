export default function UsuariosPage() {
  const usuarios = [
    { nombre: 'Juan Perez', correo: 'juan.perez@mail.com', rol: 'conductor' },
    { nombre: 'Maria Lopez', correo: 'maria.lopez@mail.com', rol: 'tecnico' },
    { nombre: 'Carlos Gomez', correo: 'carlos.gomez@mail.com', rol: 'admin' }
  ];
  const empresa = "Orion";

  const rolColor = {
    conductor: "text-blue-600 font-semibold",
    tecnico: "text-yellow-600 font-semibold",
    admin: "text-red-600 font-semibold",
  };

  return (
    <div className="max-w-4xl mx-auto mt-20 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Personal de {empresa}</h1>
      <ul className="space-y-4">
        {usuarios.map((u, i) => (
          <li
            key={i}
            className="border rounded-lg shadow p-4 bg-white flex flex-col gap-1"
          >
            <p className="text-lg font-medium">{u.nombre}</p>
            <p className="text-sm text-gray-600">{u.correo}</p>
            <span className={`text-sm ${rolColor[u.rol as keyof typeof rolColor]}`}>
              Rol: {u.rol}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
