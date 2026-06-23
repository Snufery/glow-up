"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Plus, Trash2, FileDown, Loader2 } from "lucide-react";
import {
  type InvoiceData,
  type InvoiceLineItem,
  generateInvoiceNumber,
  calcInvoiceSubtotal,
  calcInvoiceTax,
  calcInvoiceTotal,
  buildInvoiceFilename,
} from "@/lib/invoice";
import InvoiceHistoryList from "@/components/admin/InvoiceHistoryList";
import { downloadPdfViaFetch } from "@/lib/downloadPdf";
import { formatCOP } from "@/lib/quote";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function dueISO() {
  const d = new Date();
  d.setDate(d.getDate() + 15);
  return d.toISOString().slice(0, 10);
}

function emptyItem(): InvoiceLineItem {
  return {
    id: crypto.randomUUID(),
    description: "",
    quantity: 1,
    unitPrice: 0,
  };
}

const INVOICE_DRAFT_KEY = "glowup-invoice-draft";

function AdminFacturasPageContent() {
  const searchParams = useSearchParams();
  const [invoiceNumber, setInvoiceNumber] = useState(generateInvoiceNumber);
  const [sourceQuoteId, setSourceQuoteId] = useState<string | undefined>();
  const [engineer, setEngineer] = useState("");
  const [materials, setMaterials] = useState("");
  const [fromQuoteBanner, setFromQuoteBanner] = useState(false);
  const [issuedAt, setIssuedAt] = useState(todayISO());
  const [dueAt, setDueAt] = useState(dueISO());
  const [includeTax, setIncludeTax] = useState(false);
  const [notes, setNotes] = useState("");
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  const [customer, setCustomer] = useState({
    name: "",
    document: "",
    phone: "",
    email: "",
    address: "",
  });

  const [items, setItems] = useState<InvoiceLineItem[]>([emptyItem()]);

  useEffect(() => {
    if (searchParams.get("fromQuote") !== "1") return;

    const raw = sessionStorage.getItem(INVOICE_DRAFT_KEY);
    if (!raw) return;

    try {
      const draft = JSON.parse(raw) as InvoiceData;
      setInvoiceNumber(draft.invoiceNumber || generateInvoiceNumber());
      setIssuedAt(draft.issuedAt || todayISO());
      setDueAt(draft.dueAt || dueISO());
      setIncludeTax(draft.includeTax ?? false);
      setNotes(draft.notes || "");
      setEngineer(draft.engineer || "");
      setMaterials(draft.materials || "");
      setSourceQuoteId(draft.sourceQuoteId);
      setCustomer({
        name: draft.customer.name || "",
        document: draft.customer.document || "",
        phone: draft.customer.phone || "",
        email: draft.customer.email || "",
        address: draft.customer.address || "",
      });
      setItems(
        draft.items?.length
          ? draft.items.map((item) => ({ ...item, id: item.id || crypto.randomUUID() }))
          : [emptyItem()]
      );
      setFromQuoteBanner(true);
      sessionStorage.removeItem(INVOICE_DRAFT_KEY);
    } catch {
      sessionStorage.removeItem(INVOICE_DRAFT_KEY);
    }
  }, [searchParams]);

  const subtotal = useMemo(() => calcInvoiceSubtotal(items), [items]);
  const tax = useMemo(() => calcInvoiceTax(subtotal, includeTax), [subtotal, includeTax]);
  const total = useMemo(() => calcInvoiceTotal(items, includeTax), [items, includeTax]);

  const updateItem = (id: string, patch: Partial<InvoiceLineItem>) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  };

  const handleGenerate = async () => {
    setError("");

    if (!customer.name.trim()) {
      setError("Ingresa el nombre del cliente.");
      return;
    }

    const validItems = items.filter((i) => i.description.trim() && i.quantity > 0);
    if (!validItems.length) {
      setError("Agrega al menos un item con descripcion.");
      return;
    }

    const invoice: InvoiceData = {
      invoiceNumber,
      issuedAt,
      dueAt,
      customer: {
        name: customer.name.trim(),
        document: customer.document.trim(),
        phone: customer.phone.trim(),
        email: customer.email.trim(),
        address: customer.address.trim(),
      },
      items: validItems,
      notes: notes.trim(),
      materials: materials.trim() || undefined,
      engineer: engineer.trim() || undefined,
      includeTax,
      sourceQuoteId,
    };

    const filename = buildInvoiceFilename(invoiceNumber, customer.name);

    setGenerating(true);
    try {
      await downloadPdfViaFetch("/api/admin/factura/pdf", { invoice, filename }, filename);
    } catch (err) {
      console.error("Error generando factura:", err);
      setError(
        err instanceof Error ? err.message : "No se pudo descargar la factura. Intenta de nuevo."
      );
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="max-w-5xl">
      <div className="mb-6">
        <h1 className="font-[var(--font-display)] text-xl sm:text-2xl font-bold mb-1">
          Generador de facturas
        </h1>
        <p className="text-sm text-zinc-500">
          Crea facturas internas y descargalas en PDF con la marca Glow Up.
        </p>
        {fromQuoteBanner && (
          <p className="text-xs text-[var(--accent-bright)] mt-2">
            Datos precargados desde una cotización. Revisa y descarga la factura PDF.
          </p>
        )}
      </div>

      <div className="grid lg:grid-cols-[1fr_280px] gap-6">
        <div className="space-y-5">
          <section className="glass rounded-2xl p-5 border border-white/[0.06]">
            <h2 className="text-sm font-bold mb-4">Datos de la factura</h2>
            <div className="grid sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-zinc-500 mb-1.5">Numero</label>
                <input className="form-input text-sm" value={invoiceNumber} readOnly />
              </div>
              <div>
                <label className="block text-xs text-zinc-500 mb-1.5">Emision</label>
                <input
                  type="date"
                  className="form-input text-sm"
                  value={issuedAt}
                  onChange={(e) => setIssuedAt(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-500 mb-1.5">Vencimiento</label>
                <input
                  type="date"
                  className="form-input text-sm"
                  value={dueAt}
                  onChange={(e) => setDueAt(e.target.value)}
                />
              </div>
            </div>
          </section>

          <section className="glass rounded-2xl p-5 border border-white/[0.06]">
            <h2 className="text-sm font-bold mb-4">Cliente</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              <input
                className="form-input text-sm"
                placeholder="Nombre / Razon social *"
                value={customer.name}
                onChange={(e) => setCustomer((c) => ({ ...c, name: e.target.value }))}
              />
              <input
                className="form-input text-sm"
                placeholder="CC / NIT"
                value={customer.document}
                onChange={(e) => setCustomer((c) => ({ ...c, document: e.target.value }))}
              />
              <input
                className="form-input text-sm"
                placeholder="Telefono"
                value={customer.phone}
                onChange={(e) => setCustomer((c) => ({ ...c, phone: e.target.value }))}
              />
              <input
                className="form-input text-sm"
                placeholder="Email"
                value={customer.email}
                onChange={(e) => setCustomer((c) => ({ ...c, email: e.target.value }))}
              />
              <input
                className="form-input text-sm sm:col-span-2"
                placeholder="Direccion"
                value={customer.address}
                onChange={(e) => setCustomer((c) => ({ ...c, address: e.target.value }))}
              />
            </div>
          </section>

          <section className="glass rounded-2xl p-5 border border-white/[0.06]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold">Items</h2>
              <button
                type="button"
                onClick={() => setItems((prev) => [...prev, emptyItem()])}
                className="text-xs font-semibold text-[var(--accent-bright)] flex items-center gap-1 cursor-pointer"
              >
                <Plus size={14} /> Agregar linea
              </button>
            </div>

            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="grid grid-cols-[1fr_70px_110px_36px] gap-2 items-center">
                  <input
                    className="form-input text-sm"
                    placeholder="Descripcion del servicio/producto"
                    value={item.description}
                    onChange={(e) => updateItem(item.id, { description: e.target.value })}
                  />
                  <input
                    type="number"
                    min={1}
                    className="form-input text-sm text-center"
                    value={item.quantity}
                    onChange={(e) =>
                      updateItem(item.id, { quantity: Math.max(1, Number(e.target.value) || 1) })
                    }
                  />
                  <input
                    type="number"
                    min={0}
                    className="form-input text-sm"
                    placeholder="Precio"
                    value={item.unitPrice || ""}
                    onChange={(e) =>
                      updateItem(item.id, { unitPrice: Math.max(0, Number(e.target.value) || 0) })
                    }
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setItems((prev) =>
                        prev.length > 1 ? prev.filter((i) => i.id !== item.id) : prev
                      )
                    }
                    className="w-9 h-9 rounded-lg border border-white/[0.08] flex items-center justify-center text-zinc-500 hover:text-red-400 cursor-pointer"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className="glass rounded-2xl p-5 border border-white/[0.06] space-y-3">
            <div>
              <label className="block text-xs text-zinc-500 mb-1.5">Ingeniero</label>
              <input
                className="form-input text-sm"
                placeholder="Nombre del ingeniero"
                value={engineer}
                onChange={(e) => setEngineer(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-500 mb-1.5">Materiales requeridos</label>
              <textarea
                className="form-input text-sm min-h-[72px] resize-y"
                placeholder="Lista de materiales (opcional)"
                value={materials}
                onChange={(e) => setMaterials(e.target.value)}
              />
            </div>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={includeTax}
                onChange={(e) => setIncludeTax(e.target.checked)}
                className="accent-[var(--brand-up)]"
              />
              Incluir IVA 19%
            </label>
            <textarea
              className="form-input text-sm min-h-[80px] resize-y"
              placeholder="Notas adicionales (opcional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </section>
        </div>

        <aside className="lg:sticky lg:top-6 h-fit glass rounded-2xl p-5 border border-white/[0.06] space-y-4">
          <h2 className="text-sm font-bold">Resumen</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-zinc-400">
              <span>Subtotal</span>
              <span>{formatCOP(subtotal)}</span>
            </div>
            {includeTax && (
              <div className="flex justify-between text-zinc-400">
                <span>IVA 19%</span>
                <span>{formatCOP(tax)}</span>
              </div>
            )}
            <div className="flex justify-between items-baseline pt-2 border-t border-white/[0.06]">
              <span className="font-semibold">Total</span>
              <span className="text-xl font-bold font-[var(--font-display)] text-gradient">
                {formatCOP(total)}
              </span>
            </div>
          </div>

          {error && <p className="text-xs text-red-400">{error}</p>}

          <button
            type="button"
            onClick={handleGenerate}
            disabled={generating}
            className="w-full btn-primary py-3 justify-center disabled:opacity-60"
          >
            {generating ? (
              <>
                <Loader2 size={16} className="animate-spin relative z-[1]" />
                <span className="relative z-[1]">Generando...</span>
              </>
            ) : (
              <>
                <FileDown size={16} className="relative z-[1]" />
                <span className="relative z-[1]">Descargar factura PDF</span>
              </>
            )}
          </button>
        </aside>
      </div>

      <InvoiceHistoryList />
    </div>
  );
}

export default function AdminFacturasPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-5xl px-2 py-10 text-sm text-zinc-500">Cargando facturas...</div>
      }
    >
      <AdminFacturasPageContent />
    </Suspense>
  );
}