"use client";

import Link from "next/link";
import { useState } from "react";
import { History } from "lucide-react";
import AdminQuoteExtras from "@/components/admin/AdminQuoteExtras";
import ProductPicker from "@/components/cotizador/ProductPicker";
import QuotePanel from "@/components/cotizador/QuotePanel";
import { QuoteProvider } from "@/context/QuoteContext";
import { companyLegal } from "@/data/company";
import type { QuoteDocumentExtras } from "@/lib/quoteCustomer";

export default function AdminCotizacionesPage() {
  const [documentExtras, setDocumentExtras] = useState<QuoteDocumentExtras>({
    engineer: companyLegal.defaultEngineer,
  });

  return (
    <QuoteProvider>
      <div>
        <div className="mb-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="font-[var(--font-display)] text-xl sm:text-2xl font-bold mb-1">
              Generador de cotizaciones
            </h1>
            <p className="text-sm text-zinc-500">
              Herramienta interna. Los clientes no ven esta pagina.
            </p>
          </div>
          <Link
            href="/admin/cotizaciones/historial"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border border-[var(--accent)]/25 bg-[var(--accent)]/10 text-[var(--accent-bright)] hover:bg-[var(--accent)]/18 hover:border-[var(--accent)]/35 transition-all shrink-0 self-start"
          >
            <History size={14} />
            Ver historial de cotizaciones
          </Link>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_minmax(320px,380px)] gap-6">
          <div className="space-y-6">
            <div className="glass rounded-[var(--radius-xl)] p-5 sm:p-6">
              <ProductPicker />
            </div>
            <AdminQuoteExtras value={documentExtras} onChange={setDocumentExtras} />
          </div>
          <div className="xl:sticky xl:top-6 xl:self-start">
            <QuotePanel documentExtras={documentExtras} />
          </div>
        </div>
      </div>
    </QuoteProvider>
  );
}