import { ensureSchema, getSql } from "@/lib/db/client";
import type { AnalyticsSummary } from "./types";

const TZ = "America/Bogota";

function clampDays(days: number): number {
  if (days <= 7) return 7;
  if (days >= 30) return 30;
  return days;
}

export async function getAnalyticsSummary(daysInput: number): Promise<AnalyticsSummary | null> {
  const sql = getSql();
  if (!sql) return null;

  await ensureSchema();

  const periodDays = clampDays(daysInput);

  const [
    todayRows,
    periodRows,
    dailyRows,
    topProductRows,
    whatsappRows,
    deviceRows,
    funnelRows,
  ] = await Promise.all([
    sql`
      SELECT
        COUNT(*) FILTER (WHERE event_type = 'page_view')::int AS page_views,
        COUNT(DISTINCT session_id) FILTER (WHERE event_type = 'page_view')::int AS sessions,
        COUNT(*) FILTER (WHERE event_type = 'whatsapp_click')::int AS whatsapp_clicks
      FROM site_events
      WHERE created_at >= (date_trunc('day', NOW() AT TIME ZONE ${TZ}) AT TIME ZONE ${TZ})
    `,
    sql`
      SELECT
        COUNT(*) FILTER (WHERE event_type = 'page_view')::int AS page_views,
        COUNT(DISTINCT session_id) FILTER (WHERE event_type = 'page_view')::int AS sessions,
        COUNT(*) FILTER (WHERE event_type = 'whatsapp_click')::int AS whatsapp_clicks,
        COUNT(*) FILTER (WHERE event_type = 'cotizador_enter')::int AS cotizador_enters,
        COUNT(*) FILTER (WHERE event_type = 'cotizador_pdf_generated')::int AS pdfs_generated,
        COUNT(*) FILTER (WHERE event_type = 'product_open')::int AS product_opens
      FROM site_events
      WHERE created_at >= NOW() - (${periodDays}::int || ' days')::interval
    `,
    sql`
      SELECT
        to_char((created_at AT TIME ZONE ${TZ})::date, 'YYYY-MM-DD') AS day,
        COUNT(*) FILTER (WHERE event_type = 'page_view')::int AS page_views,
        COUNT(DISTINCT session_id) FILTER (WHERE event_type = 'page_view')::int AS sessions
      FROM site_events
      WHERE created_at >= NOW() - (${periodDays}::int || ' days')::interval
      GROUP BY day
      ORDER BY day ASC
    `,
    sql`
      SELECT
        COALESCE(metadata->>'productId', 'unknown') AS product_id,
        COALESCE(metadata->>'productName', 'Sin nombre') AS product_name,
        COUNT(*)::int AS opens
      FROM site_events
      WHERE event_type = 'product_open'
        AND created_at >= NOW() - (${periodDays}::int || ' days')::interval
      GROUP BY product_id, product_name
      ORDER BY opens DESC
      LIMIT 8
    `,
    sql`
      SELECT
        COALESCE(metadata->>'source', 'unknown') AS source,
        COUNT(*)::int AS count
      FROM site_events
      WHERE event_type = 'whatsapp_click'
        AND created_at >= NOW() - (${periodDays}::int || ' days')::interval
      GROUP BY source
      ORDER BY count DESC
    `,
    sql`
      SELECT
        COALESCE(device, 'unknown') AS device,
        COUNT(DISTINCT session_id)::int AS sessions
      FROM site_events
      WHERE event_type = 'page_view'
        AND created_at >= NOW() - (${periodDays}::int || ' days')::interval
      GROUP BY device
      ORDER BY sessions DESC
    `,
    sql`
      SELECT step, COUNT(DISTINCT session_id)::int AS sessions
      FROM (
        SELECT session_id, 'visit' AS step
        FROM site_events
        WHERE event_type = 'page_view'
          AND created_at >= NOW() - (${periodDays}::int || ' days')::interval
        UNION ALL
        SELECT session_id, 'catalog'
        FROM site_events
        WHERE event_type = 'section_view'
          AND metadata->>'section' = 'catalogo'
          AND created_at >= NOW() - (${periodDays}::int || ' days')::interval
        UNION ALL
        SELECT session_id, 'cotizador'
        FROM site_events
        WHERE event_type = 'cotizador_enter'
          AND created_at >= NOW() - (${periodDays}::int || ' days')::interval
        UNION ALL
        SELECT session_id, 'pdf'
        FROM site_events
        WHERE event_type = 'cotizador_pdf_generated'
          AND created_at >= NOW() - (${periodDays}::int || ' days')::interval
        UNION ALL
        SELECT session_id, 'whatsapp'
        FROM site_events
        WHERE event_type = 'whatsapp_click'
          AND created_at >= NOW() - (${periodDays}::int || ' days')::interval
      ) funnel_data
      GROUP BY step
    `,
  ]);

  const today = todayRows[0] as {
    page_views: number;
    sessions: number;
    whatsapp_clicks: number;
  };

  const period = periodRows[0] as {
    page_views: number;
    sessions: number;
    whatsapp_clicks: number;
    cotizador_enters: number;
    pdfs_generated: number;
    product_opens: number;
  };

  const funnelLabels: Record<string, string> = {
    visit: "Visita al sitio",
    catalog: "Vio catalogo",
    cotizador: "Entro al cotizador",
    pdf: "Genero PDF",
    whatsapp: "Clic en WhatsApp",
  };

  const funnelOrder = ["visit", "catalog", "cotizador", "pdf", "whatsapp"];
  const funnelMap = new Map(
    (funnelRows as { step: string; sessions: number }[]).map((r) => [r.step, r.sessions])
  );

  return {
    periodDays,
    today: {
      pageViews: today.page_views ?? 0,
      sessions: today.sessions ?? 0,
      whatsappClicks: today.whatsapp_clicks ?? 0,
    },
    period: {
      pageViews: period.page_views ?? 0,
      sessions: period.sessions ?? 0,
      whatsappClicks: period.whatsapp_clicks ?? 0,
      cotizadorEnters: period.cotizador_enters ?? 0,
      pdfsGenerated: period.pdfs_generated ?? 0,
      productOpens: period.product_opens ?? 0,
    },
    daily: (dailyRows as { day: string; page_views: number; sessions: number }[]).map((r) => ({
      date: r.day,
      pageViews: r.page_views,
      sessions: r.sessions,
    })),
    topProducts: (topProductRows as { product_id: string; product_name: string; opens: number }[]).map(
      (r) => ({
        productId: r.product_id,
        productName: r.product_name,
        opens: r.opens,
      })
    ),
    whatsappBySource: (whatsappRows as { source: string; count: number }[]).map((r) => ({
      source: r.source,
      count: r.count,
    })),
    devices: (deviceRows as { device: string; sessions: number }[]).map((r) => ({
      device: r.device,
      sessions: r.sessions,
    })),
    funnel: funnelOrder.map((key) => ({
      key,
      label: funnelLabels[key],
      sessions: funnelMap.get(key) ?? 0,
    })),
  };
}