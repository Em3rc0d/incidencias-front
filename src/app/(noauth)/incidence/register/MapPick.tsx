"use client";

import dynamic from "next/dynamic";

const MapPick = dynamic(() => import("./MapPickClient"), {
  ssr: false,
});

export default MapPick;
