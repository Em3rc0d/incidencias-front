import Navbar from "@/components/custom/Navigation";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="pt-20"> {/* Espacio para navbar fija */}
        {children}
      </main>
    </>
  );
}
