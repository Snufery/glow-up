"use client";

import CotizadorNav from "@/components/cotizador/CotizadorNav";
import HouseVisual from "@/components/cotizador/HouseVisual";
import ProductPicker from "@/components/cotizador/ProductPicker";
import QuotePanel from "@/components/cotizador/QuotePanel";
import MobileCartSheet from "@/components/cotizador/MobileCartSheet";

export default function CotizadorPage() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(43,188,179,0.1),transparent)] pointer-events-none" />
      <div className="absolute inset-0 opacity-20 pointer-events-none noise-overlay" />

      <CotizadorNav />

      <main className="relative max-w-[1440px] mx-auto px-5 sm:px-8 pt-[88px] pb-28 xl:pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] gap-6 lg:gap-8 min-h-[calc(100dvh-120px)]">
          <div className="lg:sticky lg:top-[88px] lg:self-start lg:h-[calc(100dvh-108px)]">
            <HouseVisual />
          </div>

          <div className="flex flex-col gap-6 lg:gap-8">
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_minmax(320px,380px)] gap-6 lg:gap-8">
              <div className="glass rounded-[var(--radius-xl)] p-5 sm:p-6">
                <ProductPicker />
              </div>

              <div className="hidden xl:block xl:sticky xl:top-[88px] xl:self-start">
                <QuotePanel />
              </div>
            </div>
          </div>
        </div>
      </main>

      <MobileCartSheet />
    </div>
  );
}