"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calculator, ShoppingBag } from "lucide-react";
import { useQuote } from "@/context/QuoteContext";

export default function CotizadorNav() {
  const { totals, openMobileCart } = useQuote();

  return (
    <nav className="fixed top-0 left-0 right-0 z-[1000] glass border-b border-white/[0.08]">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 h-[68px] flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 text-zinc-400 hover:text-white transition-colors group">
          <ArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
          <Image src="/logo.png" alt="Glow Up" width={36} height={36} className="h-9 w-9 object-contain" />
          <span className="hidden sm:block text-sm font-semibold font-[var(--font-display)]">
            <span className="text-brand-glow">Glow</span>{" "}
            <span className="text-brand-up">Up</span>
          </span>
        </Link>

        <div className="flex items-center gap-2 text-[var(--accent)]">
          <Calculator size={18} />
          <span className="text-sm font-semibold font-[var(--font-display)]">Simulador de Cotizacion</span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {totals.itemCount > 0 && (
            <>
              <button
                type="button"
                onClick={openMobileCart}
                className="xl:hidden relative w-10 h-10 rounded-xl border border-white/[0.08] bg-white/[0.04] flex items-center justify-center text-[var(--accent-bright)] hover:border-[var(--accent)]/30 transition-all cursor-pointer"
                aria-label={`Ver carrito, ${totals.itemCount} productos`}
              >
                <ShoppingBag size={18} />
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-gradient-brand text-[9px] font-bold text-zinc-950 flex items-center justify-center">
                  {totals.itemCount}
                </span>
              </button>
              <span className="hidden sm:inline text-xs text-zinc-500">
                {totals.itemCount} producto{totals.itemCount !== 1 ? "s" : ""}
              </span>
            </>
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