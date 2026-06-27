"use client";

import { Check } from "lucide-react";
import {
  COTIZADOR_STEPS,
  computeCurrentStep,
  useCotizadorFlow,
  type CotizadorStep,
} from "@/context/CotizadorFlowContext";
import { useHouse } from "@/context/HouseContext";
import { useQuote } from "@/context/QuoteContext";

export default function CotizadorProgressBar() {
  const flow = useCotizadorFlow();
  const { isConfigured } = useHouse();
  const { items } = useQuote();

  if (!flow.hydrated || !flow.goalWizardDone) return null;

  const currentStep = computeCurrentStep({
    goalWizardDone: flow.goalWizardDone,
    houseConfigured: isConfigured,
    houseSkipped: flow.houseSkipped,
    itemCount: items.length,
    includesReviewed: flow.includesReviewed,
  });

  const currentIndex = COTIZADOR_STEPS.findIndex((s) => s.id === currentStep);

  return (
    <div className="mb-6 sm:mb-8">
      <div className="flex items-center justify-between gap-1 sm:gap-2">
        {COTIZADOR_STEPS.map((step, index) => {
          const isDone = index < currentIndex;
          const isActive = step.id === currentStep;
          const isFuture = index > currentIndex;

          return (
            <div key={step.id} className="flex-1 flex items-center min-w-0">
              <StepPill
                label={step.label}
                isDone={isDone}
                isActive={isActive}
                isFuture={isFuture}
                stepNumber={index + 1}
              />
              {index < COTIZADOR_STEPS.length - 1 && (
                <div
                  className={`hidden sm:block h-px flex-1 mx-1 transition-colors ${
                    isDone ? "bg-[var(--accent)]/50" : "bg-white/[0.08]"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StepPill({
  label,
  isDone,
  isActive,
  isFuture,
  stepNumber,
}: {
  label: string;
  isDone: boolean;
  isActive: boolean;
  isFuture: boolean;
  stepNumber: number;
}) {
  return (
    <div
      className={`flex flex-col items-center gap-1.5 min-w-0 flex-shrink-0 ${
        isFuture ? "opacity-50" : ""
      }`}
    >
      <div
        className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs font-bold border transition-all ${
          isDone
            ? "bg-[var(--accent)]/20 border-[var(--accent)]/40 text-[var(--accent)]"
            : isActive
              ? "bg-gradient-brand border-transparent text-zinc-950 glow-cyan"
              : "bg-white/[0.04] border-white/[0.08] text-zinc-500"
        }`}
      >
        {isDone ? <Check size={14} /> : stepNumber}
      </div>
      <span
        className={`text-[9px] sm:text-[10px] font-semibold uppercase tracking-wide truncate max-w-[56px] sm:max-w-none text-center ${
          isActive ? "text-[var(--accent-bright)]" : "text-zinc-500"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

export function useCotizadorCurrentStep(): CotizadorStep {
  const flow = useCotizadorFlow();
  const { isConfigured } = useHouse();
  const { items } = useQuote();

  return computeCurrentStep({
    goalWizardDone: flow.goalWizardDone,
    houseConfigured: isConfigured,
    houseSkipped: flow.houseSkipped,
    itemCount: items.length,
    includesReviewed: flow.includesReviewed,
  });
}