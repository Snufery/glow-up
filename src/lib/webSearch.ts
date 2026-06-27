import { hasGeminiConfigured } from "@/lib/aiProvider";
import { searchProductWithGemini } from "@/lib/geminiWebSearch";

export interface WebSearchSnippet {
  title: string;
  url: string;
  content: string;
}

export interface WebSearchResult {
  answer: string | null;
  snippets: WebSearchSnippet[];
  provider?: "gemini" | "tavily";
}

async function searchProductWithTavily(query: string): Promise<WebSearchResult | null> {
  const apiKey = process.env.TAVILY_API_KEY?.trim();
  if (!apiKey) return null;

  try {
    const response = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: apiKey,
        query: `${query} especificaciones técnicas Colombia`,
        search_depth: "basic",
        max_results: 5,
        include_answer: true,
      }),
      signal: AbortSignal.timeout(12_000),
    });

    if (!response.ok) return null;

    const data = (await response.json()) as {
      answer?: string;
      results?: Array<{ title?: string; url?: string; content?: string }>;
    };

    const snippets: WebSearchSnippet[] = (data.results ?? [])
      .filter((r) => r.title && r.content)
      .map((r) => ({
        title: r.title!,
        url: r.url ?? "",
        content: r.content!.slice(0, 600),
      }));

    return {
      answer: data.answer?.trim() || null,
      snippets,
      provider: "tavily",
    };
  } catch (error) {
    console.warn("Búsqueda Tavily fallida:", error);
    return null;
  }
}

/** Busca specs en internet: primero Gemini (Google Search), luego Tavily si está configurado. */
export async function searchProductOnWeb(query: string): Promise<WebSearchResult | null> {
  if (hasGeminiConfigured()) {
    const geminiResult = await searchProductWithGemini(query);
    if (geminiResult) {
      return { ...geminiResult, provider: "gemini" };
    }
  }

  return searchProductWithTavily(query);
}