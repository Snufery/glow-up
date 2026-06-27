"use client";

import {
  AlertTriangle,
  Info,
  PackagePlus,
  Wand2,
  ShieldAlert,
} from "lucide-react";
import { useQuote } from "@/context/QuoteContext";
import { useQuoteRecommendations } from "@/hooks/useQuoteRecommendations";
import { formatCOP } from "@/lib/quote";
import type { AccessoryRecommendation, SceneSuggestion } from "@/lib/quoteRecommendations";

export default function QuoteIntelligenceBar() {
  const { items, addCustomItem } = useQuote();
  const { accessories, warnings, scenes, requiredMissing } =
    useQuoteRecommendations();

  if (items.length === 0) return null;
  if (
    accessories.length === 0 &&
    warnings.length === 0 &&
    scenes.length === 0
  ) {
    return null;
  }

  const handleAddAccessory = (acc: AccessoryRecommendation) => {
    for (let i = 0; i < acc.quantity; i += 1) {
      addCustomItem({
        name: acc.name,
        unitPrice: acc.unitPrice,
        description: `${acc.description} (sugerido por: ${acc.triggerLabel})`,
      });
    }
  };

  const handleAddScene = (scene: SceneSuggestion) => {
    addCustomItem({
      name: scene.name,
      unitPrice: scene.unitPrice,
      description: scene.description,
    });
  };

  return (
    <div className="space-y-3">
      {requiredMissing.length > 0 && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4">
          <div className="flex items-center gap-2 mb-2">
            <ShieldAlert size={16} className="text-red-400" />
            <h4 className="text-sm font-semibold text-red-300">
              Accesorios requeridos
            </h4>
          </div>
          <p className="text-[11px] text-red-200/70 mb-3">
            Tu configuración necesita estos componentes para funcionar correctamente.
          </p>
          <AccessoryList
            items={requiredMissing}
            onAdd={handleAddAccessory}
            variant="required"
          />
        </div>
      )}

      {warnings.length > 0 && (
        <div className="rounded-2xl border border-white/[0.08] bg-zinc-900/40 p-4 space-y-2">
          <h4 className="text-sm font-semibold text-zinc-300 flex items-center gap-2">
            <Info size={16} className="text-[var(--accent)]" />
            Compatibilidad del sistema
          </h4>
          {warnings.map((warn) => (
            <div
              key={warn.id}
              className={`flex gap-2 p-2.5 rounded-xl text-xs leading-relaxed ${
                warn.severity === "error"
                  ? "bg-red-500/10 text-red-200"
                  : warn.severity === "warning"
                    ? "bg-amber-500/10 text-amber-200"
                    : "bg-white/[0.03] text-zinc-400"
              }`}
            >
              {warn.severity === "error" || warn.severity === "warning" ? (
                <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" />
              ) : (
                <Info size={14} className="flex-shrink-0 mt-0.5" />
              )}
              <div>
                <span className="font-semibold">{warn.title}: </span>
                {warn.message}
              </div>
            </div>
          ))}
        </div>
      )}

      {accessories.filter((a) => !a.required).length > 0 && (
        <div className="rounded-2xl border border-[var(--accent)]/20 bg-[var(--accent)]/5 p-4">
          <div className="flex items-center gap-2 mb-3">
            <PackagePlus size={16} className="text-[var(--accent)]" />
            <h4 className="text-sm font-semibold">Accesorios recomendados</h4>
          </div>
          <AccessoryList
            items={accessories.filter((a) => !a.required)}
            onAdd={handleAddAccessory}
          />
        </div>
      )}

      {scenes.length > 0 && (
        <div className="rounded-2xl border border-white/[0.08] bg-zinc-900/40 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Wand2 size={16} className="text-[var(--accent-bright)]" />
            <h4 className="text-sm font-semibold">Escenas sugeridas</h4>
          </div>
          <p className="text-[11px] text-zinc-500 mb-3">
            Servicio de programación para automatizar rutinas con tus productos.
          </p>
          <div className="space-y-2">
            {scenes.map((scene) => (
              <div
                key={scene.id}
                className="flex items-start justify-between gap-3 p-3 rounded-xl bg-zinc-950/50 border border-white/[0.06]"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium">{scene.name}</p>
                  <p className="text-[11px] text-zinc-500 mt-0.5 leading-relaxed">
                    {scene.description}
                  </p>
                  <p className="text-xs text-[var(--accent)]/80 mt-1">
                    {formatCOP(scene.unitPrice)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleAddScene(scene)}
                  className="flex-shrink-0 px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-[var(--accent)]/15 border border-[var(--accent)]/30 text-[var(--accent)] hover:bg-[var(--accent)]/25 transition-colors cursor-pointer"
                >
                  Agregar
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function AccessoryList({
  items,
  onAdd,
  variant = "optional",
}: {
  items: AccessoryRecommendation[];
  onAdd: (item: AccessoryRecommendation) => void;
  variant?: "required" | "optional";
}) {
  return (
    <div className="space-y-2">
      {items.map((acc) => (
        <div
          key={acc.id}
          className="flex items-start justify-between gap-3 p-3 rounded-xl bg-zinc-950/50 border border-white/[0.06]"
        >
          <div className="min-w-0">
            <p className="text-sm font-medium">{acc.name}</p>
            <p className="text-[11px] text-zinc-500 mt-0.5 leading-relaxed">
              {acc.description}
            </p>
            <p className="text-[10px] text-zinc-600 mt-1">
              Por: {acc.triggerLabel}
            </p>
            <p className="text-xs text-[var(--accent)]/80 mt-1">
              {acc.quantity > 1
                ? `${acc.quantity}x ${formatCOP(acc.unitPrice)}`
                : formatCOP(acc.unitPrice)}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onAdd(acc)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
              variant === "required"
                ? "bg-red-500/20 border border-red-500/30 text-red-200 hover:bg-red-500/30"
                : "bg-[var(--accent)]/15 border border-[var(--accent)]/30 text-[var(--accent)] hover:bg-[var(--accent)]/25"
            }`}
          >
            Agregar
          </button>
        </div>
      ))}
    </div>
  );
}