"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  ChevronUp,
  FileDown,
  FileText,
  History,
  Loader2,
  Pencil,
  RefreshCw,
} from "lucide-react";
import type { StoredQuote } from "@/lib/db/types";
import { formatCOP } from "@/lib/quote";
import { formatPhoneDisplay } from "@/lib/quoteCustomer";
import { formatQuoteDisplayNumber } from "@/lib/quoteToPdfLines";
import { downloadPdfViaFetch } from "@/lib/downloadPdf";
import type { InvoiceData } from "@/lib/invoice";

const INVOICE_DRAFT_KEY = "glowup-invoice-draft";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface QuoteHistoryListProps {
  className?: string;
}

export default function QuoteHistoryList({ className = "" }: QuoteHistoryListProps) {
  const router = useRouter();
  const [quotes, setQuotes] = useState<StoredQuote[]>([]);
  const [configured, setConfigured] = useState(true);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [actionId, setActionId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const loadQuotes = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/quotes?limit=50");
      if (!res.ok) throw new Error("fetch failed");
      const data = (await res.json()) as { configured: boolean; quotes: StoredQuote[] };
      setConfigured(data.configured);
      setQuotes(data.quotes);
    } catch {
      setQuotes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadQuotes();
  }, [loadQuotes]);

  const handleDownloadPdf = async (quote: StoredQuote) => {
    setActionId(quote.id);
    setActionError(null);
    try {
      const filename = quote.pdfFilename || `GlowUp-Cotizacion-${quote.quoteRef}.pdf`;
      await downloadPdfViaFetch(`/api/admin/quotes/${quote.id}/pdf`, {}, filename, "GET");
    } catch {
      setActionError("No se pudo descargar el PDF de la cotización.");
    } finally {
      setActionId(null);
    }
  };

  const handleGenerateInvoicePdf = async (quote: StoredQuote) => {
    setActionId(quote.id);
    setActionError(null);
    try {
      const filename = `GlowUp-Factura-${quote.customerName.split(/\s+/)[0] || "Cliente"}.pdf`;
      await downloadPdfViaFetch(
        `/api/admin/quotes/${quote.id}/invoice-pdf`,
        {},
        filename,
        "POST"
      );
      void loadQuotes();
    } catch {
      setActionError("No se pudo generar el PDF de la factura.");
    } finally {
      setActionId(null);
    }
  };

  const handleEditAsInvoice = async (quote: StoredQuote) => {
    setActionId(quote.id);
    setActionError(null);
    try {
      const res = await fetch(`/api/admin/quotes/${quote.id}/convert`, { method: "POST" });
      const data = (await res.json()) as {
        ok?: boolean;
        invoice?: InvoiceData;
        error?: string;
      };

      if (!res.ok || !data.invoice) {
        throw new Error(data.error || "No se pudo convertir la cotización");
      }

      sessionStorage.setItem(INVOICE_DRAFT_KEY, JSON.stringify(data.invoice));
      router.push("/admin/facturas?fromQuote=1");
      void loadQuotes();
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Error al convertir a factura."
      );
    } finally {
      setActionId(null);
    }
  };

  return (
    <section className={`glass rounded-2xl border border-white/[0.06] overflow-hidden ${className}`}>
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <History size={16} className="text-[var(--accent)]" />
          <h2 className="text-sm font-bold">Historial de cotizaciones</h2>
        </div>
        <button
          type="button"
          onClick={() => void loadQuotes()}
          disabled={loading}
          className="text-xs text-zinc-500 hover:text-white flex items-center gap-1 cursor-pointer disabled:opacity-50"
        >
          <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
          Actualizar
        </button>
      </div>

      {actionError && (
        <p className="px-5 py-3 text-xs text-red-400 border-b border-white/[0.04]">
          {actionError}
        </p>
      )}

      {!configured ? (
        <p className="px-5 py-6 text-sm text-zinc-500">
          Configura <code className="text-zinc-400">DATABASE_URL</code> en Vercel (Neon Postgres)
          para guardar el historial.
        </p>
      ) : loading ? (
        <div className="px-5 py-8 flex justify-center text-zinc-500">
          <Loader2 size={20} className="animate-spin" />
        </div>
      ) : quotes.length === 0 ? (
        <p className="px-5 py-6 text-sm text-zinc-500">
          Aun no hay cotizaciones guardadas. Se registran al generar un PDF.
        </p>
      ) : (
        <ul className="divide-y divide-white/[0.04]">
          {quotes.map((quote) => {
            const expanded = expandedId === quote.id;
            const isBusy = actionId === quote.id;
            const displayNumber = formatQuoteDisplayNumber(
              quote.quoteNumber ?? null,
              quote.quoteRef
            );

            return (
              <li key={quote.id}>
                <button
                  type="button"
                  onClick={() => setExpandedId(expanded ? null : quote.id)}
                  className="w-full px-5 py-4 text-left hover:bg-white/[0.02] transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate">{quote.customerName}</p>
                      <p className="text-xs text-zinc-500 mt-0.5">
                        Nº {displayNumber} · {quote.quoteRef} ·{" "}
                        {formatPhoneDisplay(quote.customerPhone)}
                      </p>
                      <p className="text-xs text-zinc-600 mt-1">{formatDate(quote.createdAt)}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {quote.convertedToInvoice && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-emerald-500/15 text-emerald-400">
                          Facturada
                        </span>
                      )}
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                          quote.source === "admin"
                            ? "bg-[var(--accent)]/15 text-[var(--accent-bright)]"
                            : "bg-white/[0.06] text-zinc-400"
                        }`}
                      >
                        {quote.source === "admin" ? "Admin" : "Publico"}
                      </span>
                      <span className="text-sm font-bold text-gradient">
                        {formatCOP(quote.grandTotal)}
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
                  <div className="px-5 pb-4 space-y-3">
                    {quote.customerAddress && (
                      <p className="text-xs text-zinc-500">{quote.customerAddress}</p>
                    )}
                    {quote.items.map((item) => (
                      <div
                        key={item.id}
                        className="text-xs text-zinc-400 flex justify-between gap-3"
                      >
                        <span className="truncate">
                          {item.quantity}x {item.name}
                          {item.colorLabel ? ` (${item.colorLabel})` : ""}
                        </span>
                        <span className="flex-shrink-0">
                          {formatCOP(item.unitPrice * item.quantity)}
                        </span>
                      </div>
                    ))}

                    <div className="flex flex-wrap gap-2 pt-2">
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => void handleDownloadPdf(quote)}
                        className="text-xs font-semibold px-3 py-2 rounded-lg border border-white/[0.08] text-zinc-300 hover:text-white hover:border-white/[0.15] flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        {isBusy ? (
                          <Loader2 size={12} className="animate-spin" />
                        ) : (
                          <FileDown size={12} />
                        )}
                        Cotización PDF
                      </button>
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => void handleGenerateInvoicePdf(quote)}
                        className="text-xs font-semibold px-3 py-2 rounded-lg bg-[var(--accent)]/15 border border-[var(--accent)]/30 text-[var(--accent-bright)] hover:bg-[var(--accent)]/25 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        {isBusy ? (
                          <Loader2 size={12} className="animate-spin" />
                        ) : (
                          <FileText size={12} />
                        )}
                        Factura PDF
                      </button>
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => void handleEditAsInvoice(quote)}
                        className="text-xs font-semibold px-3 py-2 rounded-lg border border-white/[0.08] text-zinc-400 hover:text-white hover:border-white/[0.15] flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        <Pencil size={12} />
                        Editar en facturas
                      </button>
                    </div>
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