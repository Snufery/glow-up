import { processSteps } from "@/data/services";

export default function Process() {
  return (
    <section id="proyectos" className="py-24 relative">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-16">
          <span className="inline-block px-5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest text-[var(--green)] border border-[rgba(122,182,72,0.2)] bg-[rgba(122,182,72,0.06)] mb-5">
            Nuestro proceso
          </span>
          <h2 className="font-[var(--font-display)] text-[clamp(1.8rem,4vw,2.8rem)] font-bold leading-tight tracking-tight">
            De la idea a tu <span className="text-gradient">hogar inteligente</span>
          </h2>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Timeline line (desktop only) */}
          <div className="hidden lg:block absolute top-9 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-[var(--green)] to-[var(--teal)] opacity-30" />

          {processSteps.map((step) => (
            <div key={step.number} className="text-center relative group">
              <div className="inline-flex items-center justify-center w-[72px] h-[72px] rounded-full font-[var(--font-display)] text-xl font-extrabold bg-[var(--bg-card)] border-2 border-[var(--border)] text-[var(--green)] mb-6 relative z-[1] transition-all group-hover:border-[var(--green)] group-hover:shadow-[0_0_24px_var(--glow-green)]">
                {step.number}
              </div>
              <h3 className="font-[var(--font-display)] text-base font-bold mb-2.5">{step.title}</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
