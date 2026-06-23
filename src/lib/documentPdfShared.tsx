import {
  Text,
  View,
  Image,
  StyleSheet,
  Svg,
  Defs,
  LinearGradient,
  Stop,
  Rect,
} from "@react-pdf/renderer";
import { formatCOP } from "@/lib/quote";
import { companyLegal } from "@/data/company";
import { contactInfo } from "@/data/contact";

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
  billToAddress?: string;
  billToPhone?: string;
  billToDocument?: string;
  materials?: string;
  notes?: string;
  grandTotal: number;
  logoUrl?: string;
}

const BRAND_GLOW = "#7ab648";
const BRAND_GLOW_DARK = "#5e9a2f";
const BRAND_UP = "#2bbcb3";
const BRAND_UP_DARK = "#1f9a92";
const BRAND_GLOW_LIGHT = "#eef6e6";
const BRAND_UP_LIGHT = "#e6f7f5";
const BRAND_MIX_LIGHT = "#f0f9f4";

const CONTENT_WIDTH = 511;

export const documentPdfStyles = StyleSheet.create({
  page: {
    paddingTop: 32,
    paddingBottom: 88,
    paddingHorizontal: 42,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#18181b",
    backgroundColor: "#ffffff",
  },
});

const styles = StyleSheet.create({
  accentBar: {
    marginBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 22,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: BRAND_UP_LIGHT,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    maxWidth: "58%",
  },
  logoWrap: {
    width: 52,
    height: 52,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#0a0a0a",
    borderWidth: 1,
    borderColor: BRAND_UP_LIGHT,
  },
  logo: {
    width: 52,
    height: 52,
    objectFit: "contain",
  },
  brandTitle: {
    fontSize: 17,
    fontFamily: "Helvetica-Bold",
    marginBottom: 2,
  },
  brandGlow: {
    color: BRAND_GLOW,
  },
  brandUp: {
    color: BRAND_UP,
  },
  brandSub: {
    fontSize: 7.5,
    color: BRAND_UP_DARK,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    fontFamily: "Helvetica-Bold",
  },
  contactBlock: {
    textAlign: "right",
    fontSize: 8,
    color: "#52525b",
    lineHeight: 1.55,
    maxWidth: "38%",
  },
  contactHighlight: {
    color: BRAND_UP_DARK,
    fontFamily: "Helvetica-Bold",
  },
  typeBanner: {
    marginBottom: 18,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: BRAND_MIX_LIGHT,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: BRAND_UP_LIGHT,
    borderLeftWidth: 5,
  },
  typeBannerQuote: {
    borderLeftColor: BRAND_GLOW,
  },
  typeBannerInvoice: {
    borderLeftColor: BRAND_UP,
  },
  typeTitle: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    marginBottom: 2,
  },
  typeTitleQuote: {
    color: BRAND_GLOW_DARK,
  },
  typeTitleInvoice: {
    color: BRAND_UP_DARK,
  },
  typeSubtitle: {
    fontSize: 8,
    color: "#52525b",
    lineHeight: 1.4,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 18,
  },
  metaCard: {
    flex: 1,
    padding: 10,
    backgroundColor: BRAND_UP_LIGHT,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#c5ece8",
  },
  metaLabel: {
    fontSize: 7,
    color: BRAND_UP_DARK,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 4,
    fontFamily: "Helvetica-Bold",
  },
  metaValue: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#18181b",
  },
  metaValueAccent: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: BRAND_GLOW_DARK,
  },
  billToSection: {
    marginBottom: 18,
    padding: 12,
    backgroundColor: BRAND_GLOW_LIGHT,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#d4e8bc",
    borderLeftWidth: 4,
    borderLeftColor: BRAND_GLOW,
  },
  billToLabel: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    color: BRAND_GLOW_DARK,
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  billToName: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    marginBottom: 3,
    color: "#18181b",
  },
  billToDetail: {
    fontSize: 9,
    color: "#3f3f46",
    lineHeight: 1.45,
  },
  tableWrapper: {
    marginBottom: 14,
    borderRadius: 6,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: BRAND_UP_LIGHT,
  },
  tableHeader: {
    flexDirection: "row",
    paddingVertical: 9,
    paddingHorizontal: 8,
    position: "relative",
  },
  tableHeaderCell: {
    color: "#ffffff",
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 9,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e8f0ec",
    minHeight: 28,
    alignItems: "flex-start",
  },
  tableRowAlt: {
    backgroundColor: BRAND_MIX_LIGHT,
  },
  colQty: { width: "11%", textAlign: "center" },
  colDesc: { width: "47%" },
  colUnit: { width: "20%", textAlign: "right" },
  colTotal: {
    width: "22%",
    textAlign: "right",
    fontFamily: "Helvetica-Bold",
    color: BRAND_GLOW_DARK,
  },
  cellText: { fontSize: 9, lineHeight: 1.4, color: "#27272a" },
  totalBox: {
    alignSelf: "flex-end",
    width: 240,
    marginBottom: 16,
    padding: 14,
    backgroundColor: BRAND_UP_LIGHT,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#a8e8e2",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: BRAND_UP_DARK,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  totalValue: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    color: BRAND_GLOW_DARK,
  },
  sectionTitle: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: BRAND_GLOW_DARK,
    marginBottom: 5,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  materialsBox: {
    marginBottom: 12,
    padding: 10,
    backgroundColor: BRAND_GLOW_LIGHT,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#c8e4a8",
    borderLeftWidth: 3,
    borderLeftColor: BRAND_GLOW,
  },
  materialsText: {
    fontSize: 9,
    lineHeight: 1.5,
    color: "#3f3f46",
  },
  notesBox: {
    marginBottom: 12,
    padding: 10,
    backgroundColor: "#fafafa",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#e4e4e7",
  },
  notesText: {
    fontSize: 9,
    lineHeight: 1.5,
    color: "#52525b",
  },
  disclaimer: {
    marginBottom: 14,
    padding: 10,
    backgroundColor: BRAND_MIX_LIGHT,
    borderRadius: 6,
    borderLeftWidth: 4,
    borderLeftColor: BRAND_GLOW,
    borderWidth: 1,
    borderColor: BRAND_UP_LIGHT,
  },
  disclaimerText: {
    fontSize: 8,
    color: "#3f5f5c",
    lineHeight: 1.5,
  },
  thanks: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: BRAND_UP_DARK,
    marginBottom: 8,
  },
  footer: {
    position: "absolute",
    bottom: 24,
    left: 42,
    right: 42,
    textAlign: "center",
    fontSize: 7,
    color: "#71717a",
    lineHeight: 1.5,
    paddingTop: 10,
  },
  footerBrandLine: {
    marginBottom: 6,
  },
  footerBrand: {
    fontFamily: "Helvetica-Bold",
    fontSize: 8,
    marginBottom: 2,
  },
});

function BrandGradientBar({ height = 5 }: { height?: number }) {
  return (
    <Svg width={CONTENT_WIDTH} height={height} style={styles.accentBar}>
      <Defs>
        <LinearGradient id="brandGradient" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0%" stopColor={BRAND_GLOW} />
          <Stop offset="100%" stopColor={BRAND_UP} />
        </LinearGradient>
      </Defs>
      <Rect width={CONTENT_WIDTH} height={height} fill="url(#brandGradient)" rx={3} />
    </Svg>
  );
}

function TableHeaderGradient() {
  return (
    <Svg
      width={CONTENT_WIDTH}
      height={34}
      style={{ position: "absolute", top: 0, left: 0 }}
    >
      <Defs>
        <LinearGradient id="tableHeaderGrad" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0%" stopColor={BRAND_GLOW} />
          <Stop offset="100%" stopColor={BRAND_UP} />
        </LinearGradient>
      </Defs>
      <Rect width={CONTENT_WIDTH} height={34} fill="url(#tableHeaderGrad)" />
    </Svg>
  );
}

function formatDocumentDate(date: Date): string {
  return date.toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function DocumentHeader({ logoUrl }: { logoUrl?: string }) {
  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        {logoUrl ? (
          <View style={styles.logoWrap}>
            <Image src={logoUrl} style={styles.logo} />
          </View>
        ) : null}
        <View>
          <Text style={styles.brandTitle}>
            <Text style={styles.brandGlow}>Glow </Text>
            <Text style={styles.brandUp}>Up</Text>
          </Text>
          <Text style={styles.brandSub}>Entornos Inteligentes</Text>
        </View>
      </View>
      <View style={styles.contactBlock}>
        <Text style={styles.contactHighlight}>{contactInfo.phone}</Text>
        <Text>{contactInfo.email}</Text>
        <Text>{contactInfo.location}</Text>
      </View>
    </View>
  );
}

export function DocumentPdfContent({
  meta,
  lines,
}: {
  meta: DocumentPdfMeta;
  lines: DocumentPdfLine[];
}) {
  const isQuote = meta.documentType === "Cotización";
  const numberLabel = isQuote ? "Nº cotización" : "Nº factura";

  const billToDetails = [
    meta.billToDocument ? `CC / NIT: ${meta.billToDocument}` : null,
    meta.billToPhone ? `Tel: ${meta.billToPhone}` : null,
    meta.billToAddress || null,
  ].filter(Boolean);

  return (
    <>
      <BrandGradientBar />

      <DocumentHeader logoUrl={meta.logoUrl} />

      <View
        style={[
          styles.typeBanner,
          isQuote ? styles.typeBannerQuote : styles.typeBannerInvoice,
        ]}
      >
        <Text
          style={[
            styles.typeTitle,
            isQuote ? styles.typeTitleQuote : styles.typeTitleInvoice,
          ]}
        >
          {meta.documentType}
        </Text>
        <Text style={styles.typeSubtitle}>
          {isQuote
            ? "Documento estimado · Válida 15 días · No constituye factura"
            : "Documento de cobro · Glow Up Entornos Inteligentes"}
        </Text>
      </View>

      <View style={styles.metaRow}>
        <View style={styles.metaCard}>
          <Text style={styles.metaLabel}>Fecha</Text>
          <Text style={styles.metaValue}>{formatDocumentDate(meta.issuedAt)}</Text>
        </View>
        <View style={styles.metaCard}>
          <Text style={styles.metaLabel}>{numberLabel}</Text>
          <Text style={styles.metaValueAccent}>{meta.documentNumber}</Text>
        </View>
        <View style={styles.metaCard}>
          <Text style={styles.metaLabel}>Ingeniero</Text>
          <Text style={styles.metaValue}>{meta.engineer}</Text>
        </View>
      </View>

      <View style={styles.billToSection}>
        <Text style={styles.billToLabel}>Cliente</Text>
        <Text style={styles.billToName}>{meta.billToName}</Text>
        {billToDetails.map((line, i) => (
          <Text key={i} style={styles.billToDetail}>
            {line}
          </Text>
        ))}
      </View>

      <View style={styles.tableWrapper}>
        <View style={{ position: "relative" }}>
          <TableHeaderGradient />
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, styles.colQty]}>Cant.</Text>
            <Text style={[styles.tableHeaderCell, styles.colDesc]}>Descripción</Text>
            <Text style={[styles.tableHeaderCell, styles.colUnit]}>P. unitario</Text>
            <Text style={[styles.tableHeaderCell, styles.colTotal]}>Total</Text>
          </View>
        </View>

        {lines.map((line, index) => (
          <View
            key={`${line.description}-${index}`}
            style={[
              styles.tableRow,
              index % 2 === 1 ? styles.tableRowAlt : {},
            ]}
          >
            <Text style={[styles.cellText, styles.colQty]}>{line.quantity}</Text>
            <Text style={[styles.cellText, styles.colDesc]}>{line.description}</Text>
            <Text style={[styles.cellText, styles.colUnit]}>
              {line.unitPrice > 0 ? formatCOP(line.unitPrice) : "—"}
            </Text>
            <Text style={[styles.cellText, styles.colTotal]}>
              {line.total > 0 ? formatCOP(line.total) : "—"}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.totalBox}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{formatCOP(meta.grandTotal)}</Text>
        </View>
      </View>

      {meta.materials ? (
        <View style={styles.materialsBox}>
          <Text style={styles.sectionTitle}>Materiales requeridos</Text>
          <Text style={styles.materialsText}>{meta.materials}</Text>
        </View>
      ) : null}

      {meta.notes ? (
        <View style={styles.notesBox}>
          <Text style={styles.sectionTitle}>Notas</Text>
          {meta.notes.split("\n").map((paragraph, i) => (
            <Text key={i} style={[styles.notesText, { marginBottom: 3 }]}>
              {paragraph}
            </Text>
          ))}
        </View>
      ) : null}

      {isQuote ? (
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            Esta cotización es estimada. El valor final puede variar según evaluación en
            sitio, cableado, obra civil y condiciones técnicas del inmueble. Glow Up
            confirmará disponibilidad y tiempos de instalación al recibir esta solicitud.
          </Text>
        </View>
      ) : null}

      <Text style={styles.thanks}>Gracias por confiar en Glow Up.</Text>

      <View style={styles.footer} fixed>
        <View style={styles.footerBrandLine}>
          <BrandGradientBar height={2} />
        </View>
        <Text style={styles.footerBrand}>
          <Text style={{ color: BRAND_GLOW }}>Glow </Text>
          <Text style={{ color: BRAND_UP }}>Up</Text>
          <Text> Entornos Inteligentes</Text>
        </Text>
        <Text>
          {companyLegal.nit} · {companyLegal.registry}
          {"\n"}
          {companyLegal.copnia}
          {"\n"}
          {companyLegal.taxStatus} · {companyLegal.phone}
        </Text>
      </View>
    </>
  );
}