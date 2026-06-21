"use client";

import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight, Quote, Plus } from "lucide-react";
import { testimonials } from "@/data/testimonials";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          viewBox="0 0 20 20"
          fill={star <= rating ? "#22d3ee" : "#27272a"}
          className="w-4 h-4"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
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
    <div className="glass-card overflow-hidden group h-full flex flex-col">
      {hasVideo ? (
        <div className="relative aspect-[9/14] max-h-[280px] bg-zinc-900 overflow-hidden">
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
            className="absolute inset-0 flex items-center justify-center bg-black/20 transition-all hover:bg-black/30 cursor-pointer"
          >
            {!isPlaying && (
              <div className="w-14 h-14 rounded-full bg-gradient-brand flex items-center justify-center glow-cyan transition-transform group-hover:scale-110">
                <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6 ml-0.5">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            )}
          </button>
        </div>
      ) : (
        <div className="relative px-6 pt-6 pb-2">
          <Quote size={28} className="text-[var(--accent)]/20 absolute top-4 right-5" />
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--accent)]/20 to-[var(--accent-dark)]/10 border border-[var(--accent)]/20 flex items-center justify-center text-sm font-bold text-[var(--accent-bright)] font-[var(--font-display)]">
              {initials}
            </div>
            <div>
              <h4 className="text-sm font-semibold">{testimonial.clientName}</h4>
              <p className="text-xs text-zinc-500">
                {testimonial.clientRole && `${testimonial.clientRole} · `}
                {testimonial.location}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="p-6 flex-1 flex flex-col">
        <StarRating rating={testimonial.rating} />

        <p className="text-sm text-zinc-400 leading-relaxed mt-4 mb-5 flex-1">
          &ldquo;{testimonial.quote}&rdquo;
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
          {hasVideo && (
            <div>
              <h4 className="text-sm font-semibold">{testimonial.clientName}</h4>
              <p className="text-xs text-zinc-500">
                {testimonial.clientRole && `${testimonial.clientRole} · `}
                {testimonial.location}
              </p>
            </div>
          )}
          {!hasVideo && <div />}
          <span className="text-[0.65rem] font-medium px-3 py-1 rounded-full border border-[var(--accent)]/20 bg-[var(--accent)]/5 text-[var(--accent)]">
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
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_50%_100%,rgba(34,211,238,0.04),transparent)]" />

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
            <div className="glass-card h-full flex flex-col items-center justify-center gap-4 p-8 text-center min-h-[340px] border-dashed border-white/[0.1]">
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