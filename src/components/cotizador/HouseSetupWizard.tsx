"use client";

import { useState } from "react";
import { Minus, Plus, ArrowRight, Home } from "lucide-react";
import {
  DEFAULT_HOUSE_COUNTS,
  getTotalRoomCount,
  HOUSE_COUNT_LIMITS,
  ROOM_TYPE_META,
  type HouseCounts,
  type RoomType,
} from "@/lib/houseLayout";
import { HOUSE_PRESETS } from "@/data/housePresets";
import { useHouse } from "@/context/HouseContext";
import { useCotizadorFlowOptional } from "@/context/CotizadorFlowContext";

const WIZARD_FIELDS: Array<{ key: keyof HouseCounts; type: RoomType }> = [
  { key: "habitaciones", type: "habitacion" },
  { key: "salas", type: "sala" },
  { key: "banos", type: "bano" },
  { key: "cocina", type: "cocina" },
  { key: "comedor", type: "comedor" },
  { key: "patios", type: "patio" },
  { key: "balcones", type: "balcon" },
];

interface HouseSetupWizardProps {
  variant?: "step" | "inline";
}

export default function HouseSetupWizard({ variant = "step" }: HouseSetupWizardProps) {
  const { configureHouse } = useHouse();
  const flow = useCotizadorFlowOptional();
  const [draft, setDraft] = useState<HouseCounts>(DEFAULT_HOUSE_COUNTS);
  const [activePreset, setActivePreset] = useState<string | null>(null);

  const totalRooms = getTotalRoomCount(draft);

  const adjust = (key: keyof HouseCounts, delta: number) => {
    setActivePreset(null);
    const { min, max } = HOUSE_COUNT_LIMITS[key];
    setDraft((prev) => ({
      ...prev,
      [key]: Math.min(max, Math.max(min, prev[key] + delta)),
    }));
  };

  const applyPreset = (presetId: string) => {
    const preset = HOUSE_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    setDraft(preset.counts);
    setActivePreset(presetId);
  };

  const handleContinue = () => {
    if (totalRooms < 1) return;
    configureHouse(draft);
    flow?.unskipHouse();
  };

  const isStep = variant === "step";

  return (
    <div className={isStep ? "p-5 sm:p-8" : "p-4 sm:p-5"}>
      <div className={isStep ? "mb-6" : "mb-4"}>
        <span className="section-badge mb-3">Paso 2 · Tu hogar</span>
        <h2
          className={`font-[var(--font-display)] font-bold leading-tight mb-2 ${
            isStep ? "text-2xl sm:text-3xl" : "text-xl"
          }`}
        >
          ¿Cuántos espacios tiene
          <span className="block text-gradient mt-1">tu vivienda?</span>
        </h2>
        <p className="text-sm text-zinc-400 max-w-xl leading-relaxed">
          Define las zonas de tu hogar para recibir sugerencias por habitación y
          organizar tu cotización. Sin modelos 3D — solo selección rápida por área.
        </p>
      </div>

      <div className="mb-5">
        <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-2">
          Perfiles rápidos
        </p>
        <div className="flex flex-wrap gap-2">
          {HOUSE_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => applyPreset(preset.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                activePreset === preset.id
                  ? "bg-[var(--accent)]/15 border-[var(--accent)]/40 text-[var(--accent-bright)]"
                  : "border-white/[0.08] text-zinc-400 hover:border-[var(--accent)]/25 hover:text-white"
              }`}
            >
              <Home size={12} className="inline mr-1.5 -mt-0.5" />
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-5">
        {WIZARD_FIELDS.map(({ key, type }) => {
          const meta = ROOM_TYPE_META[type];
          const Icon = meta.icon;
          const value = draft[key];
          const { min, max } = HOUSE_COUNT_LIMITS[key];

          return (
            <div
              key={key}
              className="flex items-center justify-between gap-3 px-3.5 py-3 rounded-xl bg-zinc-950/50 border border-white/[0.08]"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-[var(--accent)]/10 border border-[var(--accent)]/20 flex items-center justify-center text-[var(--accent-bright)] shrink-0">
                  <Icon size={14} />
                </div>
                <p className="text-sm font-semibold truncate">{meta.label}</p>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => adjust(key, -1)}
                  disabled={value <= min}
                  className="w-7 h-7 rounded-lg border border-white/[0.08] flex items-center justify-center text-zinc-400 hover:text-white disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                  aria-label={`Menos ${meta.label}`}
                >
                  <Minus size={12} />
                </button>
                <span className="w-5 text-center text-sm font-bold tabular-nums">{value}</span>
                <button
                  type="button"
                  onClick={() => adjust(key, 1)}
                  disabled={value >= max}
                  className="w-7 h-7 rounded-lg border border-white/[0.08] flex items-center justify-center text-zinc-400 hover:text-white disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                  aria-label={`Más ${meta.label}`}
                >
                  <Plus size={12} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <button
          type="button"
          onClick={handleContinue}
          disabled={totalRooms < 1}
          className="btn-primary flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continuar al catálogo
          <ArrowRight size={16} />
        </button>
        {flow?.goalWizardDone && (
          <button
            type="button"
            onClick={() => flow.skipHouse()}
            className="text-sm font-semibold text-zinc-500 hover:text-[var(--accent)] transition-colors cursor-pointer"
          >
            Saltar por ahora
          </button>
        )}
        <p className="text-xs text-zinc-500 sm:ml-auto">
          {totalRooms} espacio{totalRooms !== 1 ? "s" : ""}
        </p>
      </div>
    </div>
  );
}