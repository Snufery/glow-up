"use client";

import { useState, useRef } from "react";
import { testimonials } from "@/data/testimonials";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          viewBox="0 0 20 20"
          fill={star <= rating ? "var(--green)" : "var(--bg-card)"}
          className="w-4 h-4"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function VideoCard({ testimonial }: { testimonial: (typeof testimonials)[0] }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const hasVideo = !!testimonial.videoSrc;

  return (
    <div className="card overflow-hidden group">
      {/* Video / Placeholder area */}
      <div className="relative aspect-[9/14] max-h-[360px] bg-[var(--bg-secondary)] overflow-hidden">
        {hasVideo ? (
          <>
            <video
              ref={videoRef}
              src={testimonial.videoSrc}
              poster={testimonial.posterSrc}
              className="w-full h-full object-cover"
              playsInline
              preload="metadata"
              onEnded={() => setIsPlaying(false)}
            />
            {/* Play/Pause overlay */}
            <button
              onClick={togglePlay}
              className="absolute inset-0 flex items-center justify-center bg-black/20 transition-all hover:bg-black/30 cursor-pointer"
            >
              {!isPlaying && (
                <div className="w-16 h-16 rounded-full bg-gradient-brand flex items-center justify-center glow-green transition-transform group-hover:scale-110">
                  <svg viewBox="0 0 24 24" fill="white" className="w-7 h-7 ml-1">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              )}
            </button>
          </>
        ) : (
          /* Placeholder cuando no hay video aun */
          <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-gradient-to-b from-[var(--bg-card)] to-[var(--bg-secondary)]">
            <div className="w-20 h-20 rounded-full bg-gradient-brand-subtle border-2 border-[var(--border)] flex items-center justify-center">
              <span className="text-3xl">{testimonial.clientName.charAt(0)}</span>
            </div>
            <span className="text-xs text-[var(--text-muted)]">Video proximamente</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-6">
        <StarRating rating={testimonial.rating} />

        <p className="text-sm text-[var(--text-secondary)] leading-relaxed mt-3 mb-4 line-clamp-3">
          &ldquo;{testimonial.quote}&rdquo;
        </p>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold">{testimonial.clientName}</h4>
            <p className="text-xs text-[var(--text-muted)]">
              {testimonial.clientRole && `${testimonial.clientRole} · `}
              {testimonial.location}
            </p>
          </div>
          <span className="text-[0.65rem] font-medium px-2.5 py-1 rounded-full border border-[var(--border)] text-[var(--teal)]">
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
    const amount = 380;
    scrollContainer.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <section id="testimonios" className="py-24 relative">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-16">
          <span className="inline-block px-5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest text-[var(--green)] border border-[rgba(122,182,72,0.2)] bg-[rgba(122,182,72,0.06)] mb-5">
            Testimonios
          </span>
          <h2 className="font-[var(--font-display)] text-[clamp(1.8rem,4vw,2.8rem)] font-bold leading-tight tracking-tight">
            Lo que dicen nuestros <span className="text-gradient">clientes</span>
          </h2>
          <p className="text-[var(--text-secondary)] mt-4 text-base">
            Resultados reales de proyectos en Popayan y alrededores
          </p>
        </div>

        {/* Navigation arrows */}
        <div className="flex justify-end gap-3 mb-6">
          <button
            onClick={() => scroll("left")}
            className="w-10 h-10 rounded-full border border-[var(--border)] bg-[var(--bg-card)] flex items-center justify-center text-[var(--text-secondary)] transition-all hover:border-[var(--green)] hover:text-[var(--green)] cursor-pointer"
            aria-label="Anterior"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            onClick={() => scroll("right")}
            className="w-10 h-10 rounded-full border border-[var(--border)] bg-[var(--bg-card)] flex items-center justify-center text-[var(--text-secondary)] transition-all hover:border-[var(--green)] hover:text-[var(--green)] cursor-pointer"
            aria-label="Siguiente"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>

        {/* Scrollable testimonials */}
        <div
          ref={scrollContainer}
          className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {testimonials.map((t) => (
            <div key={t.id} className="flex-shrink-0 w-[320px] snap-start">
              <VideoCard testimonial={t} />
            </div>
          ))}

          {/* Add more CTA */}
          <div className="flex-shrink-0 w-[320px] snap-start">
            <div className="card h-full flex flex-col items-center justify-center gap-4 p-8 text-center min-h-[460px]">
              <div className="w-16 h-16 rounded-full bg-gradient-brand-subtle border-2 border-[var(--border)] flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2" className="w-7 h-7">
                  <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                </svg>
              </div>
              <h4 className="font-[var(--font-display)] font-bold text-sm">Tu proyecto puede ser el siguiente</h4>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                Contactanos y transforma tu espacio en un entorno inteligente
              </p>
              <a
                href="#contacto"
                className="mt-2 px-6 py-2.5 rounded-[var(--radius-md)] text-xs font-semibold text-white bg-gradient-brand glow-green transition-all hover:-translate-y-0.5"
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
