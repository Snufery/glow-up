import type { QuoteLineItem } from "@/context/QuoteContext";
import { companyLegal } from "@/data/company";
import { quoteDocumentTemplate } from "@/data/quoteDocument";
import {
  formatQuoteDisplayNumber,
  getQuoteGrandTotal,
  quoteItemsToPdfLines,
} from "@/lib/quoteToPdfLines";
import type { QuoteCustomerInfo, QuoteDocumentExtras } from "@/lib/quoteCustomer";
import { formatPhoneDisplay } from "@/lib/quoteCustomer";
import { readTemplateAssetDataUrl } from "@/lib/renderHtmlPdf";

const T = quoteDocumentTemplate;
const GREEN = "#4c7a34";
const TEXT = "#454545";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatQuoteDate(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(date.getDate())}-${pad(date.getMonth() + 1)}-${date.getFullYear()}`;
}

function formatMoney(amount: number): string {
  const rounded = Math.round(amount);
  const [whole, frac = "00"] = rounded.toFixed(2).split(".");
  const withCommas = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `$${withCommas}.${frac}`;
}

function renderMaterialsBlock(materials?: string): string {
  if (!materials?.trim()) return "";
  const lines = materials
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  if (!lines.length) return "";

  return `<div class="materials-block">
    <div class="materials-title">MATERIALES REQUERIDOS</div>
    ${lines.map((line) => `<div class="materials-line">${escapeHtml(line)}</div>`).join("")}
  </div>`;
}

function renderNotesBlock(notes?: string): string {
  if (!notes?.trim()) return "";
  const lines = notes
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  if (!lines.length) return "";
  return lines.map((line) => `<div class="note-line">${escapeHtml(line)}</div>`).join("");
}

export interface QuoteCotizacionHtmlInput {
  items: QuoteLineItem[];
  quoteRef: string;
  quoteNumber?: number | null;
  customer: QuoteCustomerInfo;
  engineer?: string;
  materials?: string;
  notes?: string;
  extras?: QuoteDocumentExtras;
  issuedAt?: Date;
}

export function buildQuoteCotizacionHtml(input: QuoteCotizacionHtmlInput): string {
  const issuedAt = input.issuedAt ?? new Date();
  const engineer = escapeHtml(input.engineer?.trim() || companyLegal.defaultEngineer);
  const quoteNumber = escapeHtml(
    formatQuoteDisplayNumber(input.quoteNumber ?? null, input.quoteRef)
  );
  const customerName = escapeHtml(input.customer.name.trim().toUpperCase());
  const customerAddress = escapeHtml(input.customer.address?.trim() || "");
  const grandTotal = getQuoteGrandTotal(input.items);
  const lines = quoteItemsToPdfLines(input.items, input.extras?.intelligence);

  const topBorder = readTemplateAssetDataUrl("cotizacion-top.jpg", "image/jpeg");
  const bottomBorder = readTemplateAssetDataUrl("cotizacion-bottom.jpg", "image/jpeg");
  const logo = readTemplateAssetDataUrl("cotizacion-logo.png", "image/png");

  const itemRows = lines
    .map((line) => {
      return `<tr class="item-row">
        <td class="col-qty">${line.quantity}</td>
        <td class="col-desc">${escapeHtml(line.description)}</td>
        <td class="col-unit">${formatMoney(line.unitPrice)}</td>
        <td class="col-total">${formatMoney(line.total)}</td>
      </tr>`;
    })
    .join("");

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <style>
    @page { size: A4; margin: 0; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      width: 595pt;
      min-height: 841pt;
      font-family: Helvetica, Arial, sans-serif;
      color: ${TEXT};
      background: #ffffff;
      position: relative;
    }
    .top-border {
      position: absolute;
      top: 0;
      left: 0;
      width: 595pt;
      height: 150pt;
      object-fit: cover;
      z-index: 0;
    }
    .bottom-border {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 595pt;
      height: 152pt;
      object-fit: cover;
      z-index: 0;
    }
    .content {
      position: relative;
      z-index: 1;
      padding: 0 61pt 160pt;
    }
    .header-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-top: 111pt;
    }
    .title {
      font-size: 31pt;
      font-weight: bold;
      color: ${TEXT};
      line-height: 1;
    }
    .company-block {
      width: 167pt;
      text-align: left;
      font-size: 10.2pt;
      line-height: 1.35;
      margin-top: -83pt;
      margin-right: 0;
      white-space: nowrap;
    }
    .company-name {
      font-size: 14.6pt;
      font-weight: bold;
      color: ${GREEN};
      line-height: 1.2;
    }
    .logo {
      position: absolute;
      top: 30pt;
      right: 181pt;
      width: 72pt;
      height: 72pt;
      object-fit: contain;
    }
    .meta-block {
      margin-top: 18pt;
      font-size: 10pt;
      line-height: 1.45;
    }
    .meta-line {
      display: flex;
      gap: 42pt;
      margin-bottom: 2pt;
    }
    .meta-label {
      color: ${GREEN};
      font-weight: bold;
      min-width: 74pt;
    }
    .meta-value {
      color: ${TEXT};
    }
    .bill-block {
      margin-top: 22pt;
      font-size: 10pt;
      line-height: 1.45;
    }
    .bill-label {
      color: ${GREEN};
      font-weight: bold;
      margin-bottom: 4pt;
    }
    .bill-name {
      font-size: 10.2pt;
      text-transform: uppercase;
    }
    .bill-address {
      font-size: 10.2pt;
    }
    .items-table {
      width: 473pt;
      border-collapse: collapse;
      margin-top: 36pt;
      table-layout: fixed;
    }
    .items-table thead th {
      background: ${GREEN};
      color: #ffffff;
      font-weight: bold;
      font-size: 9.9pt;
      padding: 8pt 6pt;
      text-align: left;
      border: none;
    }
    .items-table tbody td {
      font-size: 10.2pt;
      padding: 10pt 6pt 8pt;
      vertical-align: top;
      border-bottom: 0.5pt solid #d9d9d9;
    }
    .col-qty { width: 68pt; text-align: center; }
    .col-desc { width: 216pt; }
    .col-unit { width: 114pt; text-align: right; }
    .col-total { width: 75pt; text-align: right; }
    .total-row {
      margin-top: 8pt;
      display: flex;
      justify-content: flex-end;
      align-items: baseline;
      gap: 8pt;
      font-size: 11.2pt;
      font-weight: bold;
      padding-right: 6pt;
    }
    .materials-block {
      margin-top: 18pt;
      font-size: 9.3pt;
      line-height: 1.45;
    }
    .materials-title {
      font-weight: normal;
      margin-bottom: 8pt;
    }
    .materials-line {
      margin-bottom: 2pt;
    }
    .note-line {
      margin-top: 8pt;
      font-size: 9.3pt;
      line-height: 1.45;
    }
    .closing {
      margin-top: 18pt;
      text-align: center;
      font-size: 9.3pt;
    }
  </style>
</head>
<body>
  <img class="top-border" src="${topBorder}" alt="" />
  <img class="bottom-border" src="${bottomBorder}" alt="" />
  <img class="logo" src="${logo}" alt="" />

  <div class="content">
    <div class="header-row">
      <div class="title">${T.title}</div>
      <div class="company-block">
        <div class="company-name">${T.companyLine1}<br />${T.companyLine2}</div>
        <div>${T.nit}</div>
        <div>${T.registry}</div>
        <div>${T.copnia}</div>
        <div>${T.taxStatus}</div>
        <div>${T.phone}</div>
      </div>
    </div>

    <div class="meta-block">
      <div class="meta-line">
        <span class="meta-label">Fecha:</span>
        <span class="meta-value">${formatQuoteDate(issuedAt)}</span>
      </div>
      <div class="meta-line">
        <span class="meta-label">Nº de<br />cotización:</span>
        <span class="meta-value">${quoteNumber}</span>
      </div>
      <div class="meta-line">
        <span class="meta-label">Ingeniero:</span>
        <span class="meta-value">${engineer}</span>
      </div>
    </div>

    <div class="bill-block">
      <div class="bill-label">Facturar a</div>
      <div class="bill-name">${customerName}</div>
      ${customerAddress ? `<div class="bill-address">${customerAddress}</div>` : ""}
    </div>

    <table class="items-table">
      <thead>
        <tr>
          <th class="col-qty">Cantidad</th>
          <th class="col-desc">Descripción</th>
          <th class="col-unit">Precio unitario</th>
          <th class="col-total">Total</th>
        </tr>
      </thead>
      <tbody>
        ${itemRows}
      </tbody>
    </table>

    <div class="total-row">
      <span>Total</span>
      <span>${formatMoney(grandTotal)}</span>
    </div>

    ${renderMaterialsBlock(input.materials)}
    ${renderNotesBlock(input.notes)}
    <div class="closing">${T.closing}</div>
  </div>
</body>
</html>`;
}