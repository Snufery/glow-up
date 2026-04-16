import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[var(--bg-primary)] border-t border-[var(--border)] pt-16">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr] gap-12 pb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Image src="/logo.png" alt="Glow Up" width={48} height={48} className="h-12 w-12 object-contain" />
              <div className="flex flex-col leading-tight">
                <span className="text-base font-bold tracking-wide"><span className="text-[#92bc51]">Glow</span> <span className="text-[#048f8c]">Up</span></span>
                <span className="text-[11px] font-medium text-white tracking-widest uppercase">Entornos Inteligentes</span>
              </div>
            </div>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-xs">
              Transformamos espacios convencionales en entornos inteligentes, seguros y eficientes.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-5">Navegacion</h4>
            {["Inicio:#hero", "Nosotros:#nosotros", "Servicios:#servicios", "Catalogo:#catalogo", "Contacto:#contacto"].map((link) => {
              const [label, href] = link.split(":");
              return (
                <a key={label} href={href} className="block text-sm text-[var(--text-muted)] py-1.5 transition-all hover:text-[var(--green)] hover:translate-x-1">
                  {label}
                </a>
              );
            })}
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-5">Servicios</h4>
            {["Domotica", "Instalaciones Electricas", "Seguridad", "Redes"].map((s) => (
              <a key={s} href="#servicios" className="block text-sm text-[var(--text-muted)] py-1.5 transition-all hover:text-[var(--green)] hover:translate-x-1">
                {s}
              </a>
            ))}
          </div>
        </div>

        <div className="border-t border-[var(--border)] py-6 text-center">
          <p className="text-xs text-[var(--text-muted)]">
            &copy; 2026 Glow Up Entornos Inteligentes. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
