import { ensureSchema, getSql, isDatabaseConfigured } from "@/lib/db/client";
import type { SaveQuoteInput, StoredQuote } from "@/lib/db/types";

interface QuoteRow {
  id: string;
  quote_ref: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string | null;
  engineer: string | null;
  materials: string | null;
  notes: string | null;
  items: unknown;
  products_subtotal: number;
  installation_subtotal: number;
  grand_total: number;
  item_count: number;
  source: string;
  pdf_filename: string | null;
  converted_to_invoice: boolean | null;
  intelligence_json: unknown;
  include_iva: boolean | null;
  created_at: string | Date;
}

function mapQuoteRow(row: QuoteRow): StoredQuote {
  return {
    id: row.id,
    quoteRef: row.quote_ref,
    customerName: row.customer_name,
    customerPhone: row.customer_phone,
    customerAddress: row.customer_address ?? "",
    engineer: row.engineer ?? "",
    materials: row.materials ?? "",
    notes: row.notes ?? "",
    items: row.items as StoredQuote["items"],
    productsSubtotal: row.products_subtotal,
    installationSubtotal: row.installation_subtotal,
    grandTotal: row.grand_total,
    itemCount: row.item_count,
    source: row.source === "admin" ? "admin" : "public",
    pdfFilename: row.pdf_filename,
    convertedToInvoice: Boolean(row.converted_to_invoice),
    intelligence: (row.intelligence_json as StoredQuote["intelligence"]) ?? null,
    includeIva: Boolean(row.include_iva),
    createdAt: new Date(row.created_at).toISOString(),
  };
}

export async function saveQuote(input: SaveQuoteInput): Promise<StoredQuote | null> {
  if (!isDatabaseConfigured()) return null;

  const sql = getSql();
  if (!sql) return null;

  try {
    await ensureSchema();

    const rows = await sql`
      INSERT INTO quotes (
        quote_ref,
        customer_name,
        customer_phone,
        customer_address,
        engineer,
        materials,
        notes,
        items,
        products_subtotal,
        installation_subtotal,
        grand_total,
        item_count,
        source,
        pdf_filename,
        intelligence_json,
        include_iva
      ) VALUES (
        ${input.quoteRef},
        ${input.customerName},
        ${input.customerPhone},
        ${input.customerAddress ?? ""},
        ${input.engineer ?? ""},
        ${input.materials ?? ""},
        ${input.notes ?? ""},
        ${JSON.stringify(input.items)},
        ${input.productsSubtotal},
        ${input.installationSubtotal},
        ${input.grandTotal},
        ${input.itemCount},
        ${input.source ?? "public"},
        ${input.pdfFilename ?? null},
        ${input.intelligence ? JSON.stringify(input.intelligence) : null},
        ${Boolean(input.includeIva)}
      )
      ON CONFLICT (quote_ref) DO UPDATE SET
        customer_name = EXCLUDED.customer_name,
        customer_phone = EXCLUDED.customer_phone,
        customer_address = EXCLUDED.customer_address,
        engineer = EXCLUDED.engineer,
        materials = EXCLUDED.materials,
        notes = EXCLUDED.notes,
        items = EXCLUDED.items,
        products_subtotal = EXCLUDED.products_subtotal,
        installation_subtotal = EXCLUDED.installation_subtotal,
        grand_total = EXCLUDED.grand_total,
        item_count = EXCLUDED.item_count,
        source = EXCLUDED.source,
        pdf_filename = COALESCE(EXCLUDED.pdf_filename, quotes.pdf_filename),
        intelligence_json = COALESCE(EXCLUDED.intelligence_json, quotes.intelligence_json),
        include_iva = EXCLUDED.include_iva
      RETURNING *
    `;

    const row = rows[0] as QuoteRow | undefined;
    return row ? mapQuoteRow(row) : null;
  } catch (error) {
    console.error("Error guardando cotizacion:", error);
    return null;
  }
}

export async function listQuotes(limit = 50, offset = 0): Promise<StoredQuote[]> {
  if (!isDatabaseConfigured()) return [];

  const sql = getSql();
  if (!sql) return [];

  try {
    await ensureSchema();

    const safeLimit = Math.min(100, Math.max(1, limit));
    const safeOffset = Math.max(0, offset);

    const rows = await sql`
      SELECT *
      FROM quotes
      ORDER BY created_at DESC
      LIMIT ${safeLimit}
      OFFSET ${safeOffset}
    `;

    return (rows as QuoteRow[]).map(mapQuoteRow);
  } catch (error) {
    console.error("Error listando cotizaciones:", error);
    return [];
  }
}

export async function getQuoteById(id: string): Promise<StoredQuote | null> {
  if (!isDatabaseConfigured()) return null;

  const sql = getSql();
  if (!sql) return null;

  try {
    await ensureSchema();

    const rows = await sql`
      SELECT *
      FROM quotes
      WHERE id = ${id}
      LIMIT 1
    `;

    const row = rows[0] as QuoteRow | undefined;
    return row ? mapQuoteRow(row) : null;
  } catch (error) {
    console.error("Error obteniendo cotizacion:", error);
    return null;
  }
}

export async function markQuoteConverted(id: string): Promise<void> {
  if (!isDatabaseConfigured()) return;

  const sql = getSql();
  if (!sql) return;

  try {
    await ensureSchema();
    await sql`
      UPDATE quotes
      SET converted_to_invoice = TRUE
      WHERE id = ${id}
    `;
  } catch (error) {
    console.error("Error marcando cotizacion convertida:", error);
  }
}