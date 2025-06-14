export default function DashboardPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">Bienvenido al Dashboard</h1>
      <p className="text-lg text-gray-600">
        Aquí podrás gestionar todas las funcionalidades de la aplicación.
      </p>
      <div className="mt-8">
        <img
          src="/dashboard-image.png"
          alt="Dashboard"
          className="w-64 h-64 object-cover"
        />
      </div>
    </div>
  );
}