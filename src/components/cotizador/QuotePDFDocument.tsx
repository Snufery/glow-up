import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";
import type { QuoteLineItem } from "@/context/QuoteContext";
import {
  calcLineInstallation,
  calcLineSubtotal,
  calcQuoteTotals,
  formatCOP,
} from "@/lib/quote";
import { contactInfo } from "@/data/contact";

const BRAND_GLOW = "#7ab648";
const BRAND_UP = "#2bbcb3";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#18181b",
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 28,
    paddingBottom: 18,
    borderBottomWidth: 2,
    borderBottomColor: BRAND_UP,
  },
  logo: {
    width: 52,
    height: 52,
    objectFit: "contain",
  },
  brandTitle: {
    fontSize: 16,
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
    color: "#71717a",
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  contactBlock: {
    textAlign: "right",
    fontSize: 8,
    color: "#52525b",
    lineHeight: 1.5,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 22,
    padding: 12,
    backgroundColor: "#f4f4f5",
    borderRadius: 6,
  },
  metaLabel: {
    fontSize: 7,
    color: "#71717a",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 3,
  },
  metaValue: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#18181b",
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: BRAND_UP,
    marginBottom: 10,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: BRAND_UP,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
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
    borderBottomColor: "#e4e4e7",
  },
  tableRowAlt: {
    backgroundColor: "#fafafa",
  },
  cellProduct: { width: "38%" },
  cellQty: { width: "8%", textAlign: "center" },
  cellUnit: { width: "16%", textAlign: "right" },
  cellInstall: { width: "16%", textAlign: "right" },
  cellSubtotal: { width: "22%", textAlign: "right", fontFamily: "Helvetica-Bold" },
  productName: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    marginBottom: 2,
  },
  productDetail: {
    fontSize: 7,
    color: "#71717a",
  },
  totalsBox: {
    marginTop: 16,
    alignSelf: "flex-end",
    width: 240,
    padding: 14,
    backgroundColor: "#f4f4f5",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#e4e4e7",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
    fontSize: 9,
    color: "#52525b",
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
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: BRAND_UP,
  },
  disclaimer: {
    marginTop: 24,
    padding: 12,
    backgroundColor: "#f0fdf9",
    borderRadius: 4,
    borderLeftWidth: 3,
    borderLeftColor: BRAND_GLOW,
  },
  disclaimerText: {
    fontSize: 8,
    color: "#52525b",
    lineHeight: 1.5,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 7,
    color: "#a1a1aa",
    borderTopWidth: 1,
    borderTopColor: "#e4e4e7",
    paddingTop: 10,
  },
});

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
}

export default function QuotePDFDocument({
  items,
  quoteRef,
  logoUrl,
}: QuotePDFDocumentProps) {
  const totals = calcQuoteTotals(items);
  const issuedAt = new Date();
  const validUntil = new Date(issuedAt);
  validUntil.setDate(validUntil.getDate() + 15);

  return (
    <Document title={`Cotizacion ${quoteRef} - Glow Up`}>
      <Page size="A4" style={styles.page}>
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
            <Text>{contactInfo.phone}</Text>
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
            <Text style={styles.metaValue}>{quoteRef}</Text>
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

        <Text style={styles.sectionTitle}>Detalle de productos y servicios</Text>

        <View>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, styles.cellProduct]}>Producto</Text>
            <Text style={[styles.tableHeaderCell, styles.cellQty]}>Cant.</Text>
            <Text style={[styles.tableHeaderCell, styles.cellUnit]}>P. unit.</Text>
            <Text style={[styles.tableHeaderCell, styles.cellInstall]}>Instal.</Text>
            <Text style={[styles.tableHeaderCell, styles.cellSubtotal]}>Subtotal</Text>
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
            condiciones tecnicas del inmueble. Glow Up confirmara disponibilidad y tiempos
            de instalacion al recibir esta solicitud.
          </Text>
        </View>

        <Text style={styles.footer}>
          Glow Up Entornos Inteligentes · Popayan, Cauca, Colombia · {contactInfo.phone}
        </Text>
      </Page>
    </Document>
  );
}