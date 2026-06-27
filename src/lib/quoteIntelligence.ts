import { z } from "zod";

export const quoteIntelligenceLineSchema = z.object({
  itemId: z.string(),
  title: z.string(),
  bullets: z.array(z.string()).min(1).max(12),
});

export const quoteIntelligenceTechnicalSectionSchema = z.object({
  number: z.coerce.number().int().min(1).max(20),
  title: z.string(),
  body: z.string(),
  benefit: z.string().optional(),
});

export const quoteIntelligenceComparisonSchema = z.object({
  alternative: z.string(),
  drawbacks: z.string(),
});

export const quoteIntelligenceSchema = z.object({
  projectTitle: z.string(),
  projectSummary: z.string(),
  lineDetails: z.array(quoteIntelligenceLineSchema),
  termsAndConditions: z.array(z.string()).min(1).max(12),
  technicalReportTitle: z.string(),
  technicalIntro: z.string(),
  technicalSections: z.array(quoteIntelligenceTechnicalSectionSchema).min(1).max(12),
  comparisons: z.array(quoteIntelligenceComparisonSchema).max(6).default([]),
  conclusion: z.string(),
  recommendation: z.string(),
  includeTechnicalReport: z.boolean().optional(),
  generatedAt: z.string().optional(),
  sources: z.array(z.string()).optional(),
});

export type QuoteIntelligence = z.infer<typeof quoteIntelligenceSchema>;

export const DEFAULT_QUOTE_TERMS = [
  "Garantía: 12 meses en equipo (fabricante) + 6 meses en mano de obra de instalación.",
  "Forma de pago: 50% anticipo para confirmar pedido + 50% contra entrega e instalación.",
  "Validez: Esta cotización tiene validez de 15 días calendario.",
  "Entrega: Según disponibilidad de inventario + instalación programada según agenda.",
  "Incluye: Configuración, capacitación al cliente y entrega documentada.",
  "No incluye: Modificaciones estructurales mayores ni trámites de permisos, salvo que se indiquen en la cotización.",
] as const;

export function isQuoteIntelligence(value: unknown): value is QuoteIntelligence {
  return quoteIntelligenceSchema.safeParse(value).success;
}

/** Corrige respuestas de IA antes de validar (campos omitidos, tipos sueltos). */
export function normalizeQuoteIntelligence(raw: unknown): unknown {
  if (!raw || typeof raw !== "object") return raw;

  const value = raw as Record<string, unknown>;

  return {
    ...value,
    comparisons: Array.isArray(value.comparisons) ? value.comparisons : [],
    lineDetails: Array.isArray(value.lineDetails)
      ? value.lineDetails.map((line) => {
          if (!line || typeof line !== "object") return line;
          const row = line as Record<string, unknown>;
          const bullets = Array.isArray(row.bullets)
            ? row.bullets.filter((b): b is string => typeof b === "string" && b.trim().length > 0)
            : [];
          return {
            ...row,
            bullets: bullets.length ? bullets : [String(row.title ?? "Detalle del producto")],
          };
        })
      : [],
    technicalSections: Array.isArray(value.technicalSections)
      ? value.technicalSections.map((section, index) => {
          if (!section || typeof section !== "object") return section;
          const row = section as Record<string, unknown>;
          const parsedNumber = Number(row.number);
          return {
            ...row,
            number:
              Number.isFinite(parsedNumber) && parsedNumber >= 1
                ? Math.floor(parsedNumber)
                : index + 1,
          };
        })
      : [],
    termsAndConditions: Array.isArray(value.termsAndConditions)
      ? value.termsAndConditions.filter((t): t is string => typeof t === "string" && t.trim().length > 0)
      : value.termsAndConditions,
    includeTechnicalReport:
      typeof value.includeTechnicalReport === "boolean" ? value.includeTechnicalReport : true,
  };
}