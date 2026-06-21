"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Trash2,
  Minus,
  Plus,
  Wrench,
  ShoppingBag,
  MessageCircle,
  AlertCircle,
} from "lucide-react";
import { useQuote } from "@/context/QuoteContext";
import { calcLineInstallation, calcLineSubtotal, formatCOP, buildWhatsAppMessage } from "@/lib/quote";
import { contactInfo } from "@/data/contact";

export default function QuotePanel() {
  const { items, totals, removeItem, updateQuantity, toggleInstallation, clearQuote } = useQuote();

  const sendWhatsApp = () => {
    const msg = encodeURIComponent(buildWhatsAppMessage(items));
    window.open(`${contactInfo.socialLinks.whatsapp}?text=${msg}`, "_blank");
  };

  if (items.length === 0) {
    return (
      <div className="glass rounded-[var(--radius-xl)] p-8 h-full flex flex-col items-center justify-center text-center min-h-[400px]">
        <div className="w-16 h-16 rounded-2xl bg-[var(--accent)]/8 border border-[var(--accent)]/20 flex items-center justify-center text-[var(--accent)] mb-5">
          <ShoppingBag size={28} />
        </div>
        <h3 className="font-[var(--font-display)] text-lg font-bold mb-2">Tu cotizacion esta vacia</h3>
        <p className="text-sm text-zinc-500 max-w-[260px] leading-relaxed">
          Agrega productos desde el catalogo. El total se actualizara automaticamente.
        </p>
      </div>
    );
  }

  return (
    <div className="glass rounded-[var(--radius-xl)] flex flex-col h-full min-h-[400px] overflow-hidden">
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

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 max-h-[420px] lg:max-h-none">
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

              <div className="flex items-center justify-between">
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

      <div className="px-5 py-5 border-t border-white/[0.06] bg-zinc-950/40 space-y-3">
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
            <span className="font-semibold text-white">Total estimado</span>
            <span className="text-2xl font-bold font-[var(--font-display)] text-gradient">
              {formatCOP(totals.grandTotal)}
            </span>
          </div>
        </div>

        <div className="flex items-start gap-2 text-[10px] text-zinc-500 leading-relaxed">
          <AlertCircle size={12} className="flex-shrink-0 mt-0.5 text-zinc-600" />
          <span>Cotizacion estimada. El valor final puede ajustarse tras evaluacion en sitio.</span>
        </div>

        <button
          onClick={sendWhatsApp}
          className="w-full btn-primary cursor-pointer justify-center"
        >
          <MessageCircle size={16} />
          Enviar cotizacion por WhatsApp
        </button>

        <Link
          href="/#contacto"
          className="block text-center text-xs text-zinc-500 hover:text-[var(--accent)] transition-colors"
        >
          O contactanos desde el formulario
        </Link>
      </div>
    </div>
  );
}