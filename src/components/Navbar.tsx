"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Calculator } from "lucide-react";

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

          {/* Mobile links — mismo estilo que desktop, solo Servicios y Catalogo */}
          <ul className="flex lg:hidden items-center gap-0.5 sm:gap-1 shrink-0">
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
                className="ml-1 px-3.5 py-2 text-sm font-medium rounded-lg text-[var(--accent-bright)] hover:bg-[var(--accent)]/10 transition-all flex items-center gap-1.5"
              >
                <Calculator size={14} />
                Cotizador
              </Link>
            </li>
            <li>
              <a
                href="#contacto"
                className="ml-2 px-5 py-2.5 text-sm font-semibold text-zinc-950 rounded-xl bg-gradient-brand glow-cyan glow-cyan-hover transition-all hover:-translate-y-0.5"
              >
                Contacto
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}