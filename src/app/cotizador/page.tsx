"use client";

import CotizadorNav from "@/components/cotizador/CotizadorNav";
import HouseVisual from "@/components/cotizador/HouseVisual";
import ProductPicker from "@/components/cotizador/ProductPicker";
import QuotePanel from "@/components/cotizador/QuotePanel";
import { useQuote } from "@/context/QuoteContext";
import { formatCOP } from "@/lib/quote";

function MobileQuoteBar() {
  const { totals } = useQuote();

  if (totals.itemCount === 0) return null;

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[900] glass border-t border-white/[0.08] px-5 py-3 flex items-center justify-between">
      <div>
        <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Total estimado</p>
        <p className="text-lg font-bold font-[var(--font-display)] text-gradient">
          {formatCOP(totals.grandTotal)}
        </p>
      </div>
      <p className="text-xs text-zinc-400">
        {totals.itemCount} producto{totals.itemCount !== 1 ? "s" : ""}
      </p>
    </div>
  );
}

export default function CotizadorPage() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(43,188,179,0.1),transparent)] pointer-events-none" />
      <div className="absolute inset-0 opacity-20 pointer-events-none noise-overlay" />

      <CotizadorNav />

      <main className="relative max-w-[1440px] mx-auto px-5 sm:px-8 pt-[88px] pb-24 lg:pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] gap-6 lg:gap-8 min-h-[calc(100dvh-120px)]">
          <div className="lg:sticky lg:top-[88px] lg:self-start lg:h-[calc(100dvh-108px)]">
            <HouseVisual />
          </div>

          <div className="flex flex-col gap-6 lg:gap-8">
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_minmax(320px,380px)] gap-6 lg:gap-8">
              <div className="glass rounded-[var(--radius-xl)] p-5 sm:p-6">
                <ProductPicker />
              </div>

              <div className="xl:sticky xl:top-[88px] xl:self-start">
                <QuotePanel />
              </div>
            </div>
          </div>
        </div>
      </main>

      <MobileQuoteBar />
    </div>
  );
}