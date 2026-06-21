"use client";

import { useEffect, useRef } from "react";
import { ArrowRight, Sparkles, ChevronDown, LayoutGrid } from "lucide-react";
import HeroVisual from "./HeroVisual";

export default function Hero() {
  const statsRef = useRef<HTMLDivElement>(null);
  const countersStarted = useRef(false);

  useEffect(() => {
    if (!statsRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !countersStarted.current) {
            countersStarted.current = true;
            const els = statsRef.current?.querySelectorAll("[data-target]");
            els?.forEach((el) => {
              const target = parseInt(el.getAttribute("data-target") || "0");
              const duration = 2000;
              const start = performance.now();
              const update = (now: number) => {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                el.textContent = String(Math.round(target * eased));
                if (progress < 1) requestAnimationFrame(update);
              };
              requestAnimationFrame(update);
            });
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-[100dvh] flex items-center overflow-hidden noise-overlay"
    >
      <div className="absolute inset-0 bg-zinc-950" />
      <div
        className="absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 50%, rgba(34,211,238,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(8,145,178,0.12) 0%, transparent 40%)",
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_-20%,rgba(34,211,238,0.22),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_100%_50%,rgba(8,145,178,0.14),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_30%_at_0%_80%,rgba(103,246,255,0.08),transparent)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/0 via-zinc-950/20 to-zinc-950" />

      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          maskImage: "radial-gradient(ellipse at 50% 30%, black 15%, transparent 65%)",
          WebkitMaskImage: "radial-gradient(ellipse at 50% 30%, black 15%, transparent 65%)",
        }}
      />

      <div className="absolute top-1/3 -left-40 w-[600px] h-[600px] rounded-full bg-[var(--accent)]/10 blur-[140px] pointer-events-none animate-[glowPulse_8s_ease-in-out_infinite_alternate]" />
      <div className="absolute bottom-1/4 -right-40 w-[500px] h-[500px] rounded-full bg-[var(--accent-dark)]/12 blur-[120px] pointer-events-none animate-[glowPulse_10s_ease-in-out_infinite_alternate-reverse]" />

      <div className="relative z-[1] max-w-[1340px] mx-auto px-6 pt-32 pb-28 w-full flex gap-16 flex-col lg:flex-row items-center">
        <div className="flex-1 animate-fade-in-up text-center lg:text-left">
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider text-[var(--accent-bright)] border border-[var(--accent)]/25 bg-[var(--accent)]/8 backdrop-blur-sm mb-10 shadow-[0_0_30px_rgba(34,211,238,0.08)]">
            <Sparkles size={15} className="text-[var(--accent)]" />
            Domotica &bull; Automatizacion &bull; Instalaciones Electricas
          </div>

          <h1 className="font-[var(--font-display)] text-[clamp(2.8rem,6vw,4.8rem)] font-extrabold leading-[1.05] mb-7 tracking-tight">
            Transforma tu espacio en un
            <span className="block text-gradient mt-2 pb-1">entorno inteligente</span>
          </h1>

          <p className="text-lg sm:text-xl text-zinc-400 max-w-[540px] mb-12 leading-relaxed mx-auto lg:mx-0">
            Disenamos, instalamos y automatizamos hogares y negocios con tecnologia
            de vanguardia. Tu confort y seguridad, bajo control total.
          </p>

          <div className="flex gap-4 flex-wrap justify-center lg:justify-start mb-14">
            <a href="#contacto" className="btn-primary group">
              Solicitar Cotizacion
              <ArrowRight size={17} className="relative z-[1] transition-transform group-hover:translate-x-1" />
            </a>
            <a href="#catalogo" className="btn-secondary group">
              <LayoutGrid size={16} className="transition-transform group-hover:scale-110" />
              Ver Catalogo
            </a>
          </div>

          <div
            ref={statsRef}
            className="inline-flex flex-wrap gap-3 sm:gap-0 sm:divide-x sm:divide-white/[0.08] glass rounded-2xl p-1 sm:p-0"
          >
            {[
              { target: 150, suffix: "+", label: "Proyectos realizados" },
              { target: 500, suffix: "+", label: "Dispositivos instalados" },
              { target: 98, suffix: "%", label: "Clientes satisfechos" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col px-6 sm:px-8 py-4 sm:py-5 min-w-[120px]">
                <span className="font-[var(--font-display)] text-2xl sm:text-3xl font-bold text-gradient">
                  <span data-target={stat.target}>0</span>
                  {stat.suffix}
                </span>
                <span className="text-[11px] text-zinc-500 mt-1 leading-snug">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <HeroVisual />
      </div>

      <a
        href="#nosotros"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[2] flex flex-col items-center gap-1 text-zinc-600 hover:text-[var(--accent)] transition-colors"
        aria-label="Scroll hacia abajo"
      >
        <span className="text-[10px] uppercase tracking-[0.2em] font-medium">Descubre mas</span>
        <ChevronDown size={20} className="animate-bounce" />
      </a>

      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-zinc-950 to-transparent pointer-events-none" />
    </section>
  );
}