import { generateObject, zodSchema } from "ai";
import { createGeminiModel, hasGeminiConfigured } from "@/lib/aiProvider";
import type { QuoteLineItem } from "@/context/QuoteContext";
import { products } from "@/data/products";
import { companyLegal } from "@/data/company";
import { contactInfo } from "@/data/contact";
import {
  DEFAULT_QUOTE_TERMS,
  quoteIntelligenceSchema,
  type QuoteIntelligence,
} from "@/lib/quoteIntelligence";
import { searchProductOnWeb } from "@/lib/webSearch";

interface CatalogContext {
  productId: string;
  name: string;
  description: string;
  features: string[];
  category: string;
  inCatalog: boolean;
}

interface GenerateIntelligenceInput {
  items: QuoteLineItem[];
  projectContext?: string;
  compareWith?: string;
  customerAddress?: string;
}

interface GenerateIntelligenceResult {
  intelligence: QuoteIntelligence;
  usedAi: boolean;
  usedWebSearch: boolean;
  webSearchProvider?: "gemini" | "tavily";
}

function hasAiConfigured(): boolean {
  return hasGeminiConfigured();
}

function buildCatalogContext(items: QuoteLineItem[]): CatalogContext[] {
  return items.map((item) => {
    if (item.isCustom) {
      return {
        productId: item.id,
        name: item.name,
        description: item.customDescription ?? item.name,
        features: item.customDescription ? [item.customDescription] : [],
        category: "personalizado",
        inCatalog: false,
      };
    }

    const product = products.find((p) => p.id === item.productId);
    return {
      productId: item.id,
      name: item.name,
      description: product?.description ?? item.name,
      features: product?.features ?? [],
      category: product?.category ?? item.category,
      inCatalog: Boolean(product),
    };
  });
}

async function enrichCustomItemsWithWeb(
  contexts: CatalogContext[]
): Promise<{
  contexts: CatalogContext[];
  usedWebSearch: boolean;
  webSearchProvider?: "gemini" | "tavily";
  sources: string[];
}> {
  const sources: string[] = [];
  let usedWebSearch = false;
  let webSearchProvider: "gemini" | "tavily" | undefined;

  const enriched = await Promise.all(
    contexts.map(async (ctx) => {
      if (ctx.inCatalog) return ctx;

      const search = await searchProductOnWeb(ctx.name);
      if (!search) return ctx;

      usedWebSearch = true;
      webSearchProvider = search.provider ?? webSearchProvider;
      const webFeatures = [
        search.answer,
        ...search.snippets.map((s) => `${s.title}: ${s.content}`),
      ].filter(Boolean) as string[];

      for (const snippet of search.snippets) {
        if (snippet.url) sources.push(snippet.url);
      }

      return {
        ...ctx,
        description: search.answer ?? ctx.description,
        features: [...ctx.features, ...webFeatures.slice(0, 4)],
      };
    })
  );

  return {
    contexts: enriched,
    usedWebSearch,
    webSearchProvider,
    sources: [...new Set(sources)].slice(0, 8),
  };
}

function buildFallbackIntelligence(
  items: QuoteLineItem[],
  contexts: CatalogContext[],
  input: GenerateIntelligenceInput,
  sources: string[]
): QuoteIntelligence {
  const mainProduct = contexts[0]?.name ?? "Solución inteligente";
  const location = input.customerAddress?.trim() || contactInfo.location;

  const lineDetails = items.map((item) => {
    const ctx = contexts.find((c) => c.productId === item.id);
    const bullets: string[] = [];

    if (item.channels) {
      bullets.push(`${item.channels} canal${item.channels > 1 ? "es" : ""} de control`);
    }
    if (item.colorLabel) bullets.push(`Acabado ${item.colorLabel}`);
    if (item.includeInstallation) bullets.push("Incluye instalación profesional");

    for (const feature of ctx?.features.slice(0, 6) ?? []) {
      bullets.push(feature);
    }

    if (bullets.length === 0) {
      bullets.push(ctx?.description ?? item.name);
    }

    return {
      itemId: item.id,
      title: item.name,
      bullets: bullets.slice(0, 8),
    };
  });

  const technicalSections = contexts.flatMap((ctx, index) => {
    const features = ctx.features.slice(0, 3);
    if (!features.length) return [];

    return features.map((feature, fIndex) => ({
      number: index * 3 + fIndex + 1,
      title: `${ctx.name}: ventaja ${fIndex + 1}`,
      body: feature,
      benefit: `Beneficio para su proyecto en ${location}.`,
    }));
  }).slice(0, 6);

  if (technicalSections.length === 0) {
    technicalSections.push({
      number: 1,
      title: `Por qué elegir ${mainProduct}`,
      body: `Recomendamos ${mainProduct} por su equilibrio entre tecnología, facilidad de uso y soporte local de Glow Up en Popayán.`,
      benefit: "Solución adaptada a viviendas y negocios en la región.",
    });
  }

  const comparisons = (input.compareWith ?? "")
    .split(/[,;\n]+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 4)
    .map((alt) => ({
      alternative: alt,
      drawbacks: `Frente a ${mainProduct}, suele ofrecer menor integración, soporte limitado o funciones menos completas para este proyecto.`,
    }));

  return {
    projectTitle: `Proyecto de automatización: ${mainProduct}`,
    projectSummary:
      input.projectContext?.trim() ||
      `Implementación de ${mainProduct} para ${location}, con equipos seleccionados según necesidades de confort, seguridad y control inteligente.`,
    lineDetails,
    termsAndConditions: [...DEFAULT_QUOTE_TERMS],
    technicalReportTitle: `Informe de justificación técnica — ${mainProduct}`,
    technicalIntro: `Estimado cliente,\n\nTras evaluar su necesidad${input.projectContext ? ` (${input.projectContext.trim()})` : ""}, presentamos la justificación técnica de la solución propuesta por ${companyLegal.name}.`,
    technicalSections,
    comparisons,
    conclusion: `${mainProduct} combina funcionalidad comprobada, facilidad de operación y acompañamiento técnico local.`,
    recommendation: `Recomendamos avanzar con esta propuesta e, idealmente, agendar una visita técnica para validar cableado, ubicación de equipos y alcance final.`,
    includeTechnicalReport: true,
    generatedAt: new Date().toISOString(),
    sources: sources.length ? sources : undefined,
  };
}

export async function generateQuoteIntelligence(
  input: GenerateIntelligenceInput
): Promise<GenerateIntelligenceResult> {
  const baseContexts = buildCatalogContext(input.items);
  const { contexts, usedWebSearch, webSearchProvider, sources } =
    await enrichCustomItemsWithWeb(baseContexts);

  if (!hasAiConfigured()) {
    return {
      intelligence: buildFallbackIntelligence(input.items, contexts, input, sources),
      usedAi: false,
      usedWebSearch,
      webSearchProvider,
    };
  }

  const itemsSummary = input.items.map((item) => ({
    id: item.id,
    name: item.name,
    quantity: item.quantity,
    channels: item.channels,
    color: item.colorLabel,
    installation: item.includeInstallation,
    custom: Boolean(item.isCustom),
  }));

  const catalogBlock = contexts
    .map(
      (ctx) =>
        `- ${ctx.name} (${ctx.inCatalog ? "catálogo Glow Up" : "fuera de catálogo"}): ${ctx.description}\n  Características: ${ctx.features.join("; ") || "N/D"}`
    )
    .join("\n");

  const webBlock = sources.length
    ? `\nFuentes web consultadas:\n${sources.map((s) => `- ${s}`).join("\n")}`
    : "";

  const compareBlock = input.compareWith?.trim()
    ? `\nAlternativas a comparar: ${input.compareWith.trim()}`
    : "";

  try {
    const { object } = await generateObject({
      model: createGeminiModel(),
      schema: zodSchema(quoteIntelligenceSchema),
      system: `Eres ingeniero de domótica de Glow Up Entornos Inteligentes en Popayán, Colombia.
Redactas cotizaciones e informes técnicos en español (Colombia), claros y persuasivos.
Usa solo información verificable del catálogo o de las fuentes web proporcionadas.
No inventes precios ni especificaciones no confirmadas.
El tono debe ser profesional, como el informe EZVIZ HP7 Pro de referencia.`,
      prompt: `Genera contenido inteligente para una cotización.

Contexto del proyecto: ${input.projectContext?.trim() || "Instalación residencial/comercial en Popayán"}
Dirección cliente: ${input.customerAddress?.trim() || contactInfo.location}

Ítems cotizados:
${JSON.stringify(itemsSummary, null, 2)}

Información de productos:
${catalogBlock}
${webBlock}
${compareBlock}

Requisitos:
1. projectTitle y projectSummary describen el proyecto completo.
2. lineDetails: un objeto por cada itemId con title y bullets (viñetas técnicas detalladas).
3. termsAndConditions: 5-8 términos profesionales (garantía, pago, validez, entrega).
4. technicalReportTitle, technicalIntro, technicalSections (numeradas con benefit), comparisons (si hay alternativas), conclusion y recommendation.
5. includeTechnicalReport: true.
6. Si hay fuentes web, inclúyelas en sources.`,
    });

    return {
      intelligence: {
        ...object,
        generatedAt: new Date().toISOString(),
        sources: object.sources?.length ? object.sources : sources.length ? sources : undefined,
      },
      usedAi: true,
      usedWebSearch,
      webSearchProvider,
    };
  } catch (error) {
    console.error("Error generando inteligencia con IA:", error);
    return {
      intelligence: buildFallbackIntelligence(input.items, contexts, input, sources),
      usedAi: false,
      usedWebSearch,
      webSearchProvider,
    };
  }
}