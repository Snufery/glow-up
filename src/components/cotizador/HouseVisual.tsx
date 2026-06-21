import Image from "next/image";
import { Home, Shield, Zap, Wifi } from "lucide-react";

const HOUSE_IMAGE =
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=80";

export default function HouseVisual() {
  const features = [
    { icon: Zap, label: "Iluminacion smart" },
    { icon: Shield, label: "Seguridad 24/7" },
    { icon: Wifi, label: "Control total" },
    { icon: Home, label: "Hogar conectado" },
  ];

  return (
    <div className="relative h-full min-h-[320px] lg:min-h-0 rounded-[var(--radius-xl)] overflow-hidden border border-white/[0.08]">
      <Image
        src={HOUSE_IMAGE}
        alt="Casa moderna inteligente"
        fill
        priority
        sizes="(max-width: 1024px) 100vw, 45vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-zinc-950/10" />
      <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/40 to-transparent" />

      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-[28%] left-[22%] w-3 h-3 rounded-full bg-[var(--accent)] animate-pulse shadow-[0_0_12px_var(--accent)]" />
        <div className="absolute top-[42%] right-[30%] w-2.5 h-2.5 rounded-full bg-[var(--accent-bright)] animate-pulse shadow-[0_0_10px_var(--accent-bright)]" style={{ animationDelay: "0.5s" }} />
        <div className="absolute bottom-[38%] left-[38%] w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
        <span className="section-badge mb-4">Arma tu proyecto</span>
        <h2 className="font-[var(--font-display)] text-2xl sm:text-3xl font-bold leading-tight mb-3">
          Disena el hogar inteligente
          <span className="block text-gradient mt-1">que imaginas</span>
        </h2>
        <p className="text-sm text-zinc-400 max-w-sm leading-relaxed mb-6">
          Selecciona productos, activa instalacion por articulo y ve tu inversion estimada en tiempo real.
        </p>

        <div className="grid grid-cols-2 gap-2.5">
          {features.map((f) => (
            <div
              key={f.label}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-zinc-950/60 backdrop-blur-md border border-white/[0.08]"
            >
              <f.icon size={14} className="text-[var(--accent)] flex-shrink-0" />
              <span className="text-[11px] font-medium text-zinc-300">{f.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}