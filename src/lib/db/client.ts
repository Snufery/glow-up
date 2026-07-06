import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

let sqlClient: NeonQueryFunction<false, false> | null = null;
let schemaReady: Promise<void> | null = null;

export function getDatabaseUrl(): string | null {
  return process.env.DATABASE_URL || process.env.POSTGRES_URL || null;
}

export function isDatabaseConfigured(): boolean {
  return Boolean(getDatabaseUrl());
}

export function getSql(): NeonQueryFunction<false, false> | null {
  const url = getDatabaseUrl();
  if (!url) return null;

  if (!sqlClient) {
    sqlClient = neon(url);
  }

  return sqlClient;
}

async function runSchema(sql: NeonQueryFunction<false, false>): Promise<void> {
  await sql`
    CREATE TABLE IF NOT EXISTS quotes (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      quote_ref TEXT UNIQUE NOT NULL,
      customer_name TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      customer_address TEXT NOT NULL DEFAULT '',
      engineer TEXT NOT NULL DEFAULT '',
      materials TEXT NOT NULL DEFAULT '',
      notes TEXT NOT NULL DEFAULT '',
      items JSONB NOT NULL,
      products_subtotal INTEGER NOT NULL,
      installation_subtotal INTEGER NOT NULL,
      grand_total INTEGER NOT NULL,
      item_count INTEGER NOT NULL,
      source TEXT NOT NULL DEFAULT 'public',
      pdf_filename TEXT,
      converted_to_invoice BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS invoices (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      invoice_number TEXT UNIQUE NOT NULL,
      source_quote_id UUID REFERENCES quotes(id) ON DELETE SET NULL,
      engineer TEXT NOT NULL DEFAULT '',
      materials TEXT NOT NULL DEFAULT '',
      customer JSONB NOT NULL,
      items JSONB NOT NULL,
      subtotal INTEGER NOT NULL,
      tax INTEGER NOT NULL,
      total INTEGER NOT NULL,
      include_tax BOOLEAN NOT NULL DEFAULT FALSE,
      notes TEXT,
      issued_at DATE NOT NULL,
      due_at DATE NOT NULL,
      pdf_filename TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`ALTER TABLE quotes ADD COLUMN IF NOT EXISTS customer_address TEXT NOT NULL DEFAULT ''`;
  await sql`ALTER TABLE quotes ADD COLUMN IF NOT EXISTS engineer TEXT NOT NULL DEFAULT ''`;
  await sql`ALTER TABLE quotes ADD COLUMN IF NOT EXISTS materials TEXT NOT NULL DEFAULT ''`;
  await sql`ALTER TABLE quotes ADD COLUMN IF NOT EXISTS notes TEXT NOT NULL DEFAULT ''`;
  await sql`ALTER TABLE quotes ADD COLUMN IF NOT EXISTS converted_to_invoice BOOLEAN NOT NULL DEFAULT FALSE`;
  await sql`ALTER TABLE invoices ADD COLUMN IF NOT EXISTS source_quote_id UUID REFERENCES quotes(id) ON DELETE SET NULL`;
  await sql`ALTER TABLE invoices ADD COLUMN IF NOT EXISTS engineer TEXT NOT NULL DEFAULT ''`;
  await sql`ALTER TABLE invoices ADD COLUMN IF NOT EXISTS materials TEXT NOT NULL DEFAULT ''`;
  await sql`ALTER TABLE quotes ADD COLUMN IF NOT EXISTS intelligence_json JSONB`;
  await sql`ALTER TABLE quotes ADD COLUMN IF NOT EXISTS include_iva BOOLEAN NOT NULL DEFAULT FALSE`;

  await sql`
    CREATE TABLE IF NOT EXISTS quote_drafts (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      share_token TEXT UNIQUE NOT NULL,
      payload JSONB NOT NULL,
      expires_at TIMESTAMPTZ NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS site_events (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      event_type TEXT NOT NULL,
      session_id TEXT NOT NULL,
      path TEXT NOT NULL DEFAULT '/',
      metadata JSONB NOT NULL DEFAULT '{}',
      device TEXT NOT NULL DEFAULT 'unknown',
      referrer TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`CREATE INDEX IF NOT EXISTS idx_quotes_created_at ON quotes (created_at DESC)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_invoices_created_at ON invoices (created_at DESC)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_quote_drafts_token ON quote_drafts (share_token)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_quote_drafts_expires ON quote_drafts (expires_at)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_site_events_created_at ON site_events (created_at DESC)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_site_events_type_created ON site_events (event_type, created_at DESC)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_site_events_session ON site_events (session_id, created_at DESC)`;
}

export async function ensureSchema(): Promise<boolean> {
  const sql = getSql();
  if (!sql) return false;

  if (!schemaReady) {
    schemaReady = runSchema(sql).catch((error) => {
      schemaReady = null;
      throw error;
    });
  }

  await schemaReady;
  return true;
}