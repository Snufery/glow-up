import { Document, Page } from "@react-pdf/renderer";
import type { QuoteLineItem } from "@/context/QuoteContext";
import {
  formatPhoneDisplay,
  type QuoteCustomerInfo,
  type QuoteDocumentExtras,
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
import QuoteTechnicalReportPage from "./QuoteTechnicalReportPage";

interface QuotePDFDocumentProps {
  items: QuoteLineItem[];
  quoteRef: string;
  quoteNumber?: number | null;
  customer: QuoteCustomerInfo;
  pdfTitle: string;
  engineer?: string;
  materials?: string;
  notes?: string;
  extras?: QuoteDocumentExtras;
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
  extras,
  issuedAt = new Date(),
  logoUrl,
}: QuotePDFDocumentProps) {
  const intelligence = extras?.intelligence;
  const lines = quoteItemsToPdfLines(items, intelligence);
  const grandTotal = getQuoteGrandTotal(items);
  const showTechnicalReport =
    intelligence?.includeTechnicalReport !== false &&
    (intelligence?.technicalSections?.length ?? 0) > 0;

  return (
    <Document title={pdfTitle}>
      <Page size="A4" style={documentPdfStyles.page} wrap>
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
            projectTitle: intelligence?.projectTitle,
            projectSummary: intelligence?.projectSummary,
            includeIva: extras?.includeIva,
            termsAndConditions: intelligence?.termsAndConditions,
          }}
          lines={lines}
        />
      </Page>

      {showTechnicalReport && intelligence ? (
        <QuoteTechnicalReportPage intelligence={intelligence} />
      ) : null}
    </Document>
  );
}