export default function About() {
  const features = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      ),
      title: "Soluciones integrales",
      desc: "Desde el cableado electrico hasta la automatizacion completa de tu espacio",
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
      title: "Garantia y soporte",
      desc: "Respaldo tecnico post-instalacion con atencion permanente y seguimiento",
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
          <circle cx="12" cy="12" r="10" />
          <path d="M8 14s1.5 2 4 2 4-2 4-2" />
          <line x1="9" y1="9" x2="9.01" y2="9" />
          <line x1="15" y1="9" x2="15.01" y2="9" />
        </svg>
      ),
      title: "Atencion personalizada",
      desc: "Cada proyecto se disena a la medida de tus necesidades y presupuesto",
    },
  ];

  const cards = [
    {
      emoji: "\u{1F3E0}",
      label: "Hogares inteligentes",
      desc: "Automatiza luces, seguridad y climatizacion",
    },
    {
      emoji: "\u{1F3E2}",
      label: "Oficinas automatizadas",
      desc: "Control de accesos, energia y espacios",
    },
    {
      emoji: "\u26A1",
      label: "Instalaciones electricas",
      desc: "Residenciales, comerciales e industriales",
    },
  ];

  return (
    <section id="nosotros" className="py-28 lg:py-36 relative">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-20">
          <span className="inline-block px-5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest text-[var(--green)] border border-[rgba(122,182,72,0.2)] bg-[rgba(122,182,72,0.06)] mb-5">
            Quienes somos
          </span>
          <h2 className="font-[var(--font-display)] text-[clamp(2rem,4.5vw,3.2rem)] font-bold leading-tight tracking-tight">
            Innovacion al servicio de tu <span className="text-gradient">comodidad</span>
          </h2>
          <p className="text-[var(--text-secondary)] mt-5 text-lg max-w-2xl mx-auto leading-relaxed">
            Somos expertos en transformar espacios convencionales en entornos inteligentes, seguros y eficientes
          </p>
        </div>

        {/* Two column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Left - Text and features */}
          <div>
            <p className="text-[var(--text-secondary)] mb-5 text-lg leading-relaxed">
              En <strong className="text-[var(--text-primary)]">Glow Up Entornos Inteligentes</strong> nos
              especializamos en convertir espacios convencionales en entornos automatizados, eficientes y seguros.
            </p>
            <p className="text-[var(--text-secondary)] mb-10 text-lg leading-relaxed">
              Combinamos nuestra experiencia en{" "}
              <strong className="text-[var(--text-primary)]">instalaciones electricas</strong> con las ultimas
              tecnologias en <strong className="text-[var(--text-primary)]">domotica</strong> para ofrecerte
              soluciones integrales que se adaptan a tu estilo de vida.
            </p>

            <div className="flex flex-col gap-7">
              {features.map((f) => (
                <div key={f.title} className="flex gap-5 items-start">
                  <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-[rgba(122,182,72,0.08)] border border-[rgba(122,182,72,0.15)] flex items-center justify-center text-[var(--green)]">
                    {f.icon}
                  </div>
                  <div>
                    <h4 className="text-base font-semibold mb-1.5">{f.title}</h4>
                    <p className="text-sm text-[var(--text-muted)] leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Cards (vertical stack, full width) */}
          <div className="flex flex-col gap-5">
            {cards.map((card) => (
              <div
                key={card.label}
                className="w-full p-7 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] flex items-center gap-6 transition-all hover:-translate-y-1 hover:border-[var(--border-hover)] hover:shadow-[0_8px_30px_rgba(43,188,179,0.1)] cursor-default group"
              >
                <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-[var(--bg-secondary)] flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">
                  {card.emoji}
                </div>
                <div>
                  <h4 className="text-lg font-semibold font-[var(--font-display)] mb-1">{card.label}</h4>
                  <p className="text-sm text-[var(--text-muted)]">{card.desc}</p>
                </div>
                <div className="ml-auto flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2" className="w-5 h-5">
                    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            ))}

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4 mt-3">
              {[
                { value: "5+", label: "Anos de experiencia" },
                { value: "100%", label: "Compromiso" },
                { value: "24/7", label: "Soporte tecnico" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="text-center p-5 rounded-xl bg-[var(--bg-card)] border border-[var(--border)]"
                >
                  <div className="text-2xl font-bold font-[var(--font-display)] text-gradient mb-1">
                    {stat.value}
                  </div>
                  <div className="text-xs text-[var(--text-muted)]">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
