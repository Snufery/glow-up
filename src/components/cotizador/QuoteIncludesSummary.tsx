"use client";

import { CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import {
  DEFAULT_EXCLUDES,
  DEFAULT_INCLUDES,
  getPackageById,
} from "@/data/quotePackages";
import { useCotizadorFlow } from "@/context/CotizadorFlowContext";

interface QuoteIncludesSummaryProps {
  onConfirm: () => void;
  onBack?: () => void;
}

export default function QuoteIncludesSummary({
  onConfirm,
  onBack,
}: QuoteIncludesSummaryProps) {
  const { selectedPackageId } = useCotizadorFlow();
  const pkg = selectedPackageId ? getPackageById(selectedPackageId) : null;

  const includes = pkg
    ? [...new Set([...DEFAULT_INCLUDES, ...pkg.includes])]
    : DEFAULT_INCLUDES;

  const excludes = pkg
    ? [...new Set([...DEFAULT_EXCLUDES, ...pkg.excludes])]
    : DEFAULT_EXCLUDES;

  return (
    <div className="premium-card p-5 sm:p-6 space-y-5">
      <div>
        <span className="section-badge mb-3">Paso 4 · Resumen</span>
        <h3 className="font-[var(--font-display)] text-lg font-bold">
          Qué incluye y qué no incluye
        </h3>
        <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
          Revisa estos puntos antes de enviar tu cotización. El valor final puede
          ajustarse tras una visita técnica.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-xl border border-[var(--accent)]/20 bg-[var(--accent)]/5 p-4">
          <h4 className="text-sm font-semibold text-[var(--accent-bright)] mb-3 flex items-center gap-2">
            <CheckCircle2 size={16} />
            Incluye
          </h4>
          <ul className="space-y-2">
            {includes.map((item) => (
              <li
                key={item}
                className="text-xs text-zinc-300 leading-relaxed flex gap-2"
              >
                <span className="text-[var(--accent)] mt-0.5">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-white/[0.08] bg-zinc-900/40 p-4">
          <h4 className="text-sm font-semibold text-zinc-400 mb-3 flex items-center gap-2">
            <XCircle size={16} />
            No incluye
          </h4>
          <ul className="space-y-2">
            {excludes.map((item) => (
              <li
                key={item}
                className="text-xs text-zinc-500 leading-relaxed flex gap-2"
              >
                <span className="text-zinc-600 mt-0.5">✗</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-1">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="sm:flex-none px-5 py-3 rounded-xl text-sm font-semibold border border-white/[0.1] text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            Volver al carrito
          </button>
        )}
        <button
          type="button"
          onClick={onConfirm}
          className="flex-1 btn-primary py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer"
        >
          Entendido, continuar al envío
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}