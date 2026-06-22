import Link from "next/link";
import { FileText, Receipt, Shield } from "lucide-react";

export default function AdminDashboardPage() {
  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <p className="section-badge mb-3">Area privada</p>
        <h1 className="font-[var(--font-display)] text-2xl sm:text-3xl font-bold mb-2">
          Panel de administracion
        </h1>
        <p className="text-sm text-zinc-400 leading-relaxed">
          Gestiona cotizaciones y facturas de Glow Up. Esta seccion no aparece en el menu
          publico y solo es accesible con tu contrasena de administrador.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <Link
          href="/admin/cotizaciones"
          className="premium-card p-6 hover:border-[var(--accent)]/25 transition-all group"
        >
          <FileText size={24} className="text-[var(--accent)] mb-4" />
          <h2 className="font-[var(--font-display)] font-bold mb-1 group-hover:text-[var(--accent-bright)] transition-colors">
            Cotizaciones
          </h2>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Crea cotizaciones internas con catalogo, PDF y envio por WhatsApp.
          </p>
        </Link>

        <Link
          href="/admin/facturas"
          className="premium-card p-6 hover:border-[var(--accent)]/25 transition-all group"
        >
          <Receipt size={24} className="text-[var(--accent)] mb-4" />
          <h2 className="font-[var(--font-display)] font-bold mb-1 group-hover:text-[var(--accent-bright)] transition-colors">
            Facturas
          </h2>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Genera facturas con datos del cliente, items y descarga en PDF.
          </p>
        </Link>
      </div>

      <div className="glass rounded-2xl p-5 flex gap-3 border border-[var(--accent)]/15">
        <Shield size={18} className="text-[var(--accent)] flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold mb-1">Seguridad</p>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Entra desde <code className="text-zinc-400">/admin/login</code>. Configura{" "}
            <code className="text-zinc-400">ADMIN_PASSWORD</code> y{" "}
            <code className="text-zinc-400">ADMIN_SESSION_SECRET</code> en las variables de
            entorno de Vercel. No enlaces esta area desde la web publica.
          </p>
        </div>
      </div>
    </div>
  );
}