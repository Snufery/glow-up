"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import WhatsAppFloat from "@/components/WhatsAppFloat";

export default function SiteNavbar() {
  const pathname = usePathname();

  if (pathname !== "/") return null;

  return (
    <>
      <Navbar />
      <WhatsAppFloat />
    </>
  );
}