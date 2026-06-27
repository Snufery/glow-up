"use client";

import { Shield, Sofa, Zap, Sparkles } from "lucide-react";
import { QUOTE_GOALS, type QuoteGoal } from "@/data/quotePackages";
import { useCotizadorFlow } from "@/context/CotizadorFlowContext";

const GOAL_ICONS: Record<QuoteGoal, typeof Shield> = {
  seguridad: Shield,
  confort: Sofa,
  ahorro: Zap,
  completo: Sparkles,
};

interface GoalWizardProps {
  onGoalSelected: (goal: QuoteGoal) => void;
}

export default function GoalWizard({ onGoalSelected }: GoalWizardProps) {
  const { setGoal } = useCotizadorFlow();

  const handleSelect = (goal: QuoteGoal) => {
    setGoal(goal);
    onGoalSelected(goal);
  };

  return (
    <div className="fixed inset-0 z-[900] flex items-center justify-center p-4 sm:p-8 bg-zinc-950/95 backdrop-blur-md">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(43,188,179,0.15),transparent)] pointer-events-none" />

      <div className="relative w-full max-w-3xl">
        <div className="text-center mb-8 sm:mb-10">
          <span className="section-badge mb-4">Paso 1 · Objetivo</span>
          <h1 className="font-[var(--font-display)] text-2xl sm:text-4xl font-bold leading-tight mb-3">
            ¿Qué quieres lograr
            <span className="block text-gradient mt-1">con tu hogar inteligente?</span>
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 max-w-lg mx-auto leading-relaxed">
            Elige tu prioridad y te sugeriremos un paquete de productos para empezar.
            Siempre podrás ajustar el carrito después.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {QUOTE_GOALS.map((goal) => {
            const Icon = GOAL_ICONS[goal.id];
            return (
              <button
                key={goal.id}
                type="button"
                onClick={() => handleSelect(goal.id)}
                className="group premium-card p-5 sm:p-6 text-left transition-all hover:border-[var(--accent)]/40 hover:-translate-y-0.5 cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[var(--accent)]/10 border border-[var(--accent)]/25 flex items-center justify-center text-[var(--accent)] group-hover:bg-[var(--accent)]/20 transition-colors flex-shrink-0">
                    <Icon size={22} />
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-[var(--font-display)] text-lg font-bold mb-1">
                      {goal.label}
                    </h2>
                    <p className="text-sm text-zinc-500 leading-relaxed">
                      {goal.subtitle}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}