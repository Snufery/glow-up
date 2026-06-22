"use client";

import { useEffect, useState } from "react";
import { X, User, Phone, FileDown } from "lucide-react";
import {
  type QuoteCustomerInfo,
  validateQuoteCustomer,
  buildCustomerInfo,
} from "@/lib/quoteCustomer";

interface QuoteCustomerModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (info: QuoteCustomerInfo) => void;
  isSubmitting: boolean;
}

export default function QuoteCustomerModal({
  open,
  onClose,
  onConfirm,
  isSubmitting,
}: QuoteCustomerModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isSubmitting) onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose, isSubmitting]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateQuoteCustomer(name, phone);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }
    setErrors({});
    onConfirm(buildCustomerInfo({ name, phone }));
  };

  return (
    <div className="fixed inset-0 z-[1100] flex items-end sm:items-center justify-center p-4 sm:p-6">
      <button
        type="button"
        aria-label="Cerrar"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm cursor-default"
        onClick={() => !isSubmitting && onClose()}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="quote-customer-title"
        className="relative w-full max-w-md glass border border-white/[0.1] rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.55)] overflow-hidden"
      >
        <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
          <div>
            <h2
              id="quote-customer-title"
              className="font-[var(--font-display)] text-base font-bold"
            >
              Datos para tu cotizacion
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Necesitamos tu nombre y celular para generar el PDF
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="w-9 h-9 rounded-xl border border-white/[0.08] bg-zinc-900/60 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer disabled:opacity-40"
            aria-label="Cerrar"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label htmlFor="quote-customer-name" className="block text-xs font-medium text-zinc-400 mb-2">
              Nombre completo
            </label>
            <div className="relative">
              <User
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
              />
              <input
                id="quote-customer-name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                }}
                placeholder="Ej. Maria Lopez"
                autoComplete="name"
                disabled={isSubmitting}
                className="form-input pl-11"
              />
            </div>
            {errors.name && <p className="text-xs text-red-400 mt-1.5">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="quote-customer-phone" className="block text-xs font-medium text-zinc-400 mb-2">
              Numero de celular
            </label>
            <div className="relative">
              <Phone
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
              />
              <input
                id="quote-customer-phone"
                type="tel"
                inputMode="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
                }}
                placeholder="Ej. 300 123 4567"
                autoComplete="tel"
                disabled={isSubmitting}
                className="form-input pl-11"
              />
            </div>
            {errors.phone && <p className="text-xs text-red-400 mt-1.5">{errors.phone}</p>}
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 py-3 rounded-xl text-sm font-semibold text-zinc-400 border border-white/[0.08] hover:text-white hover:border-white/[0.15] transition-all cursor-pointer disabled:opacity-40"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 btn-primary py-3 justify-center disabled:opacity-70 disabled:cursor-wait"
            >
              <FileDown size={16} className="relative z-[1]" />
              <span className="relative z-[1]">
                {isSubmitting ? "Generando..." : "Continuar y generar PDF"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}