import { Home, Building2, Zap, Layers, ShieldCheck, HeartHandshake, ArrowRight } from "lucide-react";

export default function About() {
  const features = [
    {
      icon: Layers,
      title: "Soluciones integrales",
      desc: "Desde el cableado electrico hasta la automatizacion completa de tu espacio",
    },
    {
      icon: ShieldCheck,
      title: "Garantia y soporte",
      desc: "Respaldo tecnico post-instalacion con atencion permanente y seguimiento",
    },
    {
      icon: HeartHandshake,
      title: "Atencion personalizada",
      desc: "Cada proyecto se disena a la medida de tus necesidades y presupuesto",
    },
  ];

  const cards = [
    {
      icon: Home,
      label: "Hogares inteligentes",
      desc: "Automatiza luces, seguridad y climatizacion",
    },
    {
      icon: Building2,
      label: "Oficinas automatizadas",
      desc: "Control de accesos, energia y espacios",
    },
    {
      icon: Zap,
      label: "Instalaciones electricas",
      desc: "Residenciales, comerciales e industriales",
    },
  ];

  return (
    <section id="nosotros" className="py-32 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_0%_50%,rgba(43,188,179,0.05),transparent)]" />

      <div className="relative max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-20">
          <span className="section-badge mb-5">Quienes somos</span>
          <h2 className="font-[var(--font-display)] text-[clamp(2rem,4.5vw,3.2rem)] font-bold leading-tight tracking-tight">
            Innovacion al servicio de tu <span className="text-gradient">comodidad</span>
          </h2>
          <p className="text-zinc-400 mt-5 text-lg max-w-2xl mx-auto leading-relaxed">
            Somos expertos en transformar espacios convencionales en entornos inteligentes, seguros y eficientes
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          <div>
            <p className="text-zinc-400 mb-5 text-lg leading-relaxed">
              En <strong><span className="text-brand-glow">Glow</span>{" "}
              <span className="text-brand-up">Up</span> Entornos Inteligentes</strong> nos
              especializamos en convertir espacios convencionales en entornos automatizados, eficientes y seguros.
            </p>
            <p className="text-zinc-400 mb-10 text-lg leading-relaxed">
              Combinamos nuestra experiencia en{" "}
              <strong className="text-white">instalaciones electricas</strong> con las ultimas
              tecnologias en <strong className="text-white">domotica</strong> para ofrecerte
              soluciones integrales que se adaptan a tu estilo de vida.
            </p>

            <div className="flex flex-col gap-5">
              {features.map((f) => (
                <div key={f.title} className="flex gap-5 items-start group">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[var(--accent)]/8 border border-[var(--accent)]/15 flex items-center justify-center text-[var(--accent)] group-hover:bg-[var(--accent)]/12 group-hover:shadow-[0_0_20px_rgba(43,188,179,0.1)] transition-all">
                    <f.icon size={22} strokeWidth={1.75} />
                  </div>
                  <div>
                    <h4 className="text-base font-semibold mb-1.5">{f.title}</h4>
                    <p className="text-sm text-zinc-500 leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {cards.map((card) => (
              <div
                key={card.label}
                className="premium-card w-full p-6 flex items-center gap-5 cursor-default group"
              >
                <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-zinc-900/80 border border-white/[0.06] flex items-center justify-center text-[var(--accent)] group-hover:border-[var(--accent)]/25 group-hover:shadow-[0_0_24px_rgba(43,188,179,0.12)] transition-all">
                  <card.icon size={26} strokeWidth={1.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-base font-semibold font-[var(--font-display)] mb-1">{card.label}</h4>
                  <p className="text-sm text-zinc-500">{card.desc}</p>
                </div>
                <ArrowRight
                  size={18}
                  className="flex-shrink-0 text-zinc-600 opacity-0 group-hover:opacity-100 group-hover:text-[var(--accent)] transition-all -translate-x-1 group-hover:translate-x-0"
                />
              </div>
            ))}

            <div className="grid grid-cols-3 gap-3 mt-2">
              {[
                { value: "5+", label: "Anos de experiencia" },
                { value: "100%", label: "Compromiso" },
                { value: "24/7", label: "Soporte tecnico" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="text-center p-5 rounded-xl bg-zinc-900/50 border border-white/[0.06] hover:border-[var(--accent)]/15 transition-colors"
                >
                  <div className="text-xl sm:text-2xl font-bold font-[var(--font-display)] text-gradient mb-1">
                    {stat.value}
                  </div>
                  <div className="text-[11px] text-zinc-500 leading-snug">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}