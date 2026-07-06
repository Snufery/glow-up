"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, ShoppingBag, Calculator } from "lucide-react";
import { trackEvent } from "@/lib/analytics/track";

const navLinks = [
  { href: "#hero", label: "Inicio" },
  { href: "#nosotros", label: "Nosotros" },
  { href: "#servicios", label: "Servicios" },
  { href: "#catalogo", label: "Catalogo" },
  { href: "#proyectos", label: "Proyectos" },
  { href: "#testimonios", label: "Testimonios" },
];

const mobileNavLinks = navLinks.filter(
  (link) => link.href === "#servicios" || link.href === "#catalogo"
);

const drawerNavLinks = navLinks.filter(
  (link) => link.href !== "#servicios" && link.href !== "#catalogo"
);

const sectionIds = navLinks.map((l) => l.href.slice(1));

function NavLink({
  link,
  isActive,
  compact = false,
}: {
  link: (typeof navLinks)[number];
  isActive: boolean;
  compact?: boolean;
}) {
  const isCatalog = link.href === "#catalogo";

  return (
    <a
      href={link.href}
      onClick={() => trackEvent("nav_click", { target: link.href.slice(1) })}
      className={`font-medium rounded-lg transition-all flex items-center gap-1.5 ${
        compact ? "px-2.5 py-1.5 text-xs" : "px-3.5 py-2 text-sm"
      } ${
        isActive
          ? "text-white bg-white/[0.06] border border-white/[0.08]"
          : isCatalog
            ? "text-[var(--accent-bright)] hover:bg-[var(--accent)]/10"
            : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
      }`}
    >
      {isCatalog && <ShoppingBag size={compact ? 13 : 14} />}
      {link.label}
    </a>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target.id) setActiveSection(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0.1, 0.25, 0.5] }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[1100] transition-all duration-500 supports-[backdrop-filter]:backdrop-blur-xl ${
          scrolled
            ? "glass border-b border-white/[0.1] shadow-[0_8px_40px_rgba(0,0,0,0.55)] py-2.5 bg-zinc-950/80"
            : "bg-zinc-950/60 border-b border-white/[0.06] py-3.5 sm:py-4"
        }`}
        aria-label="Navegacion principal"
      >
        <div className="max-w-[1200px] mx-auto px-5 sm:px-6 flex items-center justify-between">
          <a href="#hero" className="flex items-center gap-2 sm:gap-3 group min-w-0">
            <div className="relative">
              <div className="absolute inset-0 rounded-xl bg-[var(--accent)]/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
              <Image
                src="/ICONO.png"
                alt="Glow Up"
                width={48}
                height={48}
                className="relative h-11 w-11 sm:h-12 sm:w-12 rounded-full object-cover"
                priority
              />
            </div>
            <div className="flex flex-col leading-tight min-w-0">
              <span className="text-[13px] sm:text-[15px] font-bold tracking-wide font-[var(--font-display)]">
                <span className="text-brand-glow">Glow</span>{" "}
                <span className="text-brand-up">Up</span>
              </span>
              <span className="hidden min-[400px]:block text-[9px] sm:text-[10px] font-medium text-zinc-400 tracking-[0.16em] sm:tracking-[0.2em] uppercase truncate">
                Entornos Inteligentes
              </span>
            </div>
          </a>

          {/* Mobile: Servicios, Catalogo y menu hamburguesa */}
          <div className="flex lg:hidden items-center gap-0.5 sm:gap-1 shrink-0">
            <ul className="flex items-center gap-0.5 sm:gap-1">
              {mobileNavLinks.map((link) => (
                <li key={link.href}>
                  <NavLink
                    link={link}
                    isActive={activeSection === link.href.slice(1)}
                    compact
                  />
                </li>
              ))}
            </ul>
            <button
              className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl border border-white/[0.08] bg-white/[0.04] text-zinc-300 hover:text-white hover:border-[var(--accent)]/30 transition-all cursor-pointer"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Cerrar menu" : "Abrir menu"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>

          {/* Desktop links */}
          <ul className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <NavLink
                  link={link}
                  isActive={activeSection === link.href.slice(1)}
                />
              </li>
            ))}
            <li>
              <Link
                href="/cotizador"
                onClick={() => trackEvent("nav_click", { target: "cotizador" })}
                className="ml-1 px-3.5 py-2 text-sm font-medium rounded-lg text-[var(--accent-bright)] hover:bg-[var(--accent)]/10 transition-all flex items-center gap-1.5"
              >
                <Calculator size={14} />
                Cotizador
              </Link>
            </li>
            <li>
              <a
                href="#contacto"
                onClick={() => trackEvent("nav_click", { target: "contacto" })}
                className="ml-2 px-5 py-2.5 text-sm font-semibold text-zinc-950 rounded-xl bg-gradient-brand glow-cyan glow-cyan-hover transition-all hover:-translate-y-0.5"
              >
                Contacto
              </a>
            </li>
          </ul>
        </div>
      </nav>

      {/* Panel lateral — resto de enlaces en movil */}
      <div
        className={`fixed inset-0 z-[1090] lg:hidden transition-all duration-400 ${
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
              <Image
                src="/ICONO.png"
                alt="Glow Up"
                width={40}
                height={40}
                className="h-10 w-10 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-bold font-[var(--font-display)]">
                  <span className="text-brand-glow">Glow</span>{" "}
                  <span className="text-brand-up">Up</span>
                </p>
                <p className="text-[10px] text-zinc-500 tracking-widest uppercase">
                  Entornos Inteligentes
                </p>
              </div>
            </div>

            <nav className="flex flex-col gap-1.5 flex-1">
              {drawerNavLinks.map((link, i) => {
                const isActive = activeSection === link.href.slice(1);
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => {
                      trackEvent("nav_click", { target: link.href.slice(1) });
                      setMenuOpen(false);
                    }}
                    style={{ transitionDelay: menuOpen ? `${i * 40}ms` : "0ms" }}
                    className={`px-4 py-3.5 text-sm font-medium rounded-xl transition-all flex items-center gap-2 border ${
                      menuOpen ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"
                    } ${
                      isActive
                        ? "text-white bg-white/[0.06] border-white/[0.08]"
                        : "text-zinc-400 hover:text-white hover:bg-white/[0.04] border-transparent"
                    }`}
                  >
                    {link.label}
                  </a>
                );
              })}
            </nav>

            <Link
              href="/cotizador"
              onClick={() => {
                trackEvent("nav_click", { target: "cotizador" });
                setMenuOpen(false);
              }}
              className="mt-6 px-5 py-3.5 text-sm font-semibold text-center rounded-xl border border-[var(--accent)]/25 bg-[var(--accent)]/8 text-[var(--accent-bright)] flex items-center justify-center gap-2"
            >
              <Calculator size={16} />
              Simulador de Cotizacion
            </Link>

            <a
              href="#contacto"
              onClick={() => {
                trackEvent("nav_click", { target: "contacto" });
                setMenuOpen(false);
              }}
              className="mt-3 px-5 py-3.5 text-sm font-semibold text-zinc-950 text-center rounded-xl bg-gradient-brand glow-cyan"
            >
              Solicitar Cotizacion
            </a>
          </div>
        </div>
      </div>
    </>
  );
}