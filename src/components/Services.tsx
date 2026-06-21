import {
  Home,
  Zap,
  ShieldCheck,
  Building2,
  Wifi,
  Wrench,
  Check,
  Star,
  type LucideIcon,
} from "lucide-react";
import { services } from "@/data/services";

const serviceIcons: Record<string, LucideIcon> = {
  domotica: Home,
  electrica: Zap,
  seguridad: ShieldCheck,
  comercial: Building2,
  redes: Wifi,
  mantenimiento: Wrench,
};

export default function Services() {
  return (
    <section id="servicios" className="py-32 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_100%_0%,rgba(34,211,238,0.06),transparent)]" />

      <div className="relative max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-20">
          <span className="section-badge mb-5">Servicios</span>
          <h2 className="font-[var(--font-display)] text-[clamp(1.8rem,4vw,2.8rem)] font-bold leading-tight tracking-tight">
            Todo lo que necesitas para un <span className="text-gradient">espacio inteligente</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((service) => {
            const Icon = serviceIcons[service.id];
            return (
              <div
                key={service.id}
                className={`premium-card p-8 group ${
                  service.featured ? "ring-1 ring-[var(--accent)]/15" : ""
                }`}
              >
                {service.featured && (
                  <>
                    <div className="absolute -top-16 -right-16 w-44 h-44 bg-[radial-gradient(circle,rgba(34,211,238,0.12),transparent_70%)] pointer-events-none" />
                    <div className="absolute top-4 right-4 flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold text-[var(--accent)] bg-[var(--accent)]/10 border border-[var(--accent)]/20">
                      <Star size={10} fill="currentColor" />
                      Destacado
                    </div>
                  </>
                )}

                <div className="mb-6 w-14 h-14 rounded-2xl bg-zinc-900/80 border border-white/[0.06] flex items-center justify-center text-[var(--accent)] group-hover:border-[var(--accent)]/30 group-hover:shadow-[0_0_30px_rgba(34,211,238,0.15)] transition-all">
                  {Icon && <Icon size={26} strokeWidth={1.5} />}
                </div>

                <h3 className="font-[var(--font-display)] text-lg font-bold mb-3">{service.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed mb-6">{service.description}</p>

                <ul className="flex flex-col gap-2.5 pt-5 border-t border-white/[0.06]">
                  {service.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-xs text-zinc-500">
                      <Check size={14} className="flex-shrink-0 mt-0.5 text-[var(--accent)]" strokeWidth={2.5} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}