"use client";

import { companyLegal } from "@/data/company";
import type { QuoteDocumentExtras } from "@/lib/quoteCustomer";

interface AdminQuoteExtrasProps {
  value: QuoteDocumentExtras;
  onChange: (value: QuoteDocumentExtras) => void;
}

export default function AdminQuoteExtras({ value, onChange }: AdminQuoteExtrasProps) {
  return (
    <section className="glass rounded-2xl p-5 border border-white/[0.06] space-y-3">
      <h2 className="text-sm font-bold">Detalles del documento</h2>
      <p className="text-xs text-zinc-500">
        Campos adicionales que aparecen en el PDF (como en la plantilla de cotización).
      </p>

      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-zinc-500 mb-1.5">Ingeniero</label>
          <input
            className="form-input text-sm"
            value={value.engineer ?? companyLegal.defaultEngineer}
            onChange={(e) => onChange({ ...value, engineer: e.target.value })}
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs text-zinc-500 mb-1.5">Dirección del cliente</label>
          <input
            className="form-input text-sm"
            placeholder="Ej. calle 11 # 13-48"
            value={value.customerAddress ?? ""}
            onChange={(e) => onChange({ ...value, customerAddress: e.target.value })}
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs text-zinc-500 mb-1.5">Materiales requeridos</label>
          <textarea
            className="form-input text-sm min-h-[72px] resize-y"
            placeholder="Ej. INTERRUPTOR SENCILLO: 10, INTERRUPTOR DOBLE: 18..."
            value={value.materials ?? ""}
            onChange={(e) => onChange({ ...value, materials: e.target.value })}
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs text-zinc-500 mb-1.5">Notas</label>
          <textarea
            className="form-input text-sm min-h-[72px] resize-y"
            placeholder="Observaciones adicionales para el PDF"
            value={value.notes ?? ""}
            onChange={(e) => onChange({ ...value, notes: e.target.value })}
          />
        </div>
      </div>
    </section>
  );
}