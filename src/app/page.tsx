// app/set-role/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SetRolePage() {
  const router = useRouter();

  useEffect(() => {
    document.cookie = "role=user; path=/"; 
    router.replace("/");
  }, []);

  return <p>Asignando rol y redirigiendo...</p>;
}
