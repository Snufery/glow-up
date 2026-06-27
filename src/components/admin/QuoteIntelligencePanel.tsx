"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Brain, ChevronDown, Loader2, Sparkles, CheckCircle2 } from "lucide-react";
import { useQuote } from "@/context/QuoteContext";
import type { QuoteDocumentExtras } from "@/lib/quoteCustomer";
import type { QuoteIntelligence } from "@/lib/quoteIntelligence";

interface QuoteIntelligencePanelProps {
  documentExtras: QuoteDocumentExtras;
  onChange: (value: QuoteDocumentExtras) => void;
}

function PreviewSection({
  title,
  defaultOpen = false,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  return (
    <details
      open={defaultOpen}
      className="group rounded-xl border border-white/[0.06] bg-zinc-950/30 overflow-hidden"
    >
      <summary className="flex items-center justify-between gap-2 px-3 py-2.5 cursor-pointer list-none text-xs font-semibold text-zinc-300 hover:bg-white/[0.03] transition-colors">
        <span>{title}</span>
        <ChevronDown
          size={14}
          className="text-zinc-500 transition-transform group-open:rotate-180 shrink-0"
        />
      </summary>
      <div className="px-3 pb-3 pt-1 space-y-2 border-t border-white/[0.04]">{children}</div>
    </details>
  );
}

export default function QuoteIntelligencePanel({
  documentExtras,
  onChange,
}: QuoteIntelligencePanelProps) {
  const { items } = useQuote();
  const extrasRef = useRef(documentExtras);
  const [projectContext, setProjectContext] = useState("");
  const [compareWith, setCompareWith] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    extrasRef.current = documentExtras;
  }, [documentExtras]);

  const intelligence = documentExtras.intelligence;

  const handleGenerate = async () => {
    if (!items.length || isGenerating) return;

    setIsGenerating(true);
    setError(null);
    setStatus(null);

    try {
      const response = await fetch("/api/admin/cotizacion/intelligence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          projectContext,
          compareWith,
          customerAddress: extrasRef.current.customerAddress,
        }),
      });

      const data = (await response.json()) as {
        intelligence?: QuoteIntelligence;
        usedAi?: boolean;
        usedWebSearch?: boolean;
        webSearchProvider?: "gemini" | "tavily";
        error?: string;
      };

      if (!response.ok || !data.intelligence) {
        throw new Error(data.error ?? "No se pudo generar el contenido");
      }

      onChange({
        ...extrasRef.current,
        intelligence: data.intelligence,
      });

      const searchLabel =
        data.webSearchProvider === "gemini"
          ? "búsqueda Google (Gemini)"
          : data.webSearchProvider === "tavily"
            ? "búsqueda Tavily"
            : data.usedWebSearch
              ? "búsqueda web"
              : null;

      const parts = [data.usedAi ? "Gemini" : "plantilla local", searchLabel].filter(Boolean);

      setStatus(`Contenido generado (${parts.join(" + ")})`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setIsGenerating(false);
    }
  };

  const updateIntelligence = (patch: Partial<QuoteIntelligence>) => {
    if (!intelligence) return;
    onChange({
      ...extrasRef.current,
      intelligence: { ...intelligence, ...patch },
    });
  };

  return (
    <section className="glass rounded-2xl p-5 border border-white/[0.06] space-y-4">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-[var(--accent)]/12 border border-[var(--accent)]/25 flex items-center justify-center text-[var(--accent-bright)] shrink-0">
          <Brain size={16} />
        </div>
        <div>
          <h2 className="text-sm font-bold">Cotización inteligente</h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Genera descripciones detalladas, comparaciones y un informe técnico como en
            coinforme.pdf. Gemini redacta y también busca en Google productos fuera de
            catálogo. Tavily es opcional como respaldo.
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div className="sm:col-span-2">
          <label className="block text-xs text-zinc-500 mb-1.5">Contexto del proyecto</label>
          <textarea
            className="form-input text-sm min-h-[72px] resize-y"
            placeholder="Ej. Videoportero con reconocimiento facial para vivienda en barrio cerrado"
            value={projectContext}
            onChange={(e) => setProjectContext(e.target.value)}
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs text-zinc-500 mb-1.5">
            Comparar con (opcional)
          </label>
          <input
            className="form-input text-sm"
            placeholder="Portero analógico, cámara WiFi básica, control de acceso empresarial"
            value={compareWith}
            onChange={(e) => setCompareWith(e.target.value)}
          />
        </div>
        <label className="flex items-center gap-2 text-xs text-zinc-400 cursor-pointer">
          <input
            type="checkbox"
            className="rounded border-white/20"
            checked={Boolean(documentExtras.includeIva)}
            onChange={(e) =>
              onChange({ ...extrasRef.current, includeIva: e.target.checked })
            }
          />
          Incluir desglose de IVA (19%) en el PDF
        </label>
        <label className="flex items-center gap-2 text-xs text-zinc-400 cursor-pointer">
          <input
            type="checkbox"
            className="rounded border-white/20"
            checked={intelligence?.includeTechnicalReport !== false}
            onChange={(e) =>
              intelligence
                ? updateIntelligence({ includeTechnicalReport: e.target.checked })
                : undefined
            }
            disabled={!intelligence}
          />
          Incluir informe técnico en el PDF
        </label>
      </div>

      <button
        type="button"
        onClick={handleGenerate}
        disabled={!items.length || isGenerating}
        className="w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 border border-[var(--accent)]/30 bg-[var(--accent)]/12 text-[var(--accent-bright)] hover:bg-[var(--accent)]/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {isGenerating ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Generando cotización inteligente...
          </>
        ) : (
          <>
            <Sparkles size={16} />
            Generar descripciones e informe técnico
          </>
        )}
      </button>

      {status ? (
        <p className="text-xs text-emerald-400 flex items-center gap-1.5">
          <CheckCircle2 size={14} />
          {status}
        </p>
      ) : null}

      {error ? <p className="text-xs text-red-400">{error}</p> : null}

      {intelligence ? (
        <div className="rounded-xl border border-[var(--accent)]/20 bg-zinc-950/50 p-4 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-xs font-bold text-[var(--accent-bright)] uppercase tracking-wide">
              Vista previa del informe
            </h3>
            <p className="text-[11px] text-zinc-500">
              {intelligence.lineDetails.length} ítems ·{" "}
              {intelligence.technicalSections.length} secciones ·{" "}
              {intelligence.comparisons.length} comparaciones
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs text-zinc-500 mb-1.5">Título del proyecto</label>
              <input
                className="form-input text-sm"
                value={intelligence.projectTitle}
                onChange={(e) => updateIntelligence({ projectTitle: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-500 mb-1.5">Resumen del proyecto</label>
              <textarea
                className="form-input text-sm min-h-[64px] resize-y"
                value={intelligence.projectSummary}
                onChange={(e) => updateIntelligence({ projectSummary: e.target.value })}
              />
            </div>
          </div>

          {intelligence.lineDetails.length > 0 ? (
            <PreviewSection
              title={`Descripciones por ítem (${intelligence.lineDetails.length})`}
              defaultOpen
            >
              {intelligence.lineDetails.map((line) => (
                <div
                  key={line.itemId}
                  className="rounded-lg border border-white/[0.05] bg-black/20 p-2.5 space-y-1.5"
                >
                  <p className="text-xs font-semibold text-zinc-200">{line.title}</p>
                  <ul className="space-y-1">
                    {line.bullets.map((bullet, index) => (
                      <li
                        key={`${line.itemId}-${index}`}
                        className="text-[11px] text-zinc-400 leading-relaxed pl-3 relative before:content-['•'] before:absolute before:left-0 before:text-[var(--accent)]"
                      >
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </PreviewSection>
          ) : null}

          <PreviewSection title="Informe técnico" defaultOpen>
            <div className="space-y-2">
              <p className="text-xs font-semibold text-zinc-200">
                {intelligence.technicalReportTitle}
              </p>
              <p className="text-[11px] text-zinc-400 leading-relaxed whitespace-pre-line">
                {intelligence.technicalIntro}
              </p>
            </div>

            {intelligence.technicalSections.map((section) => (
              <div
                key={section.number}
                className="rounded-lg border border-white/[0.05] bg-black/20 p-2.5 space-y-1"
              >
                <p className="text-xs font-semibold text-zinc-200">
                  {section.number}. {section.title}
                </p>
                <p className="text-[11px] text-zinc-400 leading-relaxed">{section.body}</p>
                {section.benefit ? (
                  <p className="text-[11px] text-[var(--accent-bright)]/80 leading-relaxed">
                    Beneficio: {section.benefit}
                  </p>
                ) : null}
              </div>
            ))}

            {intelligence.comparisons.length > 0 ? (
              <div className="space-y-2 pt-1">
                <p className="text-[11px] font-semibold text-zinc-300">Comparaciones</p>
                {intelligence.comparisons.map((item, index) => (
                  <div
                    key={`${item.alternative}-${index}`}
                    className="rounded-lg border border-white/[0.05] bg-black/20 p-2.5 space-y-1"
                  >
                    <p className="text-xs font-semibold text-zinc-200">vs. {item.alternative}</p>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">{item.drawbacks}</p>
                  </div>
                ))}
              </div>
            ) : null}

            <div className="rounded-lg border border-[var(--accent)]/15 bg-[var(--accent)]/5 p-2.5 space-y-1.5">
              <p className="text-[11px] font-semibold text-zinc-300">Conclusión</p>
              <p className="text-[11px] text-zinc-400 leading-relaxed">{intelligence.conclusion}</p>
              <p className="text-[11px] text-zinc-400 leading-relaxed">{intelligence.recommendation}</p>
            </div>
          </PreviewSection>

          {intelligence.termsAndConditions.length > 0 ? (
            <PreviewSection title={`Términos y condiciones (${intelligence.termsAndConditions.length})`}>
              <ul className="space-y-1">
                {intelligence.termsAndConditions.map((term, index) => (
                  <li
                    key={`term-${index}`}
                    className="text-[11px] text-zinc-400 leading-relaxed pl-3 relative before:content-['•'] before:absolute before:left-0 before:text-zinc-600"
                  >
                    {term}
                  </li>
                ))}
              </ul>
            </PreviewSection>
          ) : null}

          {intelligence.sources?.length ? (
            <p className="text-[10px] text-zinc-600 leading-relaxed">
              Fuentes: {intelligence.sources.join(" · ")}
            </p>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}