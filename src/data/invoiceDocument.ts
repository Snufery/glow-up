/** Textos y datos fijos del diseño Factura.pdf (sin cambios de maquetación). */
export const invoiceDocumentTemplate = {
  companyName: "GLOW UP ENTORNOS INTELIGENTES",
  nit: "901.796.812-2",
  location: "Popayán, Cauca, Colombia",
  whatsapp: "+57 315 886 2469",
  email: "facturacion@glowupentornos.com",
  documentTitle: "FACTURA ELECTRÓNICA",
  dianResolution: "Resolución DIAN No. 187640123456 del 15/01/2026",
  sectionEquipos: "EQUIPOS Y DISPOSITIVOS",
  sectionServicios: "SERVICIOS DE INSTALACIÓN Y CONFIGURACIÓN",
  paymentMethods:
    "• Transferencia bancaria    • Nequi / Daviplata / Bancolombia    • Efectivo (en oficina)",
  bankDetails:
    "Banco: Bancolombia  |  Tipo de cuenta: Ahorros  |  Número: 1234-5678-9012  |  Titular: Glow Up Entornos Inteligentes",
  qrNote:
    "Disponible al generar la factura electrónica (escanee para pagar rápidamente).",
  defaultTerms: [
    "Garantía: 12 meses en equipos (fabricante) + 6 meses en mano de obra de instalación.",
    "Entrega: El sistema fue instalado, configurado y probado satisfactoriamente el día de la emisión de esta factura.",
    "Factura Electrónica: Este documento cumple con los requisitos de la DIAN. El CUFE será generado al momento de la validación.",
    "Contacto: Para cualquier duda o soporte técnico: WhatsApp +57 315 886 2469 o email facturacion@glowupentornos.com",
  ],
  footer:
    "GLOW UP ENTORNOS INTELIGENTES | Popayán, Cauca | Página 1 | Gracias por confiar en nosotros",
} as const;