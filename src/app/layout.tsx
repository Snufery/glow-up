import type { Metadata } from "next";
import { Syne, Outfit } from "next/font/google";
import "./globals.css";

const syne = Syne({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const outfit = Outfit({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Glow Up — Entornos Inteligentes | Domotica en Popayan",
  description:
    "Disenamos, instalamos y automatizamos hogares y negocios con tecnologia de vanguardia en Popayan, Colombia. Domotica, instalaciones electricas y seguridad inteligente.",
  keywords: [
    "domotica",
    "popayan",
    "hogar inteligente",
    "instalaciones electricas",
    "automatizacion",
    "seguridad inteligente",
    "cauca",
    "colombia",
  ],
  openGraph: {
    title: "Glow Up — Entornos Inteligentes",
    description: "Domotica y automatizacion en Popayan, Colombia",
    type: "website",
    locale: "es_CO",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${syne.variable} ${outfit.variable}`}>
      <body className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-[var(--font-body)] antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
