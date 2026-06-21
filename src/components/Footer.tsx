import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

export default function Footer() {
  const navLinks = [
    { label: "Inicio", href: "#hero" },
    { label: "Nosotros", href: "#nosotros" },
    { label: "Servicios", href: "#servicios" },
    { label: "Catalogo", href: "#catalogo" },
    { label: "Contacto", href: "#contacto" },
  ];

  const serviceLinks = ["Domotica", "Instalaciones Electricas", "Seguridad", "Redes"];

  return (
    <footer className="relative bg-zinc-950 border-t border-white/[0.06] pt-20">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)]/30 to-transparent" />

      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr] gap-12 pb-14">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <Image src="/logo.png" alt="Glow Up" width={44} height={44} className="h-11 w-11 object-contain" />
              <div className="flex flex-col leading-tight">
                <span className="text-[15px] font-bold tracking-wide font-[var(--font-display)]">
                  <span className="text-[var(--accent-bright)]">Glow</span>{" "}
                  <span className="text-[var(--accent)]">Up</span>
                </span>
                <span className="text-[10px] font-medium text-zinc-500 tracking-[0.2em] uppercase">
                  Entornos Inteligentes
                </span>
              </div>
            </div>
            <p className="text-sm text-zinc-500 leading-relaxed max-w-xs">
              Transformamos espacios convencionales en entornos inteligentes, seguros y eficientes.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-5 text-zinc-300">Navegacion</h4>
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="group flex items-center gap-1 text-sm text-zinc-500 py-2 transition-all hover:text-[var(--accent)]"
              >
                {link.label}
                <ArrowUpRight size={12} className="opacity-0 -translate-y-0.5 group-hover:opacity-100 transition-all" />
              </a>
            ))}
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-5 text-zinc-300">Servicios</h4>
            {serviceLinks.map((s) => (
              <a
                key={s}
                href="#servicios"
                className="group flex items-center gap-1 text-sm text-zinc-500 py-2 transition-all hover:text-[var(--accent)]"
              >
                {s}
                <ArrowUpRight size={12} className="opacity-0 -translate-y-0.5 group-hover:opacity-100 transition-all" />
              </a>
            ))}
          </div>
        </div>

        <div className="border-t border-white/[0.06] py-7 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-zinc-600">
            &copy; 2026 Glow Up Entornos Inteligentes. Todos los derechos reservados.
          </p>
          <p className="text-xs text-zinc-600">
            Popayan, Cauca &mdash; Colombia
          </p>
        </div>
      </div>
    </footer>
  );
}