"use client";

import ProductPicker from "@/components/cotizador/ProductPicker";
import QuotePanel from "@/components/cotizador/QuotePanel";
import { QuoteProvider } from "@/context/QuoteContext";

export default function AdminCotizacionesPage() {
  return (
    <QuoteProvider>
      <div>
        <div className="mb-6">
          <h1 className="font-[var(--font-display)] text-xl sm:text-2xl font-bold mb-1">
            Generador de cotizaciones
          </h1>
          <p className="text-sm text-zinc-500">
            Herramienta interna. Los clientes no ven esta pagina.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_minmax(320px,380px)] gap-6">
          <div className="glass rounded-[var(--radius-xl)] p-5 sm:p-6">
            <ProductPicker />
          </div>
          <div className="xl:sticky xl:top-6 xl:self-start">
            <QuotePanel />
          </div>
        </div>
      </div>
    </QuoteProvider>
  );
}