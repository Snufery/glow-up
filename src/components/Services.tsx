import { services } from "@/data/services";

const serviceIcons: Record<string, React.ReactNode> = {
  domotica: (
    <svg viewBox="0 0 48 48" fill="none" className="w-14 h-14">
      <rect x="4" y="4" width="40" height="40" rx="8" stroke="url(#sGrad)" strokeWidth="2" />
      <circle cx="24" cy="20" r="6" stroke="url(#sGrad)" strokeWidth="2" />
      <path d="M16 36c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke="url(#sGrad)" strokeWidth="2" />
      <circle cx="36" cy="12" r="3" fill="var(--green)" />
      <defs>
        <linearGradient id="sGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--green)" />
          <stop offset="100%" stopColor="var(--teal)" />
        </linearGradient>
      </defs>
    </svg>
  ),
  electrica: (
    <svg viewBox="0 0 48 48" fill="none" className="w-14 h-14">
      <path d="M28 4L12 28h12L20 44l16-24H24L28 4z" stroke="var(--teal)" strokeWidth="2" />
    </svg>
  ),
  seguridad: (
    <svg viewBox="0 0 48 48" fill="none" className="w-14 h-14">
      <path d="M24 4L6 12v12c0 11 8 20 18 22 10-2 18-11 18-22V12L24 4z" stroke="var(--green)" strokeWidth="2" />
      <path d="M18 24l4 4 8-8" stroke="var(--green)" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
  comercial: (
    <svg viewBox="0 0 48 48" fill="none" className="w-14 h-14">
      <rect x="6" y="14" width="36" height="24" rx="4" stroke="var(--teal)" strokeWidth="2" />
      <path d="M6 22h36" stroke="var(--teal)" strokeWidth="2" />
      <circle cx="14" cy="30" r="3" stroke="var(--green)" strokeWidth="2" />
      <circle cx="24" cy="30" r="3" stroke="var(--green)" strokeWidth="2" />
      <circle cx="34" cy="30" r="3" stroke="var(--green)" strokeWidth="2" />
      <path d="M18 8h12" stroke="var(--teal)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  redes: (
    <svg viewBox="0 0 48 48" fill="none" className="w-14 h-14">
      <circle cx="24" cy="24" r="4" stroke="var(--green)" strokeWidth="2" />
      <circle cx="10" cy="10" r="3" stroke="var(--teal)" strokeWidth="2" />
      <circle cx="38" cy="10" r="3" stroke="var(--teal)" strokeWidth="2" />
      <circle cx="10" cy="38" r="3" stroke="var(--teal)" strokeWidth="2" />
      <circle cx="38" cy="38" r="3" stroke="var(--teal)" strokeWidth="2" />
      <line x1="13" y1="13" x2="21" y2="21" stroke="var(--teal)" strokeWidth="1.5" />
      <line x1="35" y1="13" x2="27" y2="21" stroke="var(--teal)" strokeWidth="1.5" />
      <line x1="13" y1="35" x2="21" y2="27" stroke="var(--teal)" strokeWidth="1.5" />
      <line x1="35" y1="35" x2="27" y2="27" stroke="var(--teal)" strokeWidth="1.5" />
    </svg>
  ),
  mantenimiento: (
    <svg viewBox="0 0 48 48" fill="none" className="w-14 h-14">
      <path d="M20 8a12 12 0 1 0 12 12" stroke="var(--green)" strokeWidth="2" strokeLinecap="round" />
      <path d="M32 4v8h8" stroke="var(--green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M24 16v8l5 3" stroke="var(--teal)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
};

export default function Services() {
  return (
    <section id="servicios" className="py-24 relative">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-16">
          <span className="inline-block px-5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest text-[var(--green)] border border-[rgba(122,182,72,0.2)] bg-[rgba(122,182,72,0.06)] mb-5">
            Servicios
          </span>
          <h2 className="font-[var(--font-display)] text-[clamp(1.8rem,4vw,2.8rem)] font-bold leading-tight tracking-tight">
            Todo lo que necesitas para un <span className="text-gradient">espacio inteligente</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className={`relative p-9 rounded-[var(--radius-lg)] bg-[var(--bg-card)] border transition-all hover:border-[var(--border-hover)] hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.3)] overflow-hidden ${
                service.featured
                  ? "border-[rgba(122,182,72,0.25)] bg-gradient-brand-subtle"
                  : "border-[var(--border)]"
              }`}
            >
              {service.featured && (
                <div className="absolute -top-12 -right-12 w-[150px] h-[150px] bg-[radial-gradient(circle,var(--glow-green),transparent_70%)] opacity-30 pointer-events-none" />
              )}

              <div className="mb-5">{serviceIcons[service.id]}</div>

              <h3 className="font-[var(--font-display)] text-lg font-bold mb-3">{service.title}</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-5">{service.description}</p>

              <ul className="flex flex-col gap-2">
                {service.items.map((item) => (
                  <li key={item} className="relative pl-[18px] text-xs text-[var(--text-muted)] service-dot">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
