import Link from "next/link";
import { ArrowLeft, History } from "lucide-react";
import QuoteHistoryList from "@/components/admin/QuoteHistoryList";

export default function AdminCotizacionesHistorialPage() {
  return (
    <div className="max-w-4xl">
      <Link
        href="/admin/cotizaciones"
        className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-[var(--accent-bright)] transition-colors mb-4"
      >
        <ArrowLeft size={14} />
        Volver al generador
      </Link>

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <History size={20} className="text-[var(--accent)]" />
          <h1 className="font-[var(--font-display)] text-xl sm:text-2xl font-bold">
            Historial de cotizaciones
          </h1>
        </div>
        <p className="text-sm text-zinc-500">
          Consulta cotizaciones guardadas, descarga PDFs y convierte a factura.
        </p>
      </div>

      <QuoteHistoryList />
    </div>
  );
}