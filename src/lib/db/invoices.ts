import { ensureSchema, getSql, isDatabaseConfigured } from "@/lib/db/client";
import type { SaveInvoiceInput, StoredInvoice } from "@/lib/db/types";

interface InvoiceRow {
  id: string;
  invoice_number: string;
  source_quote_id: string | null;
  engineer: string | null;
  materials: string | null;
  customer: unknown;
  items: unknown;
  subtotal: number;
  tax: number;
  total: number;
  include_tax: boolean;
  notes: string | null;
  issued_at: string | Date;
  due_at: string | Date;
  pdf_filename: string | null;
  created_at: string | Date;
}

function mapInvoiceRow(row: InvoiceRow): StoredInvoice {
  return {
    id: row.id,
    invoiceNumber: row.invoice_number,
    sourceQuoteId: row.source_quote_id,
    engineer: row.engineer ?? "",
    materials: row.materials ?? "",
    customer: row.customer as StoredInvoice["customer"],
    items: row.items as StoredInvoice["items"],
    subtotal: row.subtotal,
    tax: row.tax,
    total: row.total,
    includeTax: row.include_tax,
    notes: row.notes ?? "",
    issuedAt: String(row.issued_at).slice(0, 10),
    dueAt: String(row.due_at).slice(0, 10),
    pdfFilename: row.pdf_filename,
    createdAt: new Date(row.created_at).toISOString(),
  };
}

export async function saveInvoice(input: SaveInvoiceInput): Promise<StoredInvoice | null> {
  if (!isDatabaseConfigured()) return null;

  const sql = getSql();
  if (!sql) return null;

  try {
    await ensureSchema();

    const { invoice } = input;

    const rows = await sql`
      INSERT INTO invoices (
        invoice_number,
        source_quote_id,
        engineer,
        materials,
        customer,
        items,
        subtotal,
        tax,
        total,
        include_tax,
        notes,
        issued_at,
        due_at,
        pdf_filename
      ) VALUES (
        ${invoice.invoiceNumber},
        ${input.sourceQuoteId ?? null},
        ${input.engineer ?? ""},
        ${input.materials ?? ""},
        ${JSON.stringify(invoice.customer)},
        ${JSON.stringify(invoice.items)},
        ${input.subtotal},
        ${input.tax},
        ${input.total},
        ${invoice.includeTax},
        ${invoice.notes || null},
        ${invoice.issuedAt},
        ${invoice.dueAt},
        ${input.pdfFilename ?? null}
      )
      ON CONFLICT (invoice_number) DO UPDATE SET
        source_quote_id = COALESCE(EXCLUDED.source_quote_id, invoices.source_quote_id),
        engineer = EXCLUDED.engineer,
        materials = EXCLUDED.materials,
        customer = EXCLUDED.customer,
        items = EXCLUDED.items,
        subtotal = EXCLUDED.subtotal,
        tax = EXCLUDED.tax,
        total = EXCLUDED.total,
        include_tax = EXCLUDED.include_tax,
        notes = EXCLUDED.notes,
        issued_at = EXCLUDED.issued_at,
        due_at = EXCLUDED.due_at,
        pdf_filename = COALESCE(EXCLUDED.pdf_filename, invoices.pdf_filename)
      RETURNING *
    `;

    const row = rows[0] as InvoiceRow | undefined;
    return row ? mapInvoiceRow(row) : null;
  } catch (error) {
    console.error("Error guardando factura:", error);
    return null;
  }
}

export async function listInvoices(limit = 50, offset = 0): Promise<StoredInvoice[]> {
  if (!isDatabaseConfigured()) return [];

  const sql = getSql();
  if (!sql) return [];

  try {
    await ensureSchema();

    const safeLimit = Math.min(100, Math.max(1, limit));
    const safeOffset = Math.max(0, offset);

    const rows = await sql`
      SELECT *
      FROM invoices
      ORDER BY created_at DESC
      LIMIT ${safeLimit}
      OFFSET ${safeOffset}
    `;

    return (rows as InvoiceRow[]).map(mapInvoiceRow);
  } catch (error) {
    console.error("Error listando facturas:", error);
    return [];
  }
}