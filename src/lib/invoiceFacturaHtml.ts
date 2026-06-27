import type { InvoiceData, InvoiceLineItem } from "@/lib/invoice";
import { calcInvoiceTotal } from "@/lib/invoice";
import { companyLegal } from "@/data/company";
import { invoiceDocumentTemplate } from "@/data/invoiceDocument";

const T = invoiceDocumentTemplate;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatInvoiceDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-");
  if (!year || !month || !day) return isoDate;
  return `${day.padStart(2, "0")}/${month.padStart(2, "0")}/${year}`;
}

function formatMoney(amount: number): string {
  return `$${Math.round(amount).toLocaleString("en-US")}`;
}

function renderTermLine(term: string): string {
  const colonIndex = term.indexOf(":");
  if (colonIndex <= 0) {
    return `<div class="term-line"><span class="term-bullet">•</span><span>${escapeHtml(term)}</span></div>`;
  }
  const label = term.slice(0, colonIndex + 1);
  const body = term.slice(colonIndex + 1).trim();
  return `<div class="term-line"><span class="term-bullet">•</span><span><strong>${escapeHtml(label)}</strong> ${escapeHtml(body)}</span></div>`;
}

function renderItemRows(items: InvoiceLineItem[]): string {
  return items
    .map((item) => {
      const total = item.quantity * item.unitPrice;
      return `<tr class="item-row">
        <td class="col-desc">${escapeHtml(item.description)}</td>
        <td class="col-qty">${item.quantity}</td>
        <td class="col-unit">${formatMoney(item.unitPrice)}</td>
        <td class="col-total">${formatMoney(total)}</td>
      </tr>`;
    })
    .join("");
}

export function buildInvoiceFacturaHtml(invoice: InvoiceData): string {
  const total = calcInvoiceTotal(invoice.items, invoice.includeTax);
  const equipos = invoice.items.filter((item) => item.section !== "servicios");
  const servicios = invoice.items.filter((item) => item.section === "servicios");
  const engineer = escapeHtml(invoice.engineer?.trim() || companyLegal.defaultEngineer);
  const projectTitle = escapeHtml(invoice.projectTitle?.trim() || "Proyecto Glow Up");
  const quoteReference = escapeHtml(invoice.quoteReference?.trim() || "—");
  const customerName = escapeHtml(invoice.customer.name);

  const terms: string[] = [...T.defaultTerms];
  if (invoice.notes?.trim()) {
    terms.push(invoice.notes.trim());
  }

  const equiposBlock =
    equipos.length > 0
      ? `<tr class="category-row"><td colspan="4">${T.sectionEquipos}</td></tr>${renderItemRows(equipos)}`
      : "";

  const serviciosBlock =
    servicios.length > 0
      ? `<tr class="category-row"><td colspan="4">${T.sectionServicios}</td></tr>${renderItemRows(servicios)}`
      : "";

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <style>
    @page { size: letter; margin: 0; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      width: 612pt;
      min-height: 792pt;
      font-family: Helvetica, Arial, sans-serif;
      font-size: 8pt;
      color: #333333;
      background: #ffffff;
      padding: 36pt 36pt 40pt;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 6pt;
    }
    .header-left { width: 58%; line-height: 1.35; }
    .header-right { width: 40%; text-align: right; line-height: 1.35; }
    .company-name { font-weight: bold; font-size: 8pt; }
    .doc-title { font-weight: bold; font-size: 8pt; color: #1a5f2a; }
    .doc-resolution { font-weight: bold; font-size: 8pt; color: #1a5f2a; }
    .header-rule {
      height: 1pt;
      background: #1a5f2a;
      margin: 6pt 13.2pt 8pt;
    }
    .meta-table {
      width: 540pt;
      border-collapse: collapse;
      border: 1pt solid #808080;
      background: #f5f5f5;
      margin-bottom: 12pt;
      table-layout: fixed;
    }
    .meta-table td {
      border: 1pt solid #d3d3d3;
      padding: 3pt 6pt;
      vertical-align: top;
      font-size: 8pt;
      line-height: 1.35;
    }
    .meta-table .col-a { width: 165.6pt; }
    .meta-table .col-b { width: 230.4pt; }
    .meta-table .col-c { width: 144pt; }
    .meta-table strong { font-weight: bold; }
    .banner {
      background: #1a5f2a;
      color: #ffffff;
      font-weight: bold;
      font-size: 9pt;
      padding: 3pt 8pt;
      margin: 0 17.2pt;
      line-height: 1.2;
    }
    .detail-table {
      width: 532.8pt;
      border-collapse: collapse;
      border: 1pt solid #1a5f2a;
      margin: 4pt 3.6pt 12pt;
      table-layout: fixed;
    }
    .detail-table th {
      background: #1a5f2a;
      color: #ffffff;
      font-weight: bold;
      font-size: 8pt;
      padding: 6pt 4pt;
      border: 1pt solid #1a5f2a;
      text-align: left;
    }
    .detail-table td {
      border-bottom: 1pt solid #d3d3d3;
      border-right: 1pt solid #d3d3d3;
      padding: 5pt 4pt;
      font-size: 8pt;
      vertical-align: top;
      line-height: 1.35;
    }
    .detail-table td:last-child,
    .detail-table th:last-child { border-right: none; }
    .col-desc { width: 302.4pt; }
    .col-qty { width: 43.2pt; text-align: center; }
    .col-unit { width: 93.6pt; text-align: right; }
    .col-total { width: 93.6pt; text-align: right; }
    .category-row td {
      background: #e8f5e9;
      color: #1a5f2a;
      font-weight: bold;
      border-bottom: 1pt solid #d3d3d3;
    }
    .item-row td { background: #ffffff; }
    .total-row td {
      border-bottom: none;
      border-right: none;
      padding: 0;
    }
    .total-cell {
      background: #f5f5f5;
      border-top: 1pt solid #1a5f2a;
      padding: 6pt 8pt;
      text-align: right;
      font-weight: bold;
      color: #1a5f2a;
      font-size: 8pt;
    }
    .total-label { margin-right: 12pt; }
    .payment-block, .terms-block { margin-bottom: 12pt; }
    .payment-body, .terms-body {
      padding: 8pt 17.2pt 4pt;
      font-size: 7.5pt;
      line-height: 1.45;
    }
    .payment-body p { margin-bottom: 6pt; }
    .payment-body strong { font-weight: bold; }
    .term-line {
      display: flex;
      gap: 4pt;
      margin-bottom: 3pt;
    }
    .term-bullet { width: 8pt; flex-shrink: 0; }
    .footer-rule {
      height: 1pt;
      background: #1a5f2a;
      margin: 10pt 13.2pt 8pt;
    }
    .footer {
      text-align: center;
      font-size: 7pt;
      font-style: italic;
      color: #333333;
      line-height: 1.4;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="header-left">
      <div class="company-name">${T.companyName}</div>
      <div>NIT: ${T.nit} | ${T.location}</div>
      <div>WhatsApp: ${T.whatsapp} | ${T.email}</div>
    </div>
    <div class="header-right">
      <div class="doc-title">${T.documentTitle}</div>
      <div class="doc-resolution">${T.dianResolution}</div>
    </div>
  </div>

  <div class="header-rule"></div>

  <table class="meta-table">
    <tr>
      <td class="col-a"><strong>Factura No:</strong> ${escapeHtml(invoice.invoiceNumber)}</td>
      <td class="col-b"><strong>Fecha Emisión:</strong> ${formatInvoiceDate(invoice.issuedAt)}</td>
      <td class="col-c"><strong>Vencimiento:</strong> ${formatInvoiceDate(invoice.dueAt)}</td>
    </tr>
    <tr>
      <td class="col-a"><strong>Cliente:</strong> ${customerName}</td>
      <td class="col-b"><strong>Ingeniero a cargo:</strong> ${engineer}</td>
      <td class="col-c"></td>
    </tr>
    <tr>
      <td class="col-a"><strong>Referencia Cotización:</strong> ${quoteReference}</td>
      <td class="col-b" colspan="2"><strong>Proyecto:</strong> ${projectTitle}</td>
    </tr>
  </table>

  <div class="banner">DETALLE DE LA FACTURA</div>

  <table class="detail-table">
    <thead>
      <tr>
        <th class="col-desc">DESCRIPCIÓN</th>
        <th class="col-qty">CANT.</th>
        <th class="col-unit">PRECIO UNIT.</th>
        <th class="col-total">TOTAL</th>
      </tr>
    </thead>
    <tbody>
      ${equiposBlock}
      ${serviciosBlock}
      <tr class="total-row">
        <td colspan="2"></td>
        <td colspan="2" class="total-cell">
          <span class="total-label">TOTAL</span>
          <span>${formatMoney(total)} COP</span>
        </td>
      </tr>
    </tbody>
  </table>

  <div class="payment-block">
    <div class="banner">INFORMACIÓN DE PAGO</div>
    <div class="payment-body">
      <p><strong>Métodos de pago aceptados:</strong></p>
      <p>• Transferencia bancaria</p>
      <p>• Nequi / Daviplata / Bancolombia</p>
      <p>• Efectivo (en oficina)</p>
      <p><strong>Datos bancarios:</strong><br />${T.bankDetails}</p>
      <p><strong>QR de pago:</strong> ${T.qrNote}</p>
    </div>
  </div>

  <div class="terms-block">
    <div class="banner">NOTAS Y TÉRMINOS</div>
    <div class="terms-body">
      ${terms.map(renderTermLine).join("")}
    </div>
  </div>

  <div class="footer-rule"></div>
  <div class="footer">${T.footer}</div>
</body>
</html>`;
}