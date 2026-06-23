export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface InvoiceCustomer {
  name: string;
  document: string;
  phone: string;
  email: string;
  address: string;
}

export interface InvoiceData {
  invoiceNumber: string;
  issuedAt: string;
  dueAt: string;
  customer: InvoiceCustomer;
  items: InvoiceLineItem[];
  notes: string;
  materials?: string;
  engineer?: string;
  includeTax: boolean;
  sourceQuoteId?: string;
}

export function generateInvoiceNumber(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `FE-${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}`;
}

export function calcInvoiceSubtotal(items: InvoiceLineItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
}

export function calcInvoiceTax(subtotal: number, includeTax: boolean): number {
  if (!includeTax) return 0;
  return Math.round(subtotal * 0.19);
}

export function calcInvoiceTotal(items: InvoiceLineItem[], includeTax: boolean): number {
  const subtotal = calcInvoiceSubtotal(items);
  return subtotal + calcInvoiceTax(subtotal, includeTax);
}

export function buildInvoiceFilename(invoiceNumber: string, customerName: string): string {
  const slug = customerName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .split(/\s+/)[0]
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(0, 10) || "Cliente";

  const match = invoiceNumber.match(/^FE-(\d{4})(\d{2})(\d{2})/);
  const shortRef = match ? `${match[1].slice(2)}${match[2]}${match[3]}` : "factura";
  return `GlowUp-Factura-${slug}-${shortRef}.pdf`;
}