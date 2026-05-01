"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const navLinks = [
  { href: "#hero", label: "Inicio" },
  { href: "#nosotros", label: "Nosotros" },
  { href: "#servicios", label: "Servicios" },
  { href: "#catalogo", label: "Catalogo" },
  { href: "#proyectos", label: "Proyectos" },
  { href: "#testimonios", label: "Testimonios" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-300 ${
        scrolled
          ? "bg-[#0B1A2B]/92 backdrop-blur-xl border-b border-[var(--border)] py-1"
          : "bg-transparent py-2"
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between">
        <a href="#hero" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Glow Up"
            width={64}
            height={64}
            className="h-16 w-16 object-contain"
            priority
          />
          <div className="hidden sm:flex flex-col leading-tight">
            <span className="text-base font-bold tracking-wide" style={{ fontFamily: 'var(--font-display)' }}>
              <span className="text-[#92bc51]">Glow</span> <span className="text-[#048f8c]">Up</span>
            </span>
            <span className="text-[11px] font-medium text-white tracking-widest uppercase">
              Entornos Inteligentes
            </span>
          </div>
        </a>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => (
            <li key={link.href}>
              {link.href === "#catalogo" ? (
                <a
                  href={link.href}
                  className="px-4 py-2 text-sm font-semibold text-[#92bc51] rounded-lg border border-[#92bc51]/40 transition-all hover:bg-[#92bc51]/10 hover:border-[#92bc51]/70 hover:shadow-[0_0_12px_rgba(146,188,81,0.2)] flex items-center gap-1.5 animate-[catalogPulse_2.5s_ease-in-out_infinite]"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                    <line x1="3" y1="6" x2="21" y2="6"/>
                    <path d="M16 10a4 4 0 01-8 0"/>
                  </svg>
                  {link.label}
                </a>
              ) : (
                <a
                  href={link.href}
                  className="px-4 py-2 text-sm font-medium text-[var(--text-secondary)] rounded-lg transition-all hover:text-[var(--text-primary)] hover:bg-[rgba(122,182,72,0.08)]"
                >
                  {link.label}
                </a>
              )}
            </li>
          ))}
          <li>
            <a
              href="#contacto"
              className="ml-2 px-4 py-2 text-sm font-medium text-white rounded-lg bg-gradient-brand glow-green glow-green-hover transition-all"
            >
              Contacto
            </a>
          </li>
        </ul>

        {/* Mobile: Catalogo + toggle */}
        <div className="md:hidden flex items-center gap-3">
          <a
            href="#servicios"
            className="px-3 py-1.5 text-xs font-semibold text-[#048f8c] rounded-lg border border-[#048f8c]/40 flex items-center gap-1.5 animate-[serviciosPulse_2.5s_ease-in-out_infinite]"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>
            </svg>
            Servicios
          </a>
          <a
            href="#catalogo"
            className="px-3 py-1.5 text-xs font-semibold text-[#92bc51] rounded-lg border border-[#92bc51]/40 flex items-center gap-1.5 animate-[catalogPulse_2.5s_ease-in-out_infinite]"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            Catalogo
          </a>
        <button
          className="flex flex-col gap-[5px] p-1.5"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <span
            className={`block w-6 h-0.5 bg-[var(--text-primary)] rounded transition-all ${
              menuOpen ? "rotate-45 translate-y-[7px]" : ""
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-[var(--text-primary)] rounded transition-all ${
              menuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-[var(--text-primary)] rounded transition-all ${
              menuOpen ? "-rotate-45 -translate-y-[7px]" : ""
            }`}
          />
        </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-[#0B1A2B]/97 backdrop-blur-xl border-b border-[var(--border)] px-6 py-5 flex flex-col gap-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={
                link.href === "#catalogo"
                  ? "px-4 py-2 text-sm font-semibold text-[#92bc51] rounded-lg border border-[#92bc51]/40 transition-all hover:bg-[#92bc51]/10 flex items-center gap-1.5"
                  : "px-4 py-2 text-sm font-medium text-[var(--text-secondary)] rounded-lg transition-all hover:text-[var(--text-primary)]"
              }
            >
              {link.href === "#catalogo" && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 01-8 0"/>
                </svg>
              )}
              {link.label}
            </a>
          ))}
          <a
            href="#contacto"
            onClick={() => setMenuOpen(false)}
            className="mt-2 px-4 py-2 text-sm font-medium text-white text-center rounded-lg bg-gradient-brand"
          >
            Contacto
          </a>
        </div>
      )}
    </nav>
  );
}
