import type { StoredQuote } from "@/lib/db/types";
import {
  type InvoiceData,
  generateInvoiceNumber,
  calcInvoiceSubtotal,
  calcInvoiceTax,
  calcInvoiceTotal,
} from "@/lib/invoice";
import { companyLegal } from "@/data/company";
import { formatQuoteDisplayNumber, quoteItemsToInvoiceLines } from "@/lib/quoteToPdfLines";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function dueISO() {
  const d = new Date();
  d.setDate(d.getDate() + 15);
  return d.toISOString().slice(0, 10);
}

export function buildInvoiceFromQuote(quote: StoredQuote): InvoiceData {
  const quoteNumber = formatQuoteDisplayNumber(quote.quoteNumber ?? null, quote.quoteRef);
  const items = quoteItemsToInvoiceLines(quote.items);

  const projectTitle =
    quote.intelligence?.projectTitle ||
    items.map((item) => item.description).slice(0, 2).join(" + ") ||
    "Proyecto Glow Up";

  return {
    invoiceNumber: generateInvoiceNumber(),
    issuedAt: todayISO(),
    dueAt: dueISO(),
    engineer: quote.engineer || companyLegal.defaultEngineer,
    materials: quote.materials || undefined,
    customer: {
      name: quote.customerName,
      document: "",
      phone: quote.customerPhone,
      email: "",
      address: quote.customerAddress,
    },
    items,
    notes: quote.notes || "",
    includeTax: Boolean(quote.includeIva),
    sourceQuoteId: quote.id,
    quoteReference: quoteNumber,
    projectTitle,
  };
}

export function calcInvoiceAmounts(invoice: InvoiceData) {
  const subtotal = calcInvoiceSubtotal(invoice.items);
  const tax = calcInvoiceTax(subtotal, invoice.includeTax);
  const total = calcInvoiceTotal(invoice.items, invoice.includeTax);
  return { subtotal, tax, total };
}