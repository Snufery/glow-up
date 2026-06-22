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
import type { InvoiceData } from "@/lib/invoice";
import {
  calcInvoiceSubtotal,
  calcInvoiceTax,
  calcInvoiceTotal,
} from "@/lib/invoice";
import { formatCOP } from "@/lib/quote";
import { contactInfo } from "@/data/contact";

const BRAND_GLOW = "#7ab648";
const BRAND_UP = "#2bbcb3";
const BRAND_UP_DARK = "#1f9a92";
const CONTENT_WIDTH = 515;

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: "Helvetica", color: "#18181b" },
  header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  logo: { width: 52, height: 52, objectFit: "contain" },
  brandGlow: { color: BRAND_GLOW, fontFamily: "Helvetica-Bold" },
  brandUp: { color: BRAND_UP, fontFamily: "Helvetica-Bold" },
  brandTitle: { fontSize: 16, fontFamily: "Helvetica-Bold" },
  brandSub: { fontSize: 8, color: BRAND_UP_DARK, letterSpacing: 1.2, textTransform: "uppercase" },
  metaBox: {
    padding: 12,
    backgroundColor: "#f0f9f4",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#c8e4a8",
    marginBottom: 14,
  },
  clientBox: {
    padding: 12,
    backgroundColor: "#e6f7f5",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#a8e8e2",
    marginBottom: 18,
  },
  label: {
    fontSize: 7,
    color: BRAND_UP_DARK,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 2,
    fontFamily: "Helvetica-Bold",
  },
  value: { fontSize: 10, fontFamily: "Helvetica-Bold", marginBottom: 6 },
  tableHeader: { flexDirection: "row", paddingVertical: 8, paddingHorizontal: 8 },
  headerCell: { color: "#fff", fontSize: 8, fontFamily: "Helvetica-Bold", textTransform: "uppercase" },
  row: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e8f0ec",
  },
  rowAlt: { backgroundColor: "#f8fcfa" },
  colDesc: { width: "46%" },
  colQty: { width: "10%", textAlign: "center" },
  colUnit: { width: "22%", textAlign: "right" },
  colTotal: { width: "22%", textAlign: "right", fontFamily: "Helvetica-Bold", color: BRAND_GLOW },
  totals: {
    marginTop: 14,
    alignSelf: "flex-end",
    width: 240,
    padding: 12,
    backgroundColor: "#e6f7f5",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#a8e8e2",
  },
  totalRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 5, fontSize: 9 },
  grandTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 2,
    borderTopColor: BRAND_UP,
  },
  notes: { marginTop: 18, fontSize: 8, color: "#52525b", lineHeight: 1.5 },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 7,
    color: "#71717a",
  },
});

function BrandBar() {
  return (
    <Svg width={CONTENT_WIDTH} height={4} style={{ marginBottom: 16 }}>
      <Defs>
        <LinearGradient id="invGrad" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0%" stopColor={BRAND_GLOW} />
          <Stop offset="100%" stopColor={BRAND_UP} />
        </LinearGradient>
      </Defs>
      <Rect width={CONTENT_WIDTH} height={4} fill="url(#invGrad)" rx={2} />
    </Svg>
  );
}

function TableHeaderBg() {
  return (
    <Svg width={CONTENT_WIDTH} height={30} style={{ position: "absolute", top: 0, left: 0 }}>
      <Defs>
        <LinearGradient id="invTable" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0%" stopColor={BRAND_GLOW} />
          <Stop offset="100%" stopColor={BRAND_UP} />
        </LinearGradient>
      </Defs>
      <Rect width={CONTENT_WIDTH} height={30} fill="url(#invTable)" />
    </Svg>
  );
}

export default function InvoicePDFDocument({
  invoice,
  logoUrl,
}: {
  invoice: InvoiceData;
  logoUrl: string;
}) {
  const subtotal = calcInvoiceSubtotal(invoice.items);
  const tax = calcInvoiceTax(subtotal, invoice.includeTax);
  const total = calcInvoiceTotal(invoice.items, invoice.includeTax);

  return (
    <Document title={`Factura ${invoice.invoiceNumber}`}>
      <Page size="A4" style={styles.page}>
        <BrandBar />

        <View style={styles.header}>
          <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
            <Image src={logoUrl} style={styles.logo} />
            <View>
              <Text style={styles.brandTitle}>
                <Text style={styles.brandGlow}>Glow </Text>
                <Text style={styles.brandUp}>Up</Text>
              </Text>
              <Text style={styles.brandSub}>Entornos Inteligentes</Text>
            </View>
          </View>
          <View style={{ textAlign: "right", fontSize: 8, color: "#52525b" }}>
            <Text>{contactInfo.phone}</Text>
            <Text>{contactInfo.email}</Text>
            <Text>{contactInfo.location}</Text>
          </View>
        </View>

        <View style={styles.metaBox}>
          <Text style={styles.label}>Factura de venta</Text>
          <Text style={{ fontSize: 14, fontFamily: "Helvetica-Bold", color: BRAND_UP_DARK }}>
            {invoice.invoiceNumber}
          </Text>
          <Text style={{ fontSize: 8, color: "#52525b", marginTop: 4 }}>
            Emision: {invoice.issuedAt} · Vencimiento: {invoice.dueAt}
          </Text>
        </View>

        <View style={styles.clientBox}>
          <Text style={styles.label}>Cliente</Text>
          <Text style={styles.value}>{invoice.customer.name}</Text>
          {invoice.customer.document ? (
            <Text style={{ fontSize: 8, marginBottom: 4 }}>Doc: {invoice.customer.document}</Text>
          ) : null}
          {invoice.customer.phone ? (
            <Text style={{ fontSize: 8, marginBottom: 4 }}>Tel: {invoice.customer.phone}</Text>
          ) : null}
          {invoice.customer.email ? (
            <Text style={{ fontSize: 8, marginBottom: 4 }}>Email: {invoice.customer.email}</Text>
          ) : null}
          {invoice.customer.address ? (
            <Text style={{ fontSize: 8 }}>Dir: {invoice.customer.address}</Text>
          ) : null}
        </View>

        <View style={{ borderRadius: 6, overflow: "hidden", borderWidth: 1, borderColor: "#d4f0eb" }}>
          <View style={{ position: "relative" }}>
            <TableHeaderBg />
            <View style={styles.tableHeader}>
              <Text style={[styles.headerCell, styles.colDesc]}>Descripcion</Text>
              <Text style={[styles.headerCell, styles.colQty]}>Cant.</Text>
              <Text style={[styles.headerCell, styles.colUnit]}>P. unit.</Text>
              <Text style={[styles.headerCell, styles.colTotal]}>Subtotal</Text>
            </View>
          </View>

          {invoice.items.map((item, index) => (
            <View key={item.id} style={[styles.row, index % 2 === 1 ? styles.rowAlt : {}]}>
              <Text style={styles.colDesc}>{item.description}</Text>
              <Text style={styles.colQty}>{item.quantity}</Text>
              <Text style={styles.colUnit}>{formatCOP(item.unitPrice)}</Text>
              <Text style={styles.colTotal}>{formatCOP(item.quantity * item.unitPrice)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.totals}>
          <View style={styles.totalRow}>
            <Text>Subtotal</Text>
            <Text>{formatCOP(subtotal)}</Text>
          </View>
          {invoice.includeTax && (
            <View style={styles.totalRow}>
              <Text>IVA 19%</Text>
              <Text>{formatCOP(tax)}</Text>
            </View>
          )}
          <View style={styles.grandTotal}>
            <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 11 }}>TOTAL</Text>
            <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 14, color: BRAND_GLOW }}>{formatCOP(total)}</Text>
          </View>
        </View>

        {invoice.notes ? (
          <Text style={styles.notes}>
            <Text style={{ fontFamily: "Helvetica-Bold" }}>Notas: </Text>
            {invoice.notes}
          </Text>
        ) : null}

        <Text style={styles.footer}>
          Glow Up Entornos Inteligentes · {contactInfo.phone}
        </Text>
      </Page>
    </Document>
  );
}