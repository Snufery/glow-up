"use client";

import { useEffect, useRef } from "react";
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
      className="relative min-h-screen flex items-center max-w-[1340px] mx-auto px-6 pt-[120px] pb-20 gap-8 flex-col lg:flex-row"
    >
      {/* Background glows */}
      <div className="fixed w-[500px] h-[500px] rounded-full blur-[120px] bg-[var(--glow-green)] -top-24 -left-36 opacity-25 pointer-events-none z-0 animate-[glowPulse_6s_ease-in-out_infinite_alternate]" />
      <div className="fixed w-[400px] h-[400px] rounded-full blur-[120px] bg-[var(--glow-teal)] -bottom-12 -right-24 opacity-20 pointer-events-none z-0 animate-[glowPulse_8s_ease-in-out_infinite_alternate-reverse]" />

      {/* Grid background */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(122,182,72,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(122,182,72,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />

      {/* Content */}
      <div className="flex-1 relative z-[1] animate-fade-in-up text-center lg:text-left">
        <div className="inline-block px-5 py-2 rounded-full text-xs font-medium tracking-wide text-[var(--teal)] border border-[rgba(43,188,179,0.25)] bg-[rgba(43,188,179,0.06)] mb-7">
          Domotica &bull; Automatizacion &bull; Instalaciones Electricas
        </div>

        <h1 className="font-[var(--font-display)] text-[clamp(2.4rem,5vw,3.8rem)] font-extrabold leading-[1.1] mb-6 tracking-tight">
          Transforma tu espacio en un
          <span className="block text-gradient">entorno inteligente</span>
        </h1>

        <p className="text-lg text-[var(--text-secondary)] max-w-[520px] mb-9 leading-relaxed mx-auto lg:mx-0">
          Disenamos, instalamos y automatizamos hogares y negocios con tecnologia
          de vanguardia. Tu confort y seguridad, bajo control total.
        </p>

        <div className="flex gap-4 flex-wrap justify-center lg:justify-start mb-14">
          <a
            href="#catalogo"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-[var(--radius-md)] font-semibold text-sm text-white bg-gradient-brand glow-green glow-green-hover transition-all hover:-translate-y-0.5"
          >
            Ver Catalogo
          </a>
          <a
            href="#contacto"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-[var(--radius-md)] font-semibold text-sm text-[var(--text-primary)] border-[1.5px] border-[var(--border-hover)] transition-all hover:bg-[rgba(43,188,179,0.08)] hover:border-[var(--teal)] hover:-translate-y-0.5"
          >
            Solicitar Cotizacion
          </a>
        </div>

        <div ref={statsRef} className="flex gap-10 justify-center lg:justify-start">
          {[
            { target: 150, suffix: "+", label: "Proyectos realizados" },
            { target: 500, suffix: "+", label: "Dispositivos instalados" },
            { target: 98, suffix: "%", label: "Clientes satisfechos" },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col font-bold text-2xl font-[var(--font-display)]">
              <span>
                <span data-target={stat.target}>0</span>
                {stat.suffix}
              </span>
              <span className="text-xs font-normal text-[var(--text-muted)] font-[var(--font-body)] mt-0.5">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Animated smart home graphic */}
      <HeroVisual />
    </section>
  );
}
