"use client";

import { useEffect } from "react";
import { ShoppingBag, ChevronUp, X } from "lucide-react";
import { useQuote } from "@/context/QuoteContext";
import { formatCOP } from "@/lib/quote";
import QuotePanel from "./QuotePanel";

export default function MobileCartSheet() {
  const { totals, items, mobileCartOpen, setMobileCartOpen, openMobileCart } = useQuote();
  const open = mobileCartOpen;

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (items.length === 0) setMobileCartOpen(false);
  }, [items.length, setMobileCartOpen]);

  if (totals.itemCount === 0) return null;

  return (
    <>
      {open && (
        <button
          type="button"
          aria-label="Cerrar carrito"
          className="xl:hidden fixed inset-0 z-[950] bg-black/65 backdrop-blur-sm cursor-default"
          onClick={() => setMobileCartOpen(false)}
        />
      )}

      <div
        role="dialog"
        aria-modal={open}
        aria-label="Carrito de cotizacion"
        className={`xl:hidden fixed inset-x-0 bottom-0 z-[960] transition-transform duration-300 ease-out ${
          open ? "translate-y-0" : "translate-y-full pointer-events-none"
        }`}
      >
        <div className="glass border-t border-white/[0.12] rounded-t-[var(--radius-xl)] shadow-[0_-20px_60px_rgba(0,0,0,0.5)] flex flex-col max-h-[88dvh]">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06] flex-shrink-0">
            <div>
              <h3 className="font-[var(--font-display)] text-base font-bold">Tu carrito</h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                {totals.itemCount} producto{totals.itemCount !== 1 ? "s" : ""}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setMobileCartOpen(false)}
              className="w-9 h-9 rounded-xl border border-white/[0.08] bg-zinc-900/60 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Cerrar carrito"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto min-h-0 overscroll-contain">
            <QuotePanel variant="sheet" />
          </div>
        </div>
      </div>

      {!open && (
        <div className="xl:hidden fixed bottom-0 left-0 right-0 z-[900] px-4 pb-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <button
            type="button"
            onClick={openMobileCart}
            className="w-full glass border border-white/[0.1] rounded-2xl px-4 py-3.5 flex items-center gap-4 shadow-[0_8px_32px_rgba(0,0,0,0.45)] transition-all active:scale-[0.98] cursor-pointer"
          >
            <div className="relative flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-brand flex items-center justify-center text-zinc-950">
              <ShoppingBag size={20} strokeWidth={2.25} />
              <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full bg-zinc-950 border border-[var(--brand-glow)] text-[10px] font-bold text-[var(--brand-glow)] flex items-center justify-center">
                {totals.itemCount}
              </span>
            </div>

            <div className="flex-1 text-left min-w-0">
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Total estimado</p>
              <p className="text-lg font-bold font-[var(--font-display)] text-gradient truncate">
                {formatCOP(totals.grandTotal)}
              </p>
            </div>

            <div className="flex-shrink-0 flex items-center gap-1 text-xs font-semibold text-[var(--accent-bright)]">
              Ver carrito
              <ChevronUp size={16} />
            </div>
          </button>
        </div>
      )}
    </>
  );
}