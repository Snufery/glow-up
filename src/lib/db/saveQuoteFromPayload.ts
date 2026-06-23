import type { QuoteLineItem } from "@/context/QuoteContext";
import { calcQuoteTotals } from "@/lib/quote";
import type { QuoteCustomerInfo, QuoteDocumentExtras } from "@/lib/quoteCustomer";
import { companyLegal } from "@/data/company";
import { saveQuote } from "@/lib/db/quotes";
import type { QuoteSource } from "@/lib/db/types";

export async function saveQuoteFromPayload(input: {
  quoteRef: string;
  customer: QuoteCustomerInfo;
  items: QuoteLineItem[];
  filename?: string;
  source?: QuoteSource;
  extras?: QuoteDocumentExtras;
}) {
  const totals = calcQuoteTotals(input.items);

  return saveQuote({
    quoteRef: input.quoteRef,
    customerName: input.customer.name,
    customerPhone: input.customer.phone,
    customerAddress:
      input.customer.address?.trim() || input.extras?.customerAddress?.trim() || "",
    engineer: input.extras?.engineer?.trim() || companyLegal.defaultEngineer,
    materials: input.extras?.materials?.trim() || "",
    notes: input.extras?.notes?.trim() || "",
    items: input.items,
    productsSubtotal: totals.productsSubtotal,
    installationSubtotal: totals.installationSubtotal,
    grandTotal: totals.grandTotal,
    itemCount: totals.itemCount,
    source: input.source ?? "public",
    pdfFilename: input.filename,
  });
}