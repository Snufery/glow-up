import {
  Document,
  Page,
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
import type { QuoteLineItem } from "@/context/QuoteContext";
import {
  calcLineInstallation,
  calcLineSubtotal,
  calcQuoteTotals,
  formatCOP,
} from "@/lib/quote";
import { contactInfo } from "@/data/contact";
import type { QuoteCustomerInfo } from "@/lib/quoteCustomer";
import { formatPhoneDisplay } from "@/lib/quoteCustomer";

const BRAND_GLOW = "#7ab648";
const BRAND_GLOW_DARK = "#5e9a2f";
const BRAND_UP = "#2bbcb3";
const BRAND_UP_DARK = "#1f9a92";
const BRAND_GLOW_LIGHT = "#eef6e6";
const BRAND_UP_LIGHT = "#e6f7f5";
const BRAND_MIX_LIGHT = "#f0f9f4";

const CONTENT_WIDTH = 515;

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#18181b",
    backgroundColor: "#ffffff",
  },
  accentBar: {
    marginBottom: 22,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
    paddingBottom: 16,
  },
  logo: {
    width: 56,
    height: 56,
    objectFit: "contain",
  },
  brandTitle: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
  },
  brandGlow: {
    color: BRAND_GLOW,
  },
  brandUp: {
    color: BRAND_UP,
  },
  brandSub: {
    fontSize: 8,
    color: BRAND_UP_DARK,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    fontFamily: "Helvetica-Bold",
  },
  contactBlock: {
    textAlign: "right",
    fontSize: 8,
    color: "#52525b",
    lineHeight: 1.6,
  },
  contactHighlight: {
    color: BRAND_UP_DARK,
    fontFamily: "Helvetica-Bold",
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    padding: 12,
    backgroundColor: BRAND_MIX_LIGHT,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: BRAND_UP_LIGHT,
  },
  clientRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 22,
    padding: 12,
    backgroundColor: BRAND_GLOW_LIGHT,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#c8e4a8",
    borderLeftWidth: 4,
    borderLeftColor: BRAND_GLOW,
  },
  metaLabel: {
    fontSize: 7,
    color: BRAND_UP_DARK,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 3,
    fontFamily: "Helvetica-Bold",
  },
  metaValue: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#18181b",
  },
  metaValueAccent: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: BRAND_GLOW_DARK,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: BRAND_UP_DARK,
    marginBottom: 10,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: BRAND_GLOW,
  },
  tableWrapper: {
    borderRadius: 6,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: BRAND_UP_LIGHT,
  },
  tableHeader: {
    flexDirection: "row",
    paddingVertical: 9,
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
    paddingVertical: 9,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e8f0ec",
  },
  tableRowAlt: {
    backgroundColor: BRAND_MIX_LIGHT,
  },
  cellProduct: { width: "38%" },
  cellQty: { width: "8%", textAlign: "center" },
  cellUnit: { width: "16%", textAlign: "right" },
  cellInstall: { width: "16%", textAlign: "right" },
  cellSubtotal: {
    width: "22%",
    textAlign: "right",
    fontFamily: "Helvetica-Bold",
    color: BRAND_GLOW_DARK,
  },
  productName: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    marginBottom: 2,
    color: "#18181b",
  },
  productDetail: {
    fontSize: 7,
    color: BRAND_UP_DARK,
  },
  totalsBox: {
    marginTop: 16,
    alignSelf: "flex-end",
    width: 250,
    padding: 14,
    backgroundColor: BRAND_UP_LIGHT,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#a8e8e2",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
    fontSize: 9,
    color: "#3f5f5c",
  },
  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 2,
    borderTopColor: BRAND_UP,
  },
  grandTotalLabel: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#18181b",
  },
  grandTotalValue: {
    fontSize: 15,
    fontFamily: "Helvetica-Bold",
    color: BRAND_GLOW_DARK,
  },
  disclaimer: {
    marginTop: 24,
    padding: 12,
    backgroundColor: BRAND_MIX_LIGHT,
    borderRadius: 4,
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
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 7,
    color: "#71717a",
    paddingTop: 10,
  },
  footerBrand: {
    fontFamily: "Helvetica-Bold",
  },
});

function BrandGradientBar({
  height = 5,
  compact = false,
}: {
  height?: number;
  compact?: boolean;
}) {
  return (
    <Svg
      width={CONTENT_WIDTH}
      height={height}
      style={compact ? { marginBottom: 8 } : styles.accentBar}
    >
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
      height={32}
      style={{ position: "absolute", top: 0, left: 0 }}
    >
      <Defs>
        <LinearGradient id="tableHeaderGrad" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0%" stopColor={BRAND_GLOW} />
          <Stop offset="100%" stopColor={BRAND_UP} />
        </LinearGradient>
      </Defs>
      <Rect width={CONTENT_WIDTH} height={32} fill="url(#tableHeaderGrad)" />
    </Svg>
  );
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

interface QuotePDFDocumentProps {
  items: QuoteLineItem[];
  quoteRef: string;
  logoUrl: string;
  customer: QuoteCustomerInfo;
}

export default function QuotePDFDocument({
  items,
  quoteRef,
  logoUrl,
  customer,
}: QuotePDFDocumentProps) {
  const totals = calcQuoteTotals(items);
  const issuedAt = new Date();
  const validUntil = new Date(issuedAt);
  validUntil.setDate(validUntil.getDate() + 15);

  return (
    <Document title={`Cotizacion ${quoteRef} - Glow Up`}>
      <Page size="A4" style={styles.page}>
        <BrandGradientBar />

        <View style={styles.header}>
          <View style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
            <Image src={logoUrl} style={styles.logo} />
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

        <View style={styles.metaRow}>
          <View>
            <Text style={styles.metaLabel}>Documento</Text>
            <Text style={styles.metaValue}>COTIZACION ESTIMADA</Text>
          </View>
          <View>
            <Text style={styles.metaLabel}>Referencia</Text>
            <Text style={styles.metaValueAccent}>{quoteRef}</Text>
          </View>
          <View>
            <Text style={styles.metaLabel}>Fecha</Text>
            <Text style={styles.metaValue}>{formatDate(issuedAt)}</Text>
          </View>
          <View>
            <Text style={styles.metaLabel}>Valida hasta</Text>
            <Text style={styles.metaValue}>{formatDate(validUntil)}</Text>
          </View>
        </View>

        <View style={styles.clientRow}>
          <View>
            <Text style={styles.metaLabel}>Cliente</Text>
            <Text style={styles.metaValue}>{customer.name}</Text>
          </View>
          <View>
            <Text style={styles.metaLabel}>Celular</Text>
            <Text style={styles.metaValueAccent}>{formatPhoneDisplay(customer.phone)}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Detalle de productos y servicios</Text>

        <View style={styles.tableWrapper}>
          <View style={{ position: "relative" }}>
            <TableHeaderGradient />
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, styles.cellProduct]}>Producto</Text>
              <Text style={[styles.tableHeaderCell, styles.cellQty]}>Cant.</Text>
              <Text style={[styles.tableHeaderCell, styles.cellUnit]}>P. unit.</Text>
              <Text style={[styles.tableHeaderCell, styles.cellInstall]}>Instal.</Text>
              <Text style={[styles.tableHeaderCell, styles.cellSubtotal]}>Subtotal</Text>
            </View>
          </View>

          {items.map((item, index) => {
            const install = calcLineInstallation(item);
            const lineTotal = calcLineSubtotal(item) + install;
            const details = [
              item.channels ? `${item.channels} canal${item.channels > 1 ? "es" : ""}` : null,
              item.colorLabel,
            ]
              .filter(Boolean)
              .join(" · ");

            return (
              <View
                key={item.id}
                style={[styles.tableRow, index % 2 === 1 ? styles.tableRowAlt : {}]}
              >
                <View style={styles.cellProduct}>
                  <Text style={styles.productName}>{item.name}</Text>
                  {details ? <Text style={styles.productDetail}>{details}</Text> : null}
                </View>
                <Text style={styles.cellQty}>{item.quantity}</Text>
                <Text style={styles.cellUnit}>{formatCOP(item.unitPrice)}</Text>
                <Text style={styles.cellInstall}>
                  {install > 0 ? formatCOP(install) : "—"}
                </Text>
                <Text style={styles.cellSubtotal}>{formatCOP(lineTotal)}</Text>
              </View>
            );
          })}
        </View>

        <View style={styles.totalsBox}>
          <View style={styles.totalRow}>
            <Text>Subtotal productos</Text>
            <Text>{formatCOP(totals.productsSubtotal)}</Text>
          </View>
          {totals.installationSubtotal > 0 && (
            <View style={styles.totalRow}>
              <Text>Subtotal instalacion</Text>
              <Text>{formatCOP(totals.installationSubtotal)}</Text>
            </View>
          )}
          <View style={styles.grandTotalRow}>
            <Text style={styles.grandTotalLabel}>TOTAL ESTIMADO</Text>
            <Text style={styles.grandTotalValue}>{formatCOP(totals.grandTotal)}</Text>
          </View>
        </View>

        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            Esta cotizacion es estimada y no constituye una factura ni compromiso comercial.
            El valor final puede variar segun evaluacion en sitio, cableado, obra civil y
            condiciones tecnicas del inmueble.{" "}
            <Text style={styles.brandGlow}>Glow </Text>
            <Text style={styles.brandUp}>Up</Text> confirmara disponibilidad y tiempos
            de instalacion al recibir esta solicitud.
          </Text>
        </View>

        <View style={styles.footer}>
          <BrandGradientBar height={2} compact />
          <Text>
            <Text style={[styles.brandGlow, styles.footerBrand]}>Glow </Text>
            <Text style={[styles.brandUp, styles.footerBrand]}>Up</Text>
            <Text> Entornos Inteligentes · Popayan, Cauca, Colombia · {contactInfo.phone}</Text>
          </Text>
        </View>
      </Page>
    </Document>
  );
}