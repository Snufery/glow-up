import type { QuoteLineItem } from "@/context/QuoteContext";
import type { QuoteCustomerInfo } from "@/lib/quoteCustomer";
import { formatPhoneDisplay } from "@/lib/quoteCustomer";

export function formatCOP(amount: number): string {
  return `$${amount.toLocaleString("es-CO")}`;
}

export function lineKey(
  item: Pick<QuoteLineItem, "productId" | "channels" | "colorId" | "roomId">
): string {
  return `${item.productId}:${item.channels ?? 0}:${item.colorId ?? ""}:${item.roomId ?? ""}`;
}

export function calcLineSubtotal(item: QuoteLineItem): number {
  return item.unitPrice * item.quantity;
}

export function calcLineInstallation(item: QuoteLineItem): number {
  if (!item.includeInstallation || item.installationPrice === null) return 0;
  return item.installationPrice * item.quantity;
}

export function calcQuoteTotals(items: QuoteLineItem[]) {
  const productsSubtotal = items.reduce((sum, i) => sum + calcLineSubtotal(i), 0);
  const installationSubtotal = items.reduce((sum, i) => sum + calcLineInstallation(i), 0);
  return {
    productsSubtotal,
    installationSubtotal,
    grandTotal: productsSubtotal + installationSubtotal,
    itemCount: items.reduce((sum, i) => sum + i.quantity, 0),
  };
}

export function buildWhatsAppMessage(
  items: QuoteLineItem[],
  quoteRef?: string,
  customer?: QuoteCustomerInfo
): string {
  const { productsSubtotal, installationSubtotal, grandTotal } = calcQuoteTotals(items);

  let msg = customer
    ? `Hola Glow Up! Soy ${customer.name}.\nCelular: ${formatPhoneDisplay(customer.phone)}\n\nQuiero una cotizacion estimada:`
    : "Hola Glow Up! Quiero una cotizacion estimada:";
  if (quoteRef) msg += `\nRef: ${quoteRef}`;
  msg += "\n\nPRODUCTOS:\n";

  items.forEach((item) => {
    let line = `• ${item.quantity}x ${item.name}`;
    if (item.channels) line += ` (${item.channels} canal${item.channels > 1 ? "es" : ""})`;
    if (item.colorLabel) line += ` - ${item.colorLabel}`;
    line += ` — ${formatCOP(calcLineSubtotal(item))}`;
    if (item.includeInstallation && item.installationPrice) {
      line += ` + Instalacion ${formatCOP(calcLineInstallation(item))}`;
    }
    msg += line + "\n";
  });

  msg += `\nSubtotal productos: ${formatCOP(productsSubtotal)}`;
  if (installationSubtotal > 0) {
    msg += `\nSubtotal instalacion: ${formatCOP(installationSubtotal)}`;
  }
  const rangeLow = Math.round(grandTotal * 0.92);
  const rangeHigh = Math.round(grandTotal * 1.18);
  if (rangeLow !== rangeHigh) {
    msg += `\nRANGO ESTIMADO: ${formatCOP(rangeLow)} – ${formatCOP(rangeHigh)}`;
    msg += `\nReferencia central: ${formatCOP(grandTotal)}`;
  } else {
    msg += `\nTOTAL ESTIMADO: ${formatCOP(grandTotal)}`;
  }
  msg += "\n\n¿Pueden confirmar disponibilidad y agendar visita?";

  return msg;
}