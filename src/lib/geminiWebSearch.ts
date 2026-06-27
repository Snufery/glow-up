import { generateText } from "ai";
import { createGeminiModel, createGeminiProvider } from "@/lib/aiProvider";
import type { WebSearchResult } from "@/lib/webSearch";

export async function searchProductWithGemini(query: string): Promise<WebSearchResult | null> {
  try {
    const gemini = createGeminiProvider();
    const result = await generateText({
      model: createGeminiModel(),
      tools: {
        google_search: gemini.tools.googleSearch({}),
      },
      prompt: `Investiga el producto "${query}" para una cotización de domótica o seguridad en Colombia.

Usa Google Search para obtener especificaciones técnicas confirmadas del fabricante o distribuidores oficiales.

Responde en español con:
1. Un párrafo resumen técnico (máx. 120 palabras).
2. Lista de 4-6 características verificables (una por línea, con guion).

No inventes datos. Si no encuentras información fiable, indícalo brevemente.`,
    });

    const text = result.text?.trim();
    if (!text) return null;

    const snippets = result.sources
      .filter((source) => source.sourceType === "url")
      .map((source) => ({
        title: source.title ?? "Fuente web",
        url: source.url,
        content: "",
      }));

    return {
      answer: text,
      snippets,
    };
  } catch (error) {
    console.warn("Búsqueda Gemini fallida:", error);
    return null;
  }
}