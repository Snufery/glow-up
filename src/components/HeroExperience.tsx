"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Activity } from "lucide-react";
import {
  HERO_VIDEO_SRC,
  HERO_POSTER_SRC,
  HERO_PHOTO_SRC,
  heroHotspots,
  dashboardMetrics,
} from "@/data/heroExperience";

export default function HeroExperience() {
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [metricIndex, setMetricIndex] = useState(0);
  const [videoEnabled, setVideoEnabled] = useState(false);
  const [photoBlend, setPhotoBlend] = useState(true);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
    setVideoEnabled(isDesktop && !prefersReduced);

    const interval = setInterval(() => {
      setMetricIndex((i) => (i + 1) % dashboardMetrics[0].values.length);
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex-shrink-0 w-full max-w-[580px] mx-auto lg:mx-0 animate-fade-in-up-delay">
      <div className="relative aspect-[4/5] sm:aspect-[5/6] rounded-[var(--radius-xl)] overflow-hidden border border-white/[0.1] shadow-[0_32px_80px_rgba(0,0,0,0.55)] group">
        {/* Capa 1 — Video cinematografico */}
        {videoEnabled ? (
          <video
            className="absolute inset-0 w-full h-full object-cover scale-105"
            autoPlay
            muted
            loop
            playsInline
            poster={HERO_POSTER_SRC}
            aria-hidden
          >
            <source src={HERO_VIDEO_SRC} type="video/mp4" />
          </video>
        ) : (
          <Image
            src={HERO_POSTER_SRC}
            alt="Hogar inteligente moderno"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 580px"
            className="object-cover"
          />
        )}

        {/* Capa 2 — Foto de referencia con hotspots (opcion premium) */}
        <div
          className={`absolute inset-0 transition-opacity duration-700 ${
            photoBlend ? "opacity-[0.42] mix-blend-soft-light" : "opacity-0"
          }`}
        >
          <Image
            src={HERO_PHOTO_SRC}
            alt=""
            fill
            sizes="580px"
            className="object-cover"
            aria-hidden
          />
        </div>

        {/* Capa 3 — Gradiente cinematico */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-zinc-950/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/50 via-transparent to-zinc-950/30" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(34,211,238,0.12),transparent_65%)]" />

        {/* Vignette */}
        <div className="absolute inset-0 ring-1 ring-inset ring-white/[0.06] rounded-[var(--radius-xl)] pointer-events-none" />

        {/* Hotspots interactivos */}
        {heroHotspots.map((spot) => {
          const Icon = spot.icon;
          const isActive = activeHotspot === spot.id;

          return (
            <div
              key={spot.id}
              className="absolute z-[2] -translate-x-1/2 -translate-y-1/2"
              style={{ top: spot.top, left: spot.left }}
              onMouseEnter={() => setActiveHotspot(spot.id)}
              onMouseLeave={() => setActiveHotspot(null)}
              onFocus={() => setActiveHotspot(spot.id)}
              onBlur={() => setActiveHotspot(null)}
            >
              <button
                type="button"
                className="relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-zinc-950/70 backdrop-blur-md border border-[var(--accent)]/40 text-[var(--accent-bright)] shadow-[0_0_24px_rgba(34,211,238,0.25)] transition-transform hover:scale-110 cursor-pointer hero-hotspot-pulse"
                aria-label={spot.label}
              >
                <span className="absolute inset-0 rounded-full border border-[var(--accent)]/30 animate-ping opacity-40" />
                <Icon size={18} strokeWidth={1.75} className="relative" />
              </button>

              <div
                className={`absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[min(220px,70vw)] transition-all duration-300 pointer-events-none ${
                  isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                }`}
              >
                <div className="glass rounded-xl px-3.5 py-3 text-center shadow-xl border border-white/[0.1]">
                  <p className="text-xs font-bold text-white whitespace-nowrap">{spot.label}</p>
                  <p className="text-[10px] text-zinc-400 mt-1 leading-relaxed">{spot.description}</p>
                </div>
              </div>
            </div>
          );
        })}

        {/* Panel glass — command center */}
        <div className="absolute bottom-4 left-4 right-4 z-[3] glass rounded-2xl p-4 border border-white/[0.1] shadow-[0_16px_48px_rgba(0,0,0,0.4)]">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-[10px] uppercase tracking-[0.15em] text-zinc-500 font-medium">
                Glow Up Command
              </p>
              <p className="text-sm font-semibold text-white mt-0.5">Sala principal</p>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/25">
              <Activity size={12} className="text-[var(--accent)]" />
              <span className="text-[10px] font-semibold text-[var(--accent-bright)]">En linea</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {dashboardMetrics.map((metric) => (
              <div
                key={metric.key}
                className="text-center px-2 py-2.5 rounded-xl bg-zinc-950/50 border border-white/[0.06]"
              >
                <p className="text-[10px] text-zinc-500 mb-1">{metric.label}</p>
                <p className="text-sm font-bold font-[var(--font-display)] text-gradient transition-all duration-500">
                  {metric.values[metricIndex]}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Toggle foto / video puro (solo desktop) */}
        {videoEnabled && (
          <button
            type="button"
            onClick={() => setPhotoBlend((v) => !v)}
            className="absolute top-4 right-4 z-[4] px-3 py-1.5 rounded-lg text-[10px] font-semibold uppercase tracking-wider glass border border-white/[0.08] text-zinc-400 hover:text-white transition-colors cursor-pointer hidden lg:block"
          >
            {photoBlend ? "Vista cine" : "Vista foto"}
          </button>
        )}
      </div>

      <p className="hidden lg:block text-center text-[10px] text-zinc-600 mt-3 tracking-wide">
        Pasa el cursor sobre los puntos para explorar cada sistema
      </p>
    </div>
  );
}