import type { QuoteLineItem } from "@/context/QuoteContext";
import type { InvoiceCustomer, InvoiceData, InvoiceLineItem } from "@/lib/invoice";
import type { QuoteIntelligence } from "@/lib/quoteIntelligence";

export type QuoteSource = "public" | "admin";

export interface StoredQuote {
  id: string;
  quoteRef: string;
  quoteNumber?: number | null;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  engineer: string;
  materials: string;
  notes: string;
  items: QuoteLineItem[];
  productsSubtotal: number;
  installationSubtotal: number;
  grandTotal: number;
  itemCount: number;
  source: QuoteSource;
  pdfFilename: string | null;
  convertedToInvoice: boolean;
  intelligence?: QuoteIntelligence | null;
  includeIva?: boolean;
  createdAt: string;
}

export interface StoredInvoice {
  id: string;
  invoiceNumber: string;
  sourceQuoteId: string | null;
  engineer: string;
  materials: string;
  customer: InvoiceCustomer;
  items: InvoiceLineItem[];
  subtotal: number;
  tax: number;
  total: number;
  includeTax: boolean;
  notes: string;
  issuedAt: string;
  dueAt: string;
  pdfFilename: string | null;
  createdAt: string;
}

export interface SaveQuoteInput {
  quoteRef: string;
  customerName: string;
  customerPhone: string;
  customerAddress?: string;
  engineer?: string;
  materials?: string;
  notes?: string;
  items: QuoteLineItem[];
  productsSubtotal: number;
  installationSubtotal: number;
  grandTotal: number;
  itemCount: number;
  source?: QuoteSource;
  pdfFilename?: string;
  intelligence?: QuoteIntelligence | null;
  includeIva?: boolean;
}

export interface SaveInvoiceInput {
  invoice: InvoiceData;
  subtotal: number;
  tax: number;
  total: number;
  pdfFilename?: string;
  sourceQuoteId?: string;
  engineer?: string;
  materials?: string;
}