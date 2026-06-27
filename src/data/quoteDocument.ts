import { companyLegal } from "@/data/company";

/** Textos fijos del diseño cotizacion.pdf */
export const quoteDocumentTemplate = {
  title: "Cotización",
  companyLine1: "Glow Up Entornos",
  companyLine2: "Inteligentes",
  nit: companyLegal.nit,
  registry: companyLegal.registry,
  copnia: companyLegal.copnia,
  taxStatus: companyLegal.taxStatus,
  phone: companyLegal.phone,
  closing: "Gracias por su preferencia.",
} as const;