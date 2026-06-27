import type { QuoteLineItem } from "@/context/QuoteContext";
import type { InvoiceLineItem } from "@/lib/invoice";
import {
  calcLineInstallation,
  calcLineSubtotal,
  calcQuoteTotals,
} from "@/lib/quote";
import type { DocumentPdfLine } from "@/lib/documentPdfShared";
import type { QuoteIntelligence } from "@/lib/quoteIntelligence";

export function formatQuoteDisplayNumber(quoteNumber: number | null, quoteRef: string): string {
  if (quoteNumber != null && quoteNumber > 0) {
    return String(quoteNumber).padStart(5, "0");
  }
  const digits = quoteRef.replace(/\D/g, "");
  return digits.slice(-5).padStart(5, "0") || "00001";
}

export function buildQuoteItemDescription(item: QuoteLineItem): string {
  const parts = [item.name];
  if (item.roomLabel) {
    parts.push(item.roomLabel);
  }
  if (item.channels) {
    parts.push(`${item.channels} canal${item.channels > 1 ? "es" : ""}`);
  }
  if (item.colorLabel) {
    parts.push(item.colorLabel);
  }
  if (item.includeInstallation && item.installationPrice) {
    parts.push("incluye instalación");
  }
  return parts.join(" · ");
}

export function quoteItemsToPdfLines(
  items: QuoteLineItem[],
  intelligence?: QuoteIntelligence
): DocumentPdfLine[] {
  return items.map((item) => {
    const productTotal = calcLineSubtotal(item);
    const installTotal = calcLineInstallation(item);
    const lineTotal = productTotal + installTotal;
    const unitPrice =
      item.quantity > 0 ? Math.round(lineTotal / item.quantity) : lineTotal;

    const intelLine = intelligence?.lineDetails.find((line) => line.itemId === item.id);

    return {
      quantity: item.quantity,
      description: intelLine?.title ?? buildQuoteItemDescription(item),
      bullets: intelLine?.bullets,
      unitPrice,
      total: lineTotal,
    };
  });
}

function createLineId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `line-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function quoteItemsToInvoiceLines(items: QuoteLineItem[]): InvoiceLineItem[] {
  const lines: InvoiceLineItem[] = [];

  for (const item of items) {
    const productTotal = calcLineSubtotal(item);
    const installTotal = calcLineInstallation(item);

    if (productTotal > 0) {
      lines.push({
        id: createLineId(),
        description: buildQuoteItemDescription({
          ...item,
          includeInstallation: false,
          installationPrice: null,
        }),
        quantity: item.quantity,
        unitPrice: item.quantity > 0 ? Math.round(productTotal / item.quantity) : productTotal,
        section: "equipos",
      });
    }

    if (installTotal > 0) {
      lines.push({
        id: createLineId(),
        description: `Instalación profesional — ${item.name}`,
        quantity: item.quantity,
        unitPrice: item.quantity > 0 ? Math.round(installTotal / item.quantity) : installTotal,
        section: "servicios",
      });
    }
  }

  if (!lines.length) {
    return quoteItemsToPdfLines(items).map((line) => ({
      id: createLineId(),
      description: line.description,
      quantity: line.quantity,
      unitPrice: line.unitPrice,
      section: "equipos" as const,
    }));
  }

  return lines;
}

export function getQuoteGrandTotal(items: QuoteLineItem[]): number {
  return calcQuoteTotals(items).grandTotal;
}