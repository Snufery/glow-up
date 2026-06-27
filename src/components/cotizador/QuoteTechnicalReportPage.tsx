import { Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { QuoteIntelligence } from "@/lib/quoteIntelligence";
import { companyLegal } from "@/data/company";
import { contactInfo } from "@/data/contact";
import { documentPdfStyles } from "@/lib/documentPdfShared";

const BRAND_GLOW = "#7ab648";
const BRAND_GLOW_DARK = "#5e9a2f";
const BRAND_UP = "#2bbcb3";
const BRAND_UP_DARK = "#1f9a92";
const BRAND_MIX_LIGHT = "#f0f9f4";
const BRAND_UP_LIGHT = "#e6f7f5";

const styles = StyleSheet.create({
  header: {
    marginBottom: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: BRAND_UP_LIGHT,
  },
  reportTitle: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: BRAND_GLOW_DARK,
    marginBottom: 4,
  },
  reportSubtitle: {
    fontSize: 8,
    color: "#52525b",
  },
  intro: {
    fontSize: 9,
    lineHeight: 1.55,
    color: "#3f3f46",
    marginBottom: 14,
  },
  section: {
    marginBottom: 12,
    padding: 10,
    backgroundColor: BRAND_MIX_LIGHT,
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: BRAND_GLOW,
  },
  sectionTitle: {
    fontSize: 9.5,
    fontFamily: "Helvetica-Bold",
    color: BRAND_UP_DARK,
    marginBottom: 5,
  },
  sectionBody: {
    fontSize: 8.5,
    lineHeight: 1.5,
    color: "#3f3f46",
    marginBottom: 4,
  },
  sectionBenefit: {
    fontSize: 8,
    lineHeight: 1.45,
    color: BRAND_GLOW_DARK,
    fontFamily: "Helvetica-Bold",
  },
  comparisonBox: {
    marginBottom: 12,
    padding: 10,
    backgroundColor: "#fafafa",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#e4e4e7",
  },
  comparisonTitle: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#27272a",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  comparisonItem: {
    marginBottom: 6,
  },
  comparisonAlt: {
    fontSize: 8.5,
    fontFamily: "Helvetica-Bold",
    color: BRAND_UP_DARK,
    marginBottom: 2,
  },
  comparisonDrawback: {
    fontSize: 8,
    lineHeight: 1.45,
    color: "#52525b",
  },
  conclusionBox: {
    marginTop: 4,
    marginBottom: 12,
    padding: 10,
    backgroundColor: BRAND_UP_LIGHT,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#a8e8e2",
  },
  conclusionTitle: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: BRAND_UP_DARK,
    marginBottom: 5,
    textTransform: "uppercase",
  },
  conclusionText: {
    fontSize: 8.5,
    lineHeight: 1.5,
    color: "#3f3f46",
    marginBottom: 4,
  },
  signature: {
    marginTop: 10,
    fontSize: 8.5,
    lineHeight: 1.5,
    color: "#3f3f46",
  },
  signatureBrand: {
    fontFamily: "Helvetica-Bold",
    color: BRAND_GLOW_DARK,
  },
  sources: {
    marginTop: 8,
    fontSize: 7,
    color: "#71717a",
    lineHeight: 1.4,
  },
});

interface QuoteTechnicalReportPageProps {
  intelligence: QuoteIntelligence;
}

export default function QuoteTechnicalReportPage({
  intelligence,
}: QuoteTechnicalReportPageProps) {
  return (
    <Page size="A4" style={documentPdfStyles.page} wrap>
      <View style={styles.header}>
        <Text style={styles.reportTitle}>{intelligence.technicalReportTitle}</Text>
        <Text style={styles.reportSubtitle}>
          Informe de justificación técnica · {companyLegal.name}
        </Text>
      </View>

      <Text style={styles.intro}>{intelligence.technicalIntro}</Text>

      {intelligence.technicalSections.map((section) => (
        <View key={section.number} style={styles.section} wrap={false}>
          <Text style={styles.sectionTitle}>
            {section.number}. {section.title}
          </Text>
          <Text style={styles.sectionBody}>{section.body}</Text>
          {section.benefit ? (
            <Text style={styles.sectionBenefit}>
              Beneficio clave: {section.benefit}
            </Text>
          ) : null}
        </View>
      ))}

      {intelligence.comparisons.length > 0 ? (
        <View style={styles.comparisonBox}>
          <Text style={styles.comparisonTitle}>Comparación con alternativas</Text>
          {intelligence.comparisons.map((item, index) => (
            <View key={index} style={styles.comparisonItem}>
              <Text style={styles.comparisonAlt}>{item.alternative}</Text>
              <Text style={styles.comparisonDrawback}>{item.drawbacks}</Text>
            </View>
          ))}
        </View>
      ) : null}

      <View style={styles.conclusionBox}>
        <Text style={styles.conclusionTitle}>Conclusión y recomendación</Text>
        <Text style={styles.conclusionText}>{intelligence.conclusion}</Text>
        <Text style={styles.conclusionText}>{intelligence.recommendation}</Text>
      </View>

      <Text style={styles.signature}>
        Atentamente,{"\n"}
        <Text style={styles.signatureBrand}>{companyLegal.name}</Text>
        {"\n"}
        Tu socio en Domótica y Seguridad Inteligente en Popayán{"\n"}
        WhatsApp: {contactInfo.phone} · {contactInfo.email}
      </Text>

      {intelligence.sources?.length ? (
        <Text style={styles.sources}>
          Fuentes consultadas: {intelligence.sources.join(" · ")}
        </Text>
      ) : null}
    </Page>
  );
}