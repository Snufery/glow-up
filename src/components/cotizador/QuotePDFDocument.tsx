import { Document, Page } from "@react-pdf/renderer";
import type { QuoteLineItem } from "@/context/QuoteContext";
import {
  formatPhoneDisplay,
  type QuoteCustomerInfo,
} from "@/lib/quoteCustomer";
import { companyLegal } from "@/data/company";
import {
  DocumentPdfContent,
  documentPdfStyles,
} from "@/lib/documentPdfShared";
import {
  formatQuoteDisplayNumber,
  getQuoteGrandTotal,
  quoteItemsToPdfLines,
} from "@/lib/quoteToPdfLines";

interface QuotePDFDocumentProps {
  items: QuoteLineItem[];
  quoteRef: string;
  quoteNumber?: number | null;
  customer: QuoteCustomerInfo;
  pdfTitle: string;
  engineer?: string;
  materials?: string;
  notes?: string;
  issuedAt?: Date;
  logoUrl?: string;
}

export default function QuotePDFDocument({
  items,
  quoteRef,
  quoteNumber,
  customer,
  pdfTitle,
  engineer,
  materials,
  notes,
  issuedAt = new Date(),
  logoUrl,
}: QuotePDFDocumentProps) {
  const lines = quoteItemsToPdfLines(items);
  const grandTotal = getQuoteGrandTotal(items);

  return (
    <Document title={pdfTitle}>
      <Page size="A4" style={documentPdfStyles.page}>
        <DocumentPdfContent
          meta={{
            documentType: "Cotización",
            documentNumber: formatQuoteDisplayNumber(quoteNumber ?? null, quoteRef),
            issuedAt,
            engineer: engineer || companyLegal.defaultEngineer,
            billToName: customer.name,
            billToAddress: customer.address || "",
            billToPhone: formatPhoneDisplay(customer.phone),
            materials,
            notes,
            grandTotal,
            logoUrl,
          }}
          lines={lines}
        />
      </Page>
    </Document>
  );
}