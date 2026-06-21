"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calculator } from "lucide-react";
import { useQuote } from "@/context/QuoteContext";

export default function CotizadorNav() {
  const { totals } = useQuote();

  return (
    <nav className="fixed top-0 left-0 right-0 z-[1000] glass border-b border-white/[0.08]">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 h-[68px] flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 text-zinc-400 hover:text-white transition-colors group">
          <ArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
          <Image src="/logo.png" alt="Glow Up" width={36} height={36} className="h-9 w-9 object-contain" />
          <span className="hidden sm:block text-sm font-semibold font-[var(--font-display)]">
            <span className="text-[var(--accent-bright)]">Glow</span>{" "}
            <span className="text-[var(--accent)]">Up</span>
          </span>
        </Link>

        <div className="flex items-center gap-2 text-[var(--accent)]">
          <Calculator size={18} />
          <span className="text-sm font-semibold font-[var(--font-display)]">Simulador de Cotizacion</span>
        </div>

        <div className="flex items-center gap-3">
          {totals.itemCount > 0 && (
            <span className="hidden sm:inline text-xs text-zinc-500">
              {totals.itemCount} producto{totals.itemCount !== 1 ? "s" : ""}
            </span>
          )}
          <Link
            href="/#contacto"
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-zinc-950 rounded-xl bg-gradient-brand glow-cyan transition-all hover:-translate-y-0.5"
          >
            Contacto
          </Link>
        </div>
      </div>
    </nav>
  );
}