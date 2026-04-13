import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[var(--bg-primary)] border-t border-[var(--border)] pt-16">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr] gap-12 pb-12">
          <div>
            <Image src="/logo.jpg" alt="Glow Up" width={140} height={40} className="h-10 w-auto mb-4" />
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
