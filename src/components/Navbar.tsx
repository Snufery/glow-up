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
          ? "bg-[#0B1A2B]/92 backdrop-blur-xl border-b border-[var(--border)] py-2.5"
          : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between">
        <a href="#hero" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Glow Up"
            width={48}
            height={48}
            className="h-12 w-12 object-contain"
            priority
          />
          <div className="hidden sm:flex flex-col leading-tight">
            <span className="text-base font-bold tracking-wide" style={{ fontFamily: 'var(--font-display)' }}>
              <span className="text-[#7AB648]">Glow</span> <span className="text-[#2BBCB3]">Up</span>
            </span>
            <span className="text-[11px] font-medium text-[var(--teal)] tracking-widest uppercase">
              Entornos Inteligentes
            </span>
          </div>
        </a>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-[var(--text-secondary)] rounded-lg transition-all hover:text-[var(--text-primary)] hover:bg-[rgba(122,182,72,0.08)]"
              >
                {link.label}
              </a>
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

        {/* Mobile toggle */}
        <button
          className="md:hidden flex flex-col gap-[5px] p-1.5"
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

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-[#0B1A2B]/97 backdrop-blur-xl border-b border-[var(--border)] px-6 py-5 flex flex-col gap-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="px-4 py-2 text-sm font-medium text-[var(--text-secondary)] rounded-lg transition-all hover:text-[var(--text-primary)]"
            >
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
