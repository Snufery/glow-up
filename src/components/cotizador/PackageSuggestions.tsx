"use client";

import { useMemo } from "react";
import { Package, ArrowRight, ListPlus, X } from "lucide-react";
import {
  getPackagesForGoal,
  type QuoteGoal,
} from "@/data/quotePackages";
import { products } from "@/data/products";
import { buildItemsFromPackageSpecs } from "@/lib/applyQuotePackage";
import { useQuote } from "@/context/QuoteContext";
import { useCotizadorFlow } from "@/context/CotizadorFlowContext";
import { formatCOP, calcQuoteTotals } from "@/lib/quote";

interface PackageSuggestionsProps {
  goal: QuoteGoal;
  onClose: () => void;
}

export default function PackageSuggestions({
  goal,
  onClose,
}: PackageSuggestionsProps) {
  const { items, applyPackageItems } = useQuote();
  const { completeGoalWizard } = useCotizadorFlow();

  const pkg = useMemo(() => getPackagesForGoal(goal)[0], [goal]);

  const previewTotals = useMemo(() => {
    if (!pkg) return null;
    const previewItems = buildItemsFromPackageSpecs(pkg.items);
    return calcQuoteTotals(previewItems);
  }, [pkg]);

  if (!pkg) return null;

  const handleApply = () => {
    if (items.length > 0) {
      const ok = window.confirm(
        "¿Reemplazar los productos actuales con el paquete sugerido?"
      );
      if (!ok) return;
    }
    applyPackageItems(buildItemsFromPackageSpecs(pkg.items));
    completeGoalWizard(pkg.id);
    onClose();
  };

  const handleManual = () => {
    completeGoalWizard(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[900] flex items-center justify-center p-4 sm:p-8 bg-zinc-950/90 backdrop-blur-md">
      <div className="relative w-full max-w-xl glass rounded-[var(--radius-xl)] border border-white/[0.08] overflow-hidden">
        <button
          type="button"
          onClick={handleManual}
          className="absolute top-4 right-4 w-9 h-9 rounded-lg border border-white/[0.08] flex items-center justify-center text-zinc-500 hover:text-white transition-colors cursor-pointer z-10"
          aria-label="Cerrar"
        >
          <X size={16} />
        </button>

        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-11 h-11 rounded-xl bg-[var(--accent)]/10 border border-[var(--accent)]/25 flex items-center justify-center text-[var(--accent)]">
              <Package size={20} />
            </div>
            <div>
              <p className="text-xs text-[var(--accent)] font-semibold uppercase tracking-wider">
                Paquete sugerido
              </p>
              <h2 className="font-[var(--font-display)] text-xl font-bold">
                {pkg.name}
              </h2>
            </div>
          </div>

          <p className="text-sm text-zinc-400 leading-relaxed mb-4">
            {pkg.description}
          </p>

          <ul className="space-y-2 mb-6">
            {pkg.items.map((spec) => {
              const product = products.find((p) => p.id === spec.productId);
              return (
                <li
                  key={`${spec.productId}-${spec.quantity}`}
                  className="flex items-center gap-2 text-sm text-zinc-300"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] flex-shrink-0" />
                  {spec.quantity}x {product?.name ?? `Producto ${spec.productId}`}
                  {spec.channels ? ` (${spec.channels} canales)` : ""}
                </li>
              );
            })}
          </ul>

          {previewTotals && (
            <div className="premium-card p-4 mb-6 flex items-center justify-between">
              <span className="text-sm text-zinc-400">Total estimado del paquete</span>
              <span className="text-xl font-bold font-[var(--font-display)] text-gradient">
                {formatCOP(previewTotals.grandTotal)}
              </span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={handleApply}
              className="flex-1 btn-primary py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              Aplicar paquete
              <ArrowRight size={16} />
            </button>
            <button
              type="button"
              onClick={handleManual}
              className="flex-1 py-3.5 rounded-xl font-semibold text-sm border border-white/[0.1] text-zinc-300 hover:border-[var(--accent)]/30 hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ListPlus size={16} />
              Elegir manualmente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}