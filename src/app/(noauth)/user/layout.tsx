// app/layout.tsx
import Navbar from "@/components/custom/Navigation";
import Link from "next/link";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}

      <Link href="/user/secure">
        <button
          className="fixed bottom-6 right-6 bg-red-600 hover:bg-red-700 text-white rounded-full px-5 py-3 shadow-lg text-sm font-semibold transition-all"
          title="Ir a zona segura"
        >
          🚨 ¿Tienes alguna emergencia?
        </button>
      </Link>
    </>
  );
}
