"use client";

import { useState } from "react";
import { Link2, Copy, Check, Loader2, Save } from "lucide-react";
import { useQuote } from "@/context/QuoteContext";
import { useHouse } from "@/context/HouseContext";
import { useCotizadorFlow } from "@/context/CotizadorFlowContext";
import { useTurnstile } from "@/hooks/useTurnstile";
import TurnstileField from "@/components/security/TurnstileField";

export default function QuoteDraftBar() {
  const { items } = useQuote();
  const house = useHouse();
  const flow = useCotizadorFlow();
  const [saving, setSaving] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const turnstile = useTurnstile();

  if (!flow.goalWizardDone || items.length === 0) return null;

  const canSave = !saving && turnstile.canSubmit;

  const handleSave = async () => {
    if (!canSave) return;
    setSaving(true);
    setError(null);
    setCopied(false);

    try {
      const res = await fetch("/api/cotizacion/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          turnstileToken: turnstile.token ?? undefined,
          items,
          house: house.isConfigured
            ? {
                counts: house.counts,
                selectedRoomId: house.selectedRoomId,
                isConfigured: true,
              }
            : null,
          flow: {
            goal: flow.goal,
            goalWizardDone: flow.goalWizardDone,
            selectedPackageId: flow.selectedPackageId,
            houseSkipped: flow.houseSkipped,
          },
        }),
      });

      const data = (await res.json()) as {
        shareUrl?: string;
        error?: string;
        saved?: boolean;
      };

      if (!res.ok) {
        throw new Error(data.error ?? "No se pudo guardar el proyecto");
      }

      if (data.shareUrl) {
        setShareUrl(data.shareUrl);
      } else if (data.saved === false) {
        setError("Guardado no disponible (base de datos no configurada)");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar");
      turnstile.reset();
    } finally {
      setSaving(false);
    }
  };

  const handleCopy = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("No se pudo copiar el enlace");
    }
  };

  return (
    <div className="glass rounded-[var(--radius-xl)] p-4 sm:p-5 border border-white/[0.06]">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/10 border border-[var(--accent)]/20 flex items-center justify-center text-[var(--accent)] flex-shrink-0">
            <Link2 size={18} />
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-semibold">Guardar proyecto</h4>
            <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">
              Genera un enlace para retomar esta cotización más tarde o compartirla.
            </p>
          </div>
        </div>

        {!shareUrl ? (
          <div className="flex flex-col items-stretch sm:items-end gap-3 sm:flex-shrink-0">
            {turnstile.required && <TurnstileField turnstile={turnstile} />}
            <button
            type="button"
            onClick={handleSave}
            disabled={!canSave}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold border border-[var(--accent)]/30 text-[var(--accent)] hover:bg-[var(--accent)]/10 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save size={16} />
                Guardar y obtener enlace
              </>
            )}
          </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 w-full sm:w-auto min-w-0">
            <input
              readOnly
              value={shareUrl}
              className="flex-1 min-w-0 px-3 py-2 rounded-lg bg-zinc-900/80 border border-white/[0.08] text-xs text-zinc-300 truncate"
            />
            <button
              type="button"
              onClick={handleCopy}
              className="flex-shrink-0 w-10 h-10 rounded-lg border border-white/[0.08] flex items-center justify-center text-zinc-400 hover:text-[var(--accent)] transition-colors cursor-pointer"
              aria-label="Copiar enlace"
            >
              {copied ? <Check size={16} className="text-[var(--accent)]" /> : <Copy size={16} />}
            </button>
          </div>
        )}
      </div>

      {error && (
        <p className="text-xs text-amber-400/90 mt-3">{error}</p>
      )}
    </div>
  );
}