import type { QuoteLineItem } from "@/context/QuoteContext";
import { calcQuoteTotals } from "@/lib/quote";
import type { QuoteCustomerInfo, QuoteDocumentExtras } from "@/lib/quoteCustomer";
import type { QuoteSource } from "@/lib/db/types";

interface SaveQuoteRecordInput {
  quoteRef: string;
  customer: QuoteCustomerInfo;
  items: QuoteLineItem[];
  filename?: string;
  source?: QuoteSource;
  extras?: QuoteDocumentExtras;
  turnstileToken?: string;
}

export async function persistQuoteRecord(input: SaveQuoteRecordInput): Promise<void> {
  const totals = calcQuoteTotals(input.items);

  try {
    await fetch("/api/cotizacion/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        quoteRef: input.quoteRef,
        customer: input.customer,
        items: input.items,
        filename: input.filename,
        source: input.source ?? "public",
        extras: input.extras,
        totals,
        turnstileToken: input.turnstileToken,
      }),
      keepalive: true,
    });
  } catch (error) {
    console.warn("No se pudo guardar la cotizacion:", error);
  }
}