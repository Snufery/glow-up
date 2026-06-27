"use client";

import { useState } from "react";
import { Lightbulb, Plus, X, Sparkles } from "lucide-react";
import { useQuote } from "@/context/QuoteContext";
import { useHouseOptional } from "@/context/HouseContext";
import { useQuoteRecommendations } from "@/hooks/useQuoteRecommendations";
import { findProductById } from "@/lib/quoteRecommendations";
import { formatCOP } from "@/lib/quote";

export default function RoomRecommendations() {
  const { addProduct } = useQuote();
  const house = useHouseOptional();
  const selectedRoom = house?.selectedRoom ?? null;
  const { roomRecs } = useQuoteRecommendations();
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const visible = roomRecs.filter((rec) => !dismissed.has(rec.id));

  if (visible.length === 0) return null;

  const handleAdd = (rec: (typeof visible)[0]) => {
    const product = findProductById(rec.productId);
    if (!product) return;

    const channels = product.channelOptions?.[0]?.channels;
    const colorId = product.colorVariants?.[0]?.id;
    const colorVariant = product.colorVariants?.find((v) => v.id === colorId);
    const unitPrice = product.channelOptions
      ? product.channelOptions[0].price
      : product.price;
    const image =
      colorVariant?.images?.[channels ?? 1] ??
      colorVariant?.image ??
      product.image;

    addProduct(product, {
      unitPrice,
      channels,
      colorId,
      colorLabel: colorVariant?.label,
      image,
      roomId: rec.roomId,
      roomLabel: rec.roomLabel,
    });

    setDismissed((prev) => new Set(prev).add(rec.id));
  };

  return (
    <div className="mb-6 rounded-2xl border border-[var(--accent)]/20 bg-[var(--accent)]/5 p-4">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[var(--accent)]/15 flex items-center justify-center text-[var(--accent)]">
            <Sparkles size={16} />
          </div>
          <div>
            <h4 className="text-sm font-semibold">Sugerencias para tu espacio</h4>
            <p className="text-[11px] text-zinc-500">
              {selectedRoom
                ? `Recomendado para ${selectedRoom.label}`
                : "Basado en las habitaciones de tu casa"}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {visible.map((rec) => {
          const product = findProductById(rec.productId);
          if (!product) return null;

          return (
            <div
              key={rec.id}
              className="flex items-start gap-3 p-3 rounded-xl bg-zinc-950/50 border border-white/[0.06]"
            >
              <Lightbulb
                size={14}
                className={`flex-shrink-0 mt-0.5 ${
                  rec.priority === "high"
                    ? "text-[var(--accent-bright)]"
                    : "text-zinc-500"
                }`}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium leading-snug">{product.name}</p>
                <p className="text-[11px] text-zinc-500 mt-0.5 leading-relaxed">
                  {rec.reason}
                </p>
                <p className="text-xs text-[var(--accent)]/80 mt-1">
                  {rec.roomLabel} · {formatCOP(product.price)}
                </p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => handleAdd(rec)}
                  className="w-8 h-8 rounded-lg bg-gradient-brand text-zinc-950 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
                  aria-label={`Agregar ${product.name}`}
                >
                  <Plus size={14} />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setDismissed((prev) => new Set(prev).add(rec.id))
                  }
                  className="w-8 h-8 rounded-lg border border-white/[0.08] text-zinc-500 flex items-center justify-center cursor-pointer hover:text-zinc-300"
                  aria-label="Descartar sugerencia"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}