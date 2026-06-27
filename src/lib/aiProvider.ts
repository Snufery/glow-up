import { createGoogleGenerativeAI, type GoogleGenerativeAIProvider } from "@ai-sdk/google";

const DEFAULT_GEMINI_MODEL = "gemini-2.0-flash";

/** Lee la API key de Gemini (acepta ambos nombres de variable). */
export function getGeminiApiKey(): string | null {
  return (
    process.env.GOOGLE_GENERATIVE_AI_API_KEY?.trim() ||
    process.env.GEMINI_API_KEY?.trim() ||
    null
  );
}

export function hasGeminiConfigured(): boolean {
  return Boolean(getGeminiApiKey());
}

export function getGeminiModelId(): string {
  return process.env.GEMINI_MODEL?.trim() || DEFAULT_GEMINI_MODEL;
}

export function createGeminiProvider(): GoogleGenerativeAIProvider {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    throw new Error("Gemini API key no configurada");
  }

  return createGoogleGenerativeAI({ apiKey });
}

export function createGeminiModel() {
  return createGeminiProvider()(getGeminiModelId());
}