import { Text, View, StyleSheet } from "@react-pdf/renderer";
import { formatCOP } from "@/lib/quote";
import { companyLegal } from "@/data/company";

export interface DocumentPdfLine {
  quantity: number;
  description: string;
  unitPrice: number;
  total: number;
}

export interface DocumentPdfMeta {
  documentType: "Cotización" | "Factura";
  documentNumber: string;
  issuedAt: Date;
  engineer: string;
  billToName: string;
  billToAddress: string;
  materials?: string;
  notes?: string;
  grandTotal: number;
}

const BRAND_GREEN = "#7ab648";
const BRAND_TEAL = "#2bbcb3";

export const documentPdfStyles = StyleSheet.create({
  page: {
    paddingTop: 36,
    paddingBottom: 90,
    paddingHorizontal: 42,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#1a1a1a",
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: BRAND_TEAL,
    marginBottom: 18,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },
  metaBlock: {
    width: "30%",
  },
  metaLabel: {
    fontSize: 8,
    color: "#666666",
    marginBottom: 3,
  },
  metaValue: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#1a1a1a",
  },
  billToSection: {
    marginBottom: 18,
  },
  billToLabel: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: BRAND_GREEN,
    marginBottom: 6,
    textTransform: "uppercase",
  },
  billToName: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    marginBottom: 2,
  },
  billToAddress: {
    fontSize: 9,
    color: "#444444",
    lineHeight: 1.4,
  },
  table: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#d4d4d4",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: BRAND_TEAL,
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  tableHeaderCell: {
    color: "#ffffff",
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eeeeee",
    minHeight: 28,
    alignItems: "flex-start",
  },
  tableRowAlt: {
    backgroundColor: "#f9f9f9",
  },
  colQty: { width: "12%", textAlign: "center" },
  colDesc: { width: "46%" },
  colUnit: { width: "20%", textAlign: "right" },
  colTotal: { width: "22%", textAlign: "right", fontFamily: "Helvetica-Bold" },
  cellText: { fontSize: 9, lineHeight: 1.35 },
  sectionTitle: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: BRAND_GREEN,
    marginBottom: 6,
    textTransform: "uppercase",
  },
  materialsBox: {
    marginBottom: 14,
    padding: 10,
    backgroundColor: "#f5f5f5",
    borderLeftWidth: 3,
    borderLeftColor: BRAND_GREEN,
  },
  materialsText: {
    fontSize: 9,
    lineHeight: 1.5,
    color: "#333333",
  },
  notesBox: {
    marginBottom: 14,
  },
  notesText: {
    fontSize: 9,
    lineHeight: 1.5,
    color: "#444444",
  },
  thanks: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: BRAND_TEAL,
    marginBottom: 20,
    marginTop: 4,
  },
  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 16,
    gap: 12,
  },
  grandTotalLabel: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
  },
  grandTotalValue: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: BRAND_GREEN,
  },
  footer: {
    position: "absolute",
    bottom: 28,
    left: 42,
    right: 42,
    textAlign: "center",
    fontSize: 7.5,
    color: "#555555",
    lineHeight: 1.5,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    paddingTop: 10,
  },
  footerBrand: {
    fontFamily: "Helvetica-Bold",
    fontSize: 8,
    color: BRAND_TEAL,
    marginBottom: 3,
  },
});

function formatDocumentDate(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(date.getDate())}-${pad(date.getMonth() + 1)}-${date.getFullYear()}`;
}

export function DocumentPdfContent({
  meta,
  lines,
}: {
  meta: DocumentPdfMeta;
  lines: DocumentPdfLine[];
}) {
  const numberLabel =
    meta.documentType === "Cotización" ? "Nº de cotización" : "Nº de factura";

  return (
    <>
      <Text style={documentPdfStyles.title}>{meta.documentType}</Text>

      <View style={documentPdfStyles.metaRow}>
        <View style={documentPdfStyles.metaBlock}>
          <Text style={documentPdfStyles.metaLabel}>Fecha</Text>
          <Text style={documentPdfStyles.metaValue}>
            {formatDocumentDate(meta.issuedAt)}
          </Text>
        </View>
        <View style={documentPdfStyles.metaBlock}>
          <Text style={documentPdfStyles.metaLabel}>{numberLabel}</Text>
          <Text style={documentPdfStyles.metaValue}>{meta.documentNumber}</Text>
        </View>
        <View style={documentPdfStyles.metaBlock}>
          <Text style={documentPdfStyles.metaLabel}>Ingeniero</Text>
          <Text style={documentPdfStyles.metaValue}>{meta.engineer}</Text>
        </View>
      </View>

      <View style={documentPdfStyles.billToSection}>
        <Text style={documentPdfStyles.billToLabel}>Facturar a</Text>
        <Text style={documentPdfStyles.billToName}>{meta.billToName}</Text>
        {meta.billToAddress ? (
          <Text style={documentPdfStyles.billToAddress}>{meta.billToAddress}</Text>
        ) : null}
      </View>

      <View style={documentPdfStyles.table}>
        <View style={documentPdfStyles.tableHeader}>
          <Text style={[documentPdfStyles.tableHeaderCell, documentPdfStyles.colQty]}>
            Cantidad
          </Text>
          <Text style={[documentPdfStyles.tableHeaderCell, documentPdfStyles.colDesc]}>
            Descripción
          </Text>
          <Text style={[documentPdfStyles.tableHeaderCell, documentPdfStyles.colUnit]}>
            Precio unitario
          </Text>
          <Text style={[documentPdfStyles.tableHeaderCell, documentPdfStyles.colTotal]}>
            Total
          </Text>
        </View>

        {lines.map((line, index) => (
          <View
            key={`${line.description}-${index}`}
            style={[
              documentPdfStyles.tableRow,
              index % 2 === 1 ? documentPdfStyles.tableRowAlt : {},
            ]}
          >
            <Text style={[documentPdfStyles.cellText, documentPdfStyles.colQty]}>
              {line.quantity}
            </Text>
            <Text style={[documentPdfStyles.cellText, documentPdfStyles.colDesc]}>
              {line.description}
            </Text>
            <Text style={[documentPdfStyles.cellText, documentPdfStyles.colUnit]}>
              {line.unitPrice > 0 ? formatCOP(line.unitPrice) : ""}
            </Text>
            <Text style={[documentPdfStyles.cellText, documentPdfStyles.colTotal]}>
              {line.total > 0 ? formatCOP(line.total) : ""}
            </Text>
          </View>
        ))}
      </View>

      <View style={documentPdfStyles.grandTotalRow}>
        <Text style={documentPdfStyles.grandTotalLabel}>Total</Text>
        <Text style={documentPdfStyles.grandTotalValue}>
          {formatCOP(meta.grandTotal)}
        </Text>
      </View>

      {meta.materials ? (
        <View style={documentPdfStyles.materialsBox}>
          <Text style={documentPdfStyles.sectionTitle}>Materiales requeridos</Text>
          <Text style={documentPdfStyles.materialsText}>{meta.materials}</Text>
        </View>
      ) : null}

      {meta.notes ? (
        <View style={documentPdfStyles.notesBox}>
          {meta.notes.split("\n").map((paragraph, i) => (
            <Text key={i} style={[documentPdfStyles.notesText, { marginBottom: 4 }]}>
              {paragraph}
            </Text>
          ))}
        </View>
      ) : null}

      <Text style={documentPdfStyles.thanks}>Gracias por su preferencia.</Text>

      <View style={documentPdfStyles.footer} fixed>
        <Text style={documentPdfStyles.footerBrand}>{companyLegal.name}</Text>
        <Text>
          {companyLegal.nit}
          {"\n"}
          {companyLegal.registry}
          {"\n"}
          {companyLegal.copnia}
          {"\n"}
          {companyLegal.taxStatus}
          {"\n"}
          {companyLegal.phone}
        </Text>
      </View>
    </>
  );
}