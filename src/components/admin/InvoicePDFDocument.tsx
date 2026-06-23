import { Document, Page } from "@react-pdf/renderer";
import type { InvoiceData } from "@/lib/invoice";
import {
  calcInvoiceSubtotal,
  calcInvoiceTax,
  calcInvoiceTotal,
} from "@/lib/invoice";
import { companyLegal } from "@/data/company";
import {
  DocumentPdfContent,
  documentPdfStyles,
  type DocumentPdfLine,
} from "@/lib/documentPdfShared";
import { formatCOP } from "@/lib/quote";

function invoiceItemsToPdfLines(invoice: InvoiceData): DocumentPdfLine[] {
  return invoice.items.map((item) => ({
    quantity: item.quantity,
    description: item.description,
    unitPrice: item.unitPrice,
    total: item.quantity * item.unitPrice,
  }));
}

function formatInvoiceDisplayNumber(invoiceNumber: string): string {
  const digits = invoiceNumber.replace(/\D/g, "");
  return digits.slice(-5).padStart(5, "0") || invoiceNumber;
}

export default function InvoicePDFDocument({
  invoice,
}: {
  invoice: InvoiceData;
  logoUrl?: string;
}) {
  const subtotal = calcInvoiceSubtotal(invoice.items);
  const tax = calcInvoiceTax(subtotal, invoice.includeTax);
  const total = calcInvoiceTotal(invoice.items, invoice.includeTax);
  const lines = invoiceItemsToPdfLines(invoice);

  const taxNote = invoice.includeTax
    ? `\nIVA 19%: ${formatCOP(tax)}`
    : "";

  const combinedNotes = [invoice.notes, taxNote ? `Desglose: Subtotal ${formatCOP(subtotal)}${taxNote}` : ""]
    .filter(Boolean)
    .join("\n");

  return (
    <Document title={`Factura ${invoice.invoiceNumber}`}>
      <Page size="A4" style={documentPdfStyles.page}>
        <DocumentPdfContent
          meta={{
            documentType: "Factura",
            documentNumber: formatInvoiceDisplayNumber(invoice.invoiceNumber),
            issuedAt: new Date(invoice.issuedAt + "T12:00:00"),
            engineer: invoice.engineer || companyLegal.defaultEngineer,
            billToName: invoice.customer.name,
            billToAddress: invoice.customer.address || "",
            materials: invoice.materials,
            notes: combinedNotes || undefined,
            grandTotal: total,
          }}
          lines={lines}
        />
      </Page>
    </Document>
  );
}