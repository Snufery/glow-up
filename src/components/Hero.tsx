"use client";

import { useEffect, useRef } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
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
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Layered background */}
      <div className="absolute inset-0 bg-[#0a0a0a]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(34,211,238,0.15),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_80%_80%,rgba(8,145,178,0.1),transparent)]" />

      {/* Subtle grid texture */}
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage: "radial-gradient(ellipse at 50% 40%, black 20%, transparent 70%)",
          WebkitMaskImage: "radial-gradient(ellipse at 50% 40%, black 20%, transparent 70%)",
        }}
      />

      {/* Ambient glow orbs */}
      <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] rounded-full bg-[var(--accent)]/8 blur-[120px] pointer-events-none animate-[glowPulse_8s_ease-in-out_infinite_alternate]" />
      <div className="absolute bottom-1/4 -right-32 w-[400px] h-[400px] rounded-full bg-[var(--accent-dark)]/10 blur-[100px] pointer-events-none animate-[glowPulse_10s_ease-in-out_infinite_alternate-reverse]" />

      <div className="relative z-[1] max-w-[1340px] mx-auto px-6 pt-28 pb-20 w-full flex gap-12 flex-col lg:flex-row items-center">
        {/* Content */}
        <div className="flex-1 animate-fade-in-up text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium tracking-wide text-[var(--accent)] border border-[var(--accent)]/20 bg-[var(--accent)]/5 mb-8">
            <Sparkles size={14} className="text-[var(--accent-bright)]" />
            Domotica &bull; Automatizacion &bull; Instalaciones Electricas
          </div>

          <h1 className="font-[var(--font-display)] text-[clamp(2.5rem,5.5vw,4.2rem)] font-extrabold leading-[1.08] mb-6 tracking-tight">
            Transforma tu espacio en un
            <span className="block text-gradient mt-1">entorno inteligente</span>
          </h1>

          <p className="text-lg text-zinc-400 max-w-[520px] mb-10 leading-relaxed mx-auto lg:mx-0">
            Disenamos, instalamos y automatizamos hogares y negocios con tecnologia
            de vanguardia. Tu confort y seguridad, bajo control total.
          </p>

          <div className="flex gap-4 flex-wrap justify-center lg:justify-start mb-16">
            <a
              href="#catalogo"
              className="group inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl font-semibold text-sm text-zinc-950 bg-gradient-brand glow-cyan glow-cyan-hover transition-all hover:-translate-y-0.5"
            >
              Ver Catalogo
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="#contacto"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-sm text-white border border-white/10 bg-white/[0.04] backdrop-blur-sm transition-all hover:bg-white/[0.08] hover:border-[var(--accent)]/30 hover:-translate-y-0.5"
            >
              Solicitar Cotizacion
            </a>
          </div>

          <div ref={statsRef} className="flex gap-8 sm:gap-12 justify-center lg:justify-start">
            {[
              { target: 150, suffix: "+", label: "Proyectos realizados" },
              { target: 500, suffix: "+", label: "Dispositivos instalados" },
              { target: 98, suffix: "%", label: "Clientes satisfechos" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col">
                <span className="font-[var(--font-display)] text-2xl sm:text-3xl font-bold text-gradient">
                  <span data-target={stat.target}>0</span>
                  {stat.suffix}
                </span>
                <span className="text-xs text-zinc-500 mt-1 max-w-[100px] leading-snug">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <HeroVisual />
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0a] to-transparent pointer-events-none" />
    </section>
  );
}