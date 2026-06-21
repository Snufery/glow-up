import type { Metadata } from "next";
import { QuoteProvider } from "@/context/QuoteContext";

export const metadata: Metadata = {
  title: "Simulador de Cotizacion — Glow Up Entornos Inteligentes",
  description:
    "Arma tu cotizacion estimada de domotica: selecciona productos, activa instalacion y enviala por WhatsApp.",
};

export default function CotizadorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <QuoteProvider>{children}</QuoteProvider>;
}