"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Trash2,
  Minus,
  Plus,
  Wrench,
  ShoppingBag,
  AlertCircle,
  FileDown,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { useQuote } from "@/context/QuoteContext";
import { calcLineInstallation, calcLineSubtotal, formatCOP } from "@/lib/quote";
import { formatPriceRange } from "@/lib/quoteRecommendations";
import { useQuoteRecommendations } from "@/hooks/useQuoteRecommendations";
import { generateAndSendQuote } from "@/lib/generateQuotePdf";
import type { QuoteCustomerInfo, QuoteDocumentExtras } from "@/lib/quoteCustomer";
import QuoteCustomerModal from "./QuoteCustomerModal";
import QuoteIncludesSummary from "./QuoteIncludesSummary";
import { useCotizadorFlowOptional } from "@/context/CotizadorFlowContext";
import { trackEvent } from "@/lib/analytics/track";

interface QuotePanelProps {
  variant?: "sidebar" | "sheet";
  documentExtras?: QuoteDocumentExtras;
}

export default function QuotePanel({ variant = "sidebar", documentExtras }: QuotePanelProps) {
  const isSheet = variant === "sheet";
  const pathname = usePathname();
  const quoteSource = pathname.startsWith("/admin") ? "admin" : "public";
  const { items, totals, removeItem, updateQuantity, toggleInstallation, clearQuote } = useQuote();
  const flow = useCotizadorFlowOptional();
  const { priceRange, hasBlockingIssues } = useQuoteRecommendations();
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastSentRef, setLastSentRef] = useState<string | null>(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showIncludesStep, setShowIncludesStep] = useState(false);

  const resetIncludesReviewed = flow?.resetIncludesReviewed;

  useEffect(() => {
    resetIncludesReviewed?.();
  }, [items, resetIncludesReviewed]);

  const handleOpenCustomerModal = () => {
    if (items.length === 0 || isGenerating) return;
    if (flow && !flow.includesReviewed) {
      setShowIncludesStep(true);
      return;
    }
    setShowCustomerModal(true);
  };

  const handleIncludesConfirm = () => {
    flow?.markIncludesReviewed();
    setShowIncludesStep(false);
    setShowCustomerModal(true);
  };

  const handleGenerateAndSend = async (
    customer: QuoteCustomerInfo,
    turnstileToken?: string
  ) => {
    if (items.length === 0 || isGenerating) return;
    setIsGenerating(true);
    setLastSentRef(null);
    try {
      const customerWithAddress: QuoteCustomerInfo = {
        ...customer,
        address: documentExtras?.customerAddress?.trim() || customer.address,
      };
      const result = await generateAndSendQuote(items, customerWithAddress, {
        source: quoteSource,
        extras: documentExtras,
        turnstileToken: quoteSource === "public" ? turnstileToken : undefined,
      });
      setLastSentRef(result.quoteRef);
      if (quoteSource === "public") {
        trackEvent("cotizador_pdf_generated", {
          itemCount: items.length,
          grandTotal: totals.grandTotal,
        });
      }
      setShowCustomerModal(false);
    } catch (err) {
      console.error("Error generando cotizacion:", err);
      alert("No se pudo generar el PDF. Intenta de nuevo.");
    } finally {
      setIsGenerating(false);
    }
  };

  if (items.length === 0) {
    const emptyState = (
      <div className={`p-8 h-full flex flex-col items-center justify-center text-center ${isSheet ? "" : "min-h-[400px]"}`}>
        <div className="w-16 h-16 rounded-2xl bg-[var(--accent)]/8 border border-[var(--accent)]/20 flex items-center justify-center text-[var(--accent)] mb-5">
          <ShoppingBag size={28} />
        </div>
        <h3 className="font-[var(--font-display)] text-lg font-bold mb-2">Tu cotizacion esta vacia</h3>
        <p className="text-sm text-zinc-500 max-w-[260px] leading-relaxed">
          Agrega productos desde el catalogo. El total se actualizara automaticamente.
        </p>
      </div>
    );

    if (isSheet) return emptyState;
    return (
      <div className="glass rounded-[var(--radius-xl)] h-full">
        {emptyState}
      </div>
    );
  }

  const panelContent = (
    <>
      {!isSheet && (
        <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
          <div>
            <h3 className="font-[var(--font-display)] text-base font-bold">Tu cotizacion</h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              {totals.itemCount} producto{totals.itemCount !== 1 ? "s" : ""} seleccionado{totals.itemCount !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={clearQuote}
            className="text-xs text-zinc-500 hover:text-red-400 transition-colors cursor-pointer"
          >
            Vaciar
          </button>
        </div>
      )}

      {isSheet && (
        <div className="px-5 pt-3 pb-1 flex justify-end">
          <button
            onClick={clearQuote}
            className="text-xs text-zinc-500 hover:text-red-400 transition-colors cursor-pointer"
          >
            Vaciar carrito
          </button>
        </div>
      )}

      <div className={`flex-1 px-5 py-4 space-y-3 ${isSheet ? "" : "overflow-y-auto max-h-[420px] lg:max-h-none"}`}>
        {items.map((item) => {
          const lineTotal = calcLineSubtotal(item);
          const lineInstall = calcLineInstallation(item);

          return (
            <div
              key={item.id}
              className="premium-card p-4 space-y-3"
            >
              <div className="flex gap-3">
                {item.image && (
                  <div className="relative w-12 h-12 rounded-lg bg-zinc-900 overflow-hidden flex-shrink-0">
                    <Image src={item.image} alt={item.name} fill sizes="48px" className="object-cover" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold leading-snug">{item.name}</h4>
                  <p className="text-[11px] text-zinc-500 mt-0.5">
                    {item.roomLabel && (
                      <span className="text-[var(--accent)]/80">{item.roomLabel}</span>
                    )}
                    {item.roomLabel && (item.channels || item.colorLabel) && " · "}
                    {item.channels && `${item.channels} canal${item.channels > 1 ? "es" : ""}`}
                    {item.channels && item.colorLabel && " · "}
                    {item.colorLabel}
                  </p>
                  <p className="text-sm font-bold text-gradient mt-1.5">{formatCOP(lineTotal)}</p>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="flex-shrink-0 w-8 h-8 rounded-lg border border-white/[0.06] flex items-center justify-center text-zinc-500 hover:text-red-400 hover:border-red-400/30 transition-all cursor-pointer"
                  aria-label="Eliminar"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <div className={`flex gap-3 ${isSheet ? "flex-col sm:flex-row sm:items-center sm:justify-between" : "items-center justify-between"}`}>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="w-7 h-7 rounded-lg border border-white/[0.08] flex items-center justify-center text-zinc-400 hover:text-white disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="text-sm font-semibold w-6 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-7 h-7 rounded-lg border border-white/[0.08] flex items-center justify-center text-zinc-400 hover:text-white cursor-pointer"
                  >
                    <Plus size={12} />
                  </button>
                </div>

                {item.installationPrice !== null && (
                  <button
                    onClick={() => toggleInstallation(item.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-[11px] font-semibold border transition-all cursor-pointer ${
                      item.includeInstallation
                        ? "bg-[var(--accent)]/15 border-[var(--accent)]/35 text-[var(--accent-bright)]"
                        : "bg-transparent border-white/[0.08] text-zinc-500 hover:border-[var(--accent)]/25 hover:text-zinc-300"
                    }`}
                  >
                    <Wrench size={12} />
                    Instalacion {formatCOP(item.installationPrice)}
                    {item.includeInstallation && lineInstall > 0 && (
                      <span className="text-[10px] opacity-80">({formatCOP(lineInstall)})</span>
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className={`px-5 py-5 border-t border-white/[0.06] space-y-3 ${isSheet ? "bg-zinc-950/60" : "bg-zinc-950/40"}`}>
        <div className="space-y-1.5 text-sm">
          <div className="flex justify-between text-zinc-400">
            <span>Subtotal productos</span>
            <span>{formatCOP(totals.productsSubtotal)}</span>
          </div>
          {totals.installationSubtotal > 0 && (
            <div className="flex justify-between text-zinc-400">
              <span>Subtotal instalacion</span>
              <span>{formatCOP(totals.installationSubtotal)}</span>
            </div>
          )}
          <div className="flex justify-between items-baseline pt-2 border-t border-white/[0.06]">
            <div>
              <span className="font-semibold text-white block">Rango estimado</span>
              {priceRange && priceRange.low !== priceRange.high && (
                <span className="text-[10px] text-zinc-500">
                  según visita técnica
                </span>
              )}
            </div>
            <span className="text-xl sm:text-2xl font-bold font-[var(--font-display)] text-gradient text-right">
              {priceRange
                ? formatPriceRange(priceRange)
                : formatCOP(totals.grandTotal)}
            </span>
          </div>
          {priceRange && priceRange.low !== priceRange.high && (
            <div className="flex justify-between text-[11px] text-zinc-500">
              <span>Referencia central</span>
              <span>{formatCOP(priceRange.midpoint)}</span>
            </div>
          )}
        </div>

        {hasBlockingIssues && (
          <div className="flex items-start gap-2 text-[10px] text-amber-300/90 leading-relaxed px-1">
            <AlertCircle size={12} className="flex-shrink-0 mt-0.5" />
            <span>Hay accesorios requeridos pendientes. Revísalos arriba antes de enviar.</span>
          </div>
        )}

        <div className="flex items-start gap-2 text-[10px] text-zinc-500 leading-relaxed">
          <AlertCircle size={12} className="flex-shrink-0 mt-0.5 text-zinc-600" />
          <span>
            Cotización orientativa. El rango contempla variaciones por cableado,
            obra y condiciones en sitio.
          </span>
        </div>

        <button
          onClick={handleOpenCustomerModal}
          disabled={isGenerating}
          className={`w-full py-4 rounded-xl font-semibold text-sm transition-all cursor-pointer flex items-center justify-center gap-2 ${
            isGenerating
              ? "bg-zinc-800 text-zinc-400 border border-white/[0.08] cursor-wait"
              : lastSentRef
                ? "bg-[var(--accent)]/20 text-[var(--accent)] border border-[var(--accent)]/30"
                : "btn-primary"
          }`}
        >
          {isGenerating ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Generando PDF...
            </>
          ) : lastSentRef ? (
            <>
              <CheckCircle2 size={16} />
              Cotizacion {lastSentRef} enviada
            </>
          ) : (
            <>
              <FileDown size={16} />
              Descargar PDF y enviar por WhatsApp
            </>
          )}
        </button>

        <p className="text-[10px] text-zinc-500 text-center leading-relaxed">
          Se descarga el PDF y se abre WhatsApp. En celular puedes adjuntar el archivo directamente.
        </p>

        <Link
          href="/#contacto"
          className="block text-center text-xs text-zinc-500 hover:text-[var(--accent)] transition-colors"
        >
          O contactanos desde el formulario
        </Link>
      </div>
    </>
  );

  const includesStep = showIncludesStep && (
    <div className="fixed inset-0 z-[1050] flex items-end sm:items-center justify-center p-4 sm:p-6 bg-zinc-950/80 backdrop-blur-sm">
      <div className="w-full max-w-lg">
        <QuoteIncludesSummary
          onConfirm={handleIncludesConfirm}
          onBack={() => setShowIncludesStep(false)}
        />
      </div>
    </div>
  );

  const customerModal = (
    <QuoteCustomerModal
      open={showCustomerModal}
      onClose={() => !isGenerating && setShowCustomerModal(false)}
      onConfirm={handleGenerateAndSend}
      isSubmitting={isGenerating}
      requireTurnstile={quoteSource === "public"}
    />
  );

  if (isSheet) {
    return (
      <>
        <div className="flex flex-col">{panelContent}</div>
        {includesStep}
        {customerModal}
      </>
    );
  }

  return (
    <>
      <div className="glass rounded-[var(--radius-xl)] flex flex-col h-full min-h-[400px] overflow-hidden">
        {panelContent}
      </div>
      {includesStep}
      {customerModal}
    </>
  );
}