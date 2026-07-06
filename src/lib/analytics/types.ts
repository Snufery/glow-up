export const SITE_EVENT_TYPES = [
  "page_view",
  "section_view",
  "product_open",
  "catalog_filter",
  "cotizador_enter",
  "cotizador_add_product",
  "cotizador_pdf_generated",
  "whatsapp_click",
  "nav_click",
] as const;

export type SiteEventType = (typeof SITE_EVENT_TYPES)[number];

export type SiteEventMetadata = Record<string, string | number | boolean>;

export interface TrackEventPayload {
  eventType: SiteEventType;
  path?: string;
  metadata?: SiteEventMetadata;
  sessionId: string;
  device?: string;
  referrer?: string;
}

export interface DailyMetric {
  date: string;
  pageViews: number;
  sessions: number;
}

export interface TopProductMetric {
  productId: string;
  productName: string;
  opens: number;
}

export interface FunnelStep {
  key: string;
  label: string;
  sessions: number;
}

export interface AnalyticsSummary {
  periodDays: number;
  today: {
    pageViews: number;
    sessions: number;
    whatsappClicks: number;
  };
  period: {
    pageViews: number;
    sessions: number;
    whatsappClicks: number;
    cotizadorEnters: number;
    pdfsGenerated: number;
    productOpens: number;
  };
  daily: DailyMetric[];
  topProducts: TopProductMetric[];
  whatsappBySource: { source: string; count: number }[];
  devices: { device: string; sessions: number }[];
  funnel: FunnelStep[];
}