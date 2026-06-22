"use client";

import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight, Quote, Plus, Star, Play } from "lucide-react";
import { testimonials } from "@/data/testimonials";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={14}
            fill={star <= rating ? "currentColor" : "none"}
            className={star <= rating ? "text-[var(--accent)]" : "text-zinc-700"}
            strokeWidth={star <= rating ? 0 : 1.5}
          />
        ))}
      </div>
      <span className="text-[11px] font-semibold text-zinc-500">{rating}.0</span>
    </div>
  );
}

function TestimonialCard({ testimonial }: { testimonial: (typeof testimonials)[0] }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const hasVideo = !!testimonial.videoSrc;

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) videoRef.current.pause();
    else videoRef.current.play();
    setIsPlaying(!isPlaying);
  };

  const initials = testimonial.clientName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");

  return (
    <div className="premium-card overflow-hidden group h-full flex flex-col min-h-[360px]">
      <div className="h-1 bg-gradient-to-r from-[var(--accent-dark)] via-[var(--accent)] to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />

      {hasVideo ? (
        <div className="relative aspect-[9/14] max-h-[240px] bg-zinc-900 overflow-hidden">
          <video
            ref={videoRef}
            src={testimonial.videoSrc}
            poster={testimonial.posterSrc}
            className="w-full h-full object-cover"
            playsInline
            preload="metadata"
            onEnded={() => setIsPlaying(false)}
          />
          <button
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center bg-black/25 transition-all hover:bg-black/35 cursor-pointer"
            aria-label={isPlaying ? "Pausar video" : "Reproducir video"}
          >
            {!isPlaying && (
              <div className="w-14 h-14 rounded-full bg-gradient-brand flex items-center justify-center glow-cyan transition-transform group-hover:scale-110">
                <Play size={22} fill="white" className="text-white ml-0.5" />
              </div>
            )}
          </button>
        </div>
      ) : null}

      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-start gap-3 mb-5">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[var(--accent)]/20 to-[var(--accent-dark)]/10 border border-[var(--accent)]/25 flex items-center justify-center text-xs font-bold text-[var(--accent-bright)] font-[var(--font-display)] flex-shrink-0">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-semibold truncate">{testimonial.clientName}</h4>
            <p className="text-xs text-zinc-500 mt-0.5">
              {testimonial.clientRole && `${testimonial.clientRole} · `}
              {testimonial.location}
            </p>
          </div>
          <Quote size={22} className="text-[var(--accent)]/15 flex-shrink-0" />
        </div>

        <StarRating rating={testimonial.rating} />

        <p className="text-sm text-zinc-300/90 leading-relaxed mt-4 mb-6 flex-1 italic">
          &ldquo;{testimonial.quote}&rdquo;
        </p>

        <div className="flex items-center justify-end pt-4 border-t border-white/[0.06]">
          <span className="text-[0.65rem] font-semibold px-3 py-1.5 rounded-full border border-[var(--accent)]/25 bg-[var(--accent)]/8 text-[var(--accent-bright)]">
            {testimonial.serviceType}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  const scrollContainer = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainer.current) return;
    scrollContainer.current.scrollBy({
      left: direction === "left" ? -380 : 380,
      behavior: "smooth",
    });
  };

  return (
    <section id="testimonios" className="py-28 relative">
      <div className="absolute inset-0 bg-zinc-950" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_100%,rgba(43,188,179,0.06),transparent)]" />

      <div className="relative max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-16">
          <span className="section-badge mb-5">Testimonios</span>
          <h2 className="font-[var(--font-display)] text-[clamp(1.8rem,4vw,2.8rem)] font-bold leading-tight tracking-tight">
            Lo que dicen nuestros <span className="text-gradient">clientes</span>
          </h2>
          <p className="text-zinc-400 mt-4 text-base">
            Resultados reales de proyectos en Popayan y alrededores
          </p>
        </div>

        <div className="flex justify-end gap-2 mb-6">
          <button
            onClick={() => scroll("left")}
            className="w-10 h-10 rounded-xl border border-white/[0.08] bg-zinc-900/60 flex items-center justify-center text-zinc-400 transition-all hover:border-[var(--accent)]/30 hover:text-[var(--accent)] cursor-pointer"
            aria-label="Anterior"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => scroll("right")}
            className="w-10 h-10 rounded-xl border border-white/[0.08] bg-zinc-900/60 flex items-center justify-center text-zinc-400 transition-all hover:border-[var(--accent)]/30 hover:text-[var(--accent)] cursor-pointer"
            aria-label="Siguiente"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <div
          ref={scrollContainer}
          className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {testimonials.map((t) => (
            <div key={t.id} className="flex-shrink-0 w-[320px] snap-start">
              <TestimonialCard testimonial={t} />
            </div>
          ))}

          <div className="flex-shrink-0 w-[320px] snap-start">
            <div className="glass-card h-full flex flex-col items-center justify-center gap-4 p-8 text-center min-h-[360px] border-dashed border-[var(--accent)]/15 hover:border-[var(--accent)]/30 transition-colors">
              <div className="w-14 h-14 rounded-full bg-[var(--accent)]/8 border border-[var(--accent)]/20 flex items-center justify-center text-[var(--accent)]">
                <Plus size={24} />
              </div>
              <h4 className="font-[var(--font-display)] font-bold text-sm">Tu proyecto puede ser el siguiente</h4>
              <p className="text-xs text-zinc-500 leading-relaxed max-w-[220px]">
                Contactanos y transforma tu espacio en un entorno inteligente
              </p>
              <a
                href="#contacto"
                className="mt-2 px-6 py-2.5 rounded-xl text-xs font-semibold text-zinc-950 bg-gradient-brand glow-cyan transition-all hover:-translate-y-0.5"
              >
                Contactar
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}