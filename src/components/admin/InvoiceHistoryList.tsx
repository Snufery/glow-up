"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronDown, ChevronUp, History, Loader2, RefreshCw } from "lucide-react";
import type { StoredInvoice } from "@/lib/db/types";
import { formatCOP } from "@/lib/quote";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function InvoiceHistoryList() {
  const [invoices, setInvoices] = useState<StoredInvoice[]>([]);
  const [configured, setConfigured] = useState(true);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const loadInvoices = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/invoices?limit=50");
      if (!res.ok) throw new Error("fetch failed");
      const data = (await res.json()) as { configured: boolean; invoices: StoredInvoice[] };
      setConfigured(data.configured);
      setInvoices(data.invoices);
    } catch {
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadInvoices();
  }, [loadInvoices]);

  return (
    <section className="mt-10 glass rounded-2xl border border-white/[0.06] overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <History size={16} className="text-[var(--accent)]" />
          <h2 className="text-sm font-bold">Historial de facturas</h2>
        </div>
        <button
          type="button"
          onClick={() => void loadInvoices()}
          disabled={loading}
          className="text-xs text-zinc-500 hover:text-white flex items-center gap-1 cursor-pointer disabled:opacity-50"
        >
          <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
          Actualizar
        </button>
      </div>

      {!configured ? (
        <p className="px-5 py-6 text-sm text-zinc-500">
          Configura <code className="text-zinc-400">DATABASE_URL</code> en Vercel (Neon Postgres)
          para guardar el historial.
        </p>
      ) : loading ? (
        <div className="px-5 py-8 flex justify-center text-zinc-500">
          <Loader2 size={20} className="animate-spin" />
        </div>
      ) : invoices.length === 0 ? (
        <p className="px-5 py-6 text-sm text-zinc-500">
          Aun no hay facturas guardadas. Se registran al descargar el PDF.
        </p>
      ) : (
        <ul className="divide-y divide-white/[0.04]">
          {invoices.map((invoice) => {
            const expanded = expandedId === invoice.id;
            return (
              <li key={invoice.id}>
                <button
                  type="button"
                  onClick={() => setExpandedId(expanded ? null : invoice.id)}
                  className="w-full px-5 py-4 text-left hover:bg-white/[0.02] transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate">{invoice.customer.name}</p>
                      <p className="text-xs text-zinc-500 mt-0.5">{invoice.invoiceNumber}</p>
                      <p className="text-xs text-zinc-600 mt-1">
                        {formatDate(invoice.createdAt)} · Vence {invoice.dueAt}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-sm font-bold text-gradient">
                        {formatCOP(invoice.total)}
                      </span>
                      {expanded ? (
                        <ChevronUp size={14} className="text-zinc-500" />
                      ) : (
                        <ChevronDown size={14} className="text-zinc-500" />
                      )}
                    </div>
                  </div>
                </button>

                {expanded && (
                  <div className="px-5 pb-4 space-y-2">
                    {invoice.items.map((item) => (
                      <div
                        key={item.id}
                        className="text-xs text-zinc-400 flex justify-between gap-3"
                      >
                        <span className="truncate">
                          {item.quantity}x {item.description}
                        </span>
                        <span className="flex-shrink-0">
                          {formatCOP(item.quantity * item.unitPrice)}
                        </span>
                      </div>
                    ))}
                    {invoice.includeTax && (
                      <p className="text-[10px] text-zinc-600">IVA incluido: {formatCOP(invoice.tax)}</p>
                    )}
                    {invoice.pdfFilename && (
                      <p className="text-[10px] text-zinc-600 pt-1">PDF: {invoice.pdfFilename}</p>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}