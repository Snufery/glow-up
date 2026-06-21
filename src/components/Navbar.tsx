"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Menu, X, ShoppingBag } from "lucide-react";

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
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-500 ${
          scrolled
            ? "glass border-b border-white/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.5)] py-2"
            : "bg-zinc-950/20 backdrop-blur-md border-b border-transparent py-4"
        }`}
      >
        <div className="max-w-[1200px] mx-auto px-5 sm:px-6 flex items-center justify-between">
          <a href="#hero" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 rounded-xl bg-[var(--accent)]/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
              <Image
                src="/logo.png"
                alt="Glow Up"
                width={48}
                height={48}
                className="relative h-11 w-11 sm:h-12 sm:w-12 object-contain"
                priority
              />
            </div>
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="text-[15px] font-bold tracking-wide font-[var(--font-display)]">
                <span className="text-[var(--accent-bright)]">Glow</span>{" "}
                <span className="text-[var(--accent)]">Up</span>
              </span>
              <span className="text-[10px] font-medium text-zinc-400 tracking-[0.2em] uppercase">
                Entornos Inteligentes
              </span>
            </div>
          </a>

          {/* Desktop links */}
          <ul className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-all ${
                    link.href === "#catalogo"
                      ? "text-[var(--accent-bright)] hover:bg-[var(--accent)]/10 flex items-center gap-1.5"
                      : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
                  }`}
                >
                  {link.href === "#catalogo" && <ShoppingBag size={14} />}
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href="#contacto"
                className="ml-2 px-5 py-2.5 text-sm font-semibold text-zinc-950 rounded-xl bg-gradient-brand glow-cyan glow-cyan-hover transition-all hover:-translate-y-0.5"
              >
                Contacto
              </a>
            </li>
          </ul>

          {/* Mobile toggle */}
          <button
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl border border-white/[0.08] bg-white/[0.04] text-zinc-300 hover:text-white hover:border-[var(--accent)]/30 transition-all"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Cerrar menu" : "Abrir menu"}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile overlay menu */}
      <div
        className={`fixed inset-0 z-[999] lg:hidden transition-all duration-400 ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={() => setMenuOpen(false)}
        />
        <div
          className={`absolute top-0 right-0 h-full w-[min(320px,85vw)] glass border-l border-white/[0.06] shadow-[-20px_0_60px_rgba(0,0,0,0.5)] transition-transform duration-400 ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex flex-col h-full pt-20 px-6 pb-8">
            <div className="flex items-center gap-3 mb-8 pb-6 border-b border-white/[0.06]">
              <Image src="/logo.png" alt="Glow Up" width={40} height={40} className="h-10 w-10 object-contain" />
              <div>
                <p className="text-sm font-bold font-[var(--font-display)]">
                  <span className="text-[var(--accent-bright)]">Glow</span>{" "}
                  <span className="text-[var(--accent)]">Up</span>
                </p>
                <p className="text-[10px] text-zinc-500 tracking-widest uppercase">Entornos Inteligentes</p>
              </div>
            </div>

            <nav className="flex flex-col gap-1 flex-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`px-4 py-3.5 text-sm font-medium rounded-xl transition-all ${
                    link.href === "#catalogo"
                      ? "text-[var(--accent-bright)] bg-[var(--accent)]/8 border border-[var(--accent)]/20 flex items-center gap-2"
                      : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
                  }`}
                >
                  {link.href === "#catalogo" && <ShoppingBag size={16} />}
                  {link.label}
                </a>
              ))}
            </nav>

            <a
              href="#contacto"
              onClick={() => setMenuOpen(false)}
              className="mt-6 px-5 py-3.5 text-sm font-semibold text-zinc-950 text-center rounded-xl bg-gradient-brand glow-cyan"
            >
              Solicitar Cotizacion
            </a>
          </div>
        </div>
      </div>
    </>
  );
}