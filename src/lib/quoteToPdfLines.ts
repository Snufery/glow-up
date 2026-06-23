import type { QuoteLineItem } from "@/context/QuoteContext";
import {
  calcLineInstallation,
  calcLineSubtotal,
  calcQuoteTotals,
} from "@/lib/quote";
import type { DocumentPdfLine } from "@/lib/documentPdfShared";

export function formatQuoteDisplayNumber(quoteNumber: number | null, quoteRef: string): string {
  if (quoteNumber != null && quoteNumber > 0) {
    return String(quoteNumber).padStart(5, "0");
  }
  const digits = quoteRef.replace(/\D/g, "");
  return digits.slice(-5).padStart(5, "0") || "00001";
}

export function buildQuoteItemDescription(item: QuoteLineItem): string {
  const parts = [item.name];
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

export function quoteItemsToPdfLines(items: QuoteLineItem[]): DocumentPdfLine[] {
  return items.map((item) => {
    const productTotal = calcLineSubtotal(item);
    const installTotal = calcLineInstallation(item);
    const lineTotal = productTotal + installTotal;
    const unitPrice =
      item.quantity > 0 ? Math.round(lineTotal / item.quantity) : lineTotal;

    return {
      quantity: item.quantity,
      description: buildQuoteItemDescription(item),
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

export function quoteItemsToInvoiceLines(items: QuoteLineItem[]) {
  return quoteItemsToPdfLines(items).map((line) => ({
    id: createLineId(),
    description: line.description,
    quantity: line.quantity,
    unitPrice: line.unitPrice,
  }));
}

export function getQuoteGrandTotal(items: QuoteLineItem[]): number {
  return calcQuoteTotals(items).grandTotal;
}