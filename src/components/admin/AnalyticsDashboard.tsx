import Link from "next/link";
import {
  BarChart3,
  Eye,
  MessageCircle,
  FileDown,
  ShoppingBag,
  Calculator,
  Smartphone,
  Monitor,
  Tablet,
  TrendingUp,
  Users,
} from "lucide-react";
import type { AnalyticsSummary } from "@/lib/analytics/types";
import TrustedDevicesPanel from "@/components/admin/TrustedDevicesPanel";

const SOURCE_LABELS: Record<string, string> = {
  float: "Boton flotante",
  contact_form: "Formulario contacto",
  contact_link: "Enlace contacto",
  product: "Desde producto",
  unknown: "Otro",
};

const DEVICE_ICONS: Record<string, typeof Monitor> = {
  mobile: Smartphone,
  tablet: Tablet,
  desktop: Monitor,
  unknown: Monitor,
};

function KpiCard({
  label,
  value,
  sub,
  icon: Icon,
}: {
  label: string;
  value: number | string;
  sub?: string;
  icon: typeof Eye;
}) {
  return (
    <div className="premium-card p-5">
      <div className="flex items-start justify-between gap-3 mb-3">
        <p className="text-xs text-zinc-500 uppercase tracking-wider">{label}</p>
        <div className="w-8 h-8 rounded-lg bg-[var(--accent)]/10 border border-[var(--accent)]/20 flex items-center justify-center text-[var(--accent)]">
          <Icon size={15} />
        </div>
      </div>
      <p className="font-[var(--font-display)] text-2xl sm:text-3xl font-bold">{value}</p>
      {sub && <p className="text-[11px] text-zinc-500 mt-1">{sub}</p>}
    </div>
  );
}

function PeriodTabs({ days }: { days: number }) {
  const tabs = [
    { value: 7, label: "7 dias" },
    { value: 30, label: "30 dias" },
  ];

  return (
    <div className="flex gap-1 p-1 rounded-xl bg-zinc-900/60 border border-white/[0.06]">
      {tabs.map((tab) => (
        <Link
          key={tab.value}
          href={`/admin?days=${tab.value}`}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            days === tab.value
              ? "bg-[var(--accent)]/15 text-[var(--accent-bright)] border border-[var(--accent)]/25"
              : "text-zinc-500 hover:text-white"
          }`}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}

function DailyChart({ daily }: { daily: AnalyticsSummary["daily"] }) {
  const maxViews = Math.max(...daily.map((d) => d.pageViews), 1);

  if (daily.length === 0) {
    return (
      <p className="text-sm text-zinc-500 py-8 text-center">
        Sin datos aun. Los eventos apareceran cuando haya visitas al sitio.
      </p>
    );
  }

  return (
    <div className="flex items-end gap-1.5 sm:gap-2 h-40 pt-4">
      {daily.map((day) => {
        const height = Math.max(8, (day.pageViews / maxViews) * 100);
        const label = day.date.slice(5);
        return (
          <div key={day.date} className="flex-1 flex flex-col items-center gap-2 min-w-0">
            <span className="text-[10px] text-zinc-500 tabular-nums">{day.pageViews}</span>
            <div
              className="w-full rounded-t-md bg-gradient-to-t from-[var(--accent)]/30 to-[var(--accent)]/70 transition-all"
              style={{ height: `${height}%` }}
              title={`${day.date}: ${day.pageViews} vistas, ${day.sessions} sesiones`}
            />
            <span className="text-[9px] text-zinc-600 truncate w-full text-center">{label}</span>
          </div>
        );
      })}
    </div>
  );
}

function FunnelChart({ funnel }: { funnel: AnalyticsSummary["funnel"] }) {
  const maxSessions = Math.max(...funnel.map((s) => s.sessions), 1);

  return (
    <div className="space-y-3">
      {funnel.map((step, i) => {
        const width = Math.max(6, (step.sessions / maxSessions) * 100);
        const prev = i > 0 ? funnel[i - 1].sessions : null;
        const drop =
          prev && prev > 0 ? Math.round(((prev - step.sessions) / prev) * 100) : null;

        return (
          <div key={step.key}>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-zinc-400">{step.label}</span>
              <span className="text-zinc-300 font-semibold tabular-nums">
                {step.sessions}
                {drop !== null && drop > 0 && (
                  <span className="text-zinc-600 font-normal ml-1.5">-{drop}%</span>
                )}
              </span>
            </div>
            <div className="h-2 rounded-full bg-zinc-900 overflow-hidden">
              <div
                className="h-full rounded-full bg-[var(--accent)]/60"
                style={{ width: `${width}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function AnalyticsDashboard({
  data,
  days,
  dbConfigured,
}: {
  data: AnalyticsSummary | null;
  days: number;
  dbConfigured: boolean;
}) {
  if (!dbConfigured) {
    return (
      <div className="glass rounded-2xl p-6 border border-amber-500/20 max-w-2xl">
        <p className="text-sm font-semibold text-amber-300 mb-2">Base de datos no configurada</p>
        <p className="text-xs text-zinc-500 leading-relaxed">
          Agrega <code className="text-zinc-400">DATABASE_URL</code> en Vercel (Neon Postgres) para
          registrar eventos y ver metricas aqui.
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="glass rounded-2xl p-6 max-w-2xl">
        <p className="text-sm text-zinc-400">No se pudieron cargar las metricas.</p>
      </div>
    );
  }

  const deviceTotal = data.devices.reduce((sum, d) => sum + d.sessions, 0) || 1;

  return (
    <div className="max-w-6xl space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <p className="section-badge mb-3">Actividad del sitio</p>
          <h1 className="font-[var(--font-display)] text-2xl sm:text-3xl font-bold mb-2">
            Dashboard de trafico
          </h1>
          <p className="text-sm text-zinc-400 leading-relaxed max-w-xl">
            Visitas, interacciones y embudo de conversion del sitio publico. Sin datos personales de
            visitantes.
          </p>
        </div>
        <PeriodTabs days={days} />
      </div>

      <div>
        <p className="text-xs text-zinc-500 uppercase tracking-wider mb-3">Hoy</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <KpiCard label="Vistas de pagina" value={data.today.pageViews} icon={Eye} />
          <KpiCard label="Sesiones" value={data.today.sessions} icon={Users} />
          <KpiCard
            label="Clics WhatsApp"
            value={data.today.whatsappClicks}
            icon={MessageCircle}
          />
        </div>
      </div>

      <div>
        <p className="text-xs text-zinc-500 uppercase tracking-wider mb-3">
          Ultimos {data.periodDays} dias
        </p>
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <KpiCard label="Vistas" value={data.period.pageViews} icon={Eye} />
          <KpiCard label="Sesiones" value={data.period.sessions} icon={Users} />
          <KpiCard label="WhatsApp" value={data.period.whatsappClicks} icon={MessageCircle} />
          <KpiCard label="Cotizador" value={data.period.cotizadorEnters} icon={Calculator} />
          <KpiCard label="PDFs generados" value={data.period.pdfsGenerated} icon={FileDown} />
          <KpiCard label="Productos abiertos" value={data.period.productOpens} icon={ShoppingBag} />
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="premium-card p-6">
          <div className="flex items-center gap-2 mb-5">
            <BarChart3 size={18} className="text-[var(--accent)]" />
            <h2 className="font-[var(--font-display)] font-bold">Vistas por dia</h2>
          </div>
          <DailyChart daily={data.daily} />
        </div>

        <div className="premium-card p-6">
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp size={18} className="text-[var(--accent)]" />
            <h2 className="font-[var(--font-display)] font-bold">Embudo de conversion</h2>
          </div>
          <FunnelChart funnel={data.funnel} />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="premium-card p-6 lg:col-span-1">
          <h2 className="font-[var(--font-display)] font-bold mb-4">Productos mas vistos</h2>
          {data.topProducts.length === 0 ? (
            <p className="text-xs text-zinc-500">Sin aperturas de producto aun.</p>
          ) : (
            <ul className="space-y-3">
              {data.topProducts.map((p, i) => (
                <li key={p.productId} className="flex items-center gap-3">
                  <span className="text-xs text-zinc-600 w-4 tabular-nums">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{p.productName}</p>
                  </div>
                  <span className="text-xs font-semibold text-[var(--accent-bright)] tabular-nums">
                    {p.opens}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="premium-card p-6">
          <h2 className="font-[var(--font-display)] font-bold mb-4">WhatsApp por origen</h2>
          {data.whatsappBySource.length === 0 ? (
            <p className="text-xs text-zinc-500">Sin clics registrados.</p>
          ) : (
            <ul className="space-y-3">
              {data.whatsappBySource.map((w) => (
                <li key={w.source} className="flex justify-between text-sm">
                  <span className="text-zinc-400">{SOURCE_LABELS[w.source] ?? w.source}</span>
                  <span className="font-semibold tabular-nums">{w.count}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="premium-card p-6">
          <h2 className="font-[var(--font-display)] font-bold mb-4">Dispositivos</h2>
          {data.devices.length === 0 ? (
            <p className="text-xs text-zinc-500">Sin datos de dispositivo.</p>
          ) : (
            <ul className="space-y-3">
              {data.devices.map((d) => {
                const Icon = DEVICE_ICONS[d.device] ?? Monitor;
                const pct = Math.round((d.sessions / deviceTotal) * 100);
                return (
                  <li key={d.device} className="flex items-center gap-3">
                    <Icon size={16} className="text-zinc-500" />
                    <span className="text-sm text-zinc-400 capitalize flex-1">{d.device}</span>
                    <span className="text-sm font-semibold tabular-nums">{pct}%</span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      <TrustedDevicesPanel />
    </div>
  );
}