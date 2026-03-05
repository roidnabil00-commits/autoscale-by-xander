"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function Tracker() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref) {
      // Simpan kode referal ke penyimpanan browser klien
      localStorage.setItem("autoscale_ref", ref.toUpperCase());
    }
  }, [searchParams]);

  return null; // Komponen ini tidak menampilkan antarmuka apa pun (invisible)
}

export default function ReferralTracker() {
  return (
    <Suspense fallback={null}>
      <Tracker />
    </Suspense>
  );
}