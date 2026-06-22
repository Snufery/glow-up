import { MessageSquare, PenTool, HardHat, GraduationCap, type LucideIcon } from "lucide-react";
import { processSteps } from "@/data/services";

const stepIcons: LucideIcon[] = [MessageSquare, PenTool, HardHat, GraduationCap];

export default function Process() {
  return (
    <section id="proyectos" className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_0%_100%,rgba(43,188,179,0.05),transparent)]" />

      <div className="relative max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-20">
          <span className="section-badge mb-5">Nuestro proceso</span>
          <h2 className="font-[var(--font-display)] text-[clamp(1.8rem,4vw,2.8rem)] font-bold leading-tight tracking-tight">
            De la idea a tu <span className="text-gradient">hogar inteligente</span>
          </h2>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="hidden lg:block absolute top-[52px] left-[12%] right-[12%] h-px bg-gradient-to-r from-transparent via-[var(--accent)]/30 to-transparent" />

          {processSteps.map((step, i) => {
            const Icon = stepIcons[i];
            return (
              <div key={step.number} className="premium-card p-7 text-center group">
                <div className="relative inline-flex mb-6">
                  <div className="w-[72px] h-[72px] rounded-2xl bg-zinc-900/80 border border-white/[0.08] flex items-center justify-center text-[var(--accent)] group-hover:border-[var(--accent)]/30 group-hover:shadow-[0_0_30px_rgba(43,188,179,0.15)] transition-all">
                    <Icon size={28} strokeWidth={1.5} />
                  </div>
                  <span className="absolute -top-2 -right-2 w-7 h-7 rounded-lg bg-gradient-brand text-[10px] font-bold text-zinc-950 flex items-center justify-center shadow-[0_0_12px_rgba(43,188,179,0.3)]">
                    {step.number}
                  </span>
                </div>
                <h3 className="font-[var(--font-display)] text-base font-bold mb-3">{step.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}