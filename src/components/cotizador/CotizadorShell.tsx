"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import CotizadorNav from "@/components/cotizador/CotizadorNav";
import ProductPicker from "@/components/cotizador/ProductPicker";
import QuotePanel from "@/components/cotizador/QuotePanel";
import MobileCartSheet from "@/components/cotizador/MobileCartSheet";
import GoalWizard from "@/components/cotizador/GoalWizard";
import PackageSuggestions from "@/components/cotizador/PackageSuggestions";
import CotizadorProgressBar from "@/components/cotizador/CotizadorProgressBar";
import QuoteDraftBar from "@/components/cotizador/QuoteDraftBar";
import QuoteIntelligenceBar from "@/components/cotizador/QuoteIntelligenceBar";
import HouseSetupWizard from "@/components/cotizador/HouseSetupWizard";
import { useCotizadorFlow } from "@/context/CotizadorFlowContext";
import { useHouse } from "@/context/HouseContext";
import { useQuoteDraftLoader } from "@/hooks/useQuoteDraftLoader";
import type { QuoteGoal } from "@/data/quotePackages";

function CotizadorShellInner() {
  const flow = useCotizadorFlow();
  const { hydrated: houseHydrated, isConfigured, resetHouse } = useHouse();
  const searchParams = useSearchParams();
  const hasShareToken = Boolean(searchParams.get("p"));
  const draftState = useQuoteDraftLoader();
  const [pendingGoal, setPendingGoal] = useState<QuoteGoal | null>(null);
  const [editingSpaces, setEditingSpaces] = useState(false);

  useEffect(() => {
    if (isConfigured) setEditingSpaces(false);
  }, [isConfigured]);

  const waitingForDraft = hasShareToken && draftState.loading;

  const showGoalWizard =
    flow.hydrated &&
    !flow.goalWizardDone &&
    !pendingGoal &&
    !waitingForDraft;

  const showPackageSuggestions = Boolean(pendingGoal);

  const showHouseSetup =
    flow.goalWizardDone &&
    houseHydrated &&
    (!isConfigured || editingSpaces) &&
    !flow.houseSkipped;

  const handleEditSpaces = () => {
    const ok = window.confirm(
      "¿Editar los espacios? Los productos ya agregados conservarán su zona asignada."
    );
    if (!ok) return;
    resetHouse();
    setEditingSpaces(true);
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(43,188,179,0.1),transparent)] pointer-events-none" />
      <div className="absolute inset-0 opacity-20 pointer-events-none noise-overlay" />

      <CotizadorNav />

      {showGoalWizard && (
        <GoalWizard onGoalSelected={(goal) => setPendingGoal(goal)} />
      )}

      {showPackageSuggestions && pendingGoal && (
        <PackageSuggestions
          goal={pendingGoal}
          onClose={() => setPendingGoal(null)}
        />
      )}

      <main className="relative max-w-[1200px] mx-auto px-5 sm:px-8 pt-[88px] pb-28 xl:pb-10">
        {hasShareToken && draftState.loading && (
          <div className="mb-4 flex items-center gap-2 text-sm text-zinc-400">
            <Loader2 size={16} className="animate-spin text-[var(--accent)]" />
            Cargando proyecto guardado...
          </div>
        )}
        {hasShareToken && draftState.error && (
          <div className="mb-4 px-4 py-3 rounded-xl border border-amber-500/30 bg-amber-500/10 text-sm text-amber-200">
            {draftState.error}
          </div>
        )}

        {flow.goalWizardDone && <CotizadorProgressBar />}

        {showHouseSetup ? (
          <div className="glass rounded-[var(--radius-xl)] border border-white/[0.08]">
            <HouseSetupWizard variant="step" />
          </div>
        ) : flow.goalWizardDone ? (
          <div className="flex flex-col gap-6">
            <QuoteDraftBar />
            <QuoteIntelligenceBar />

            <div className="grid grid-cols-1 xl:grid-cols-[1fr_minmax(320px,380px)] gap-6 lg:gap-8">
              <div className="glass rounded-[var(--radius-xl)] p-5 sm:p-6">
                <ProductPicker onEditSpaces={isConfigured ? handleEditSpaces : undefined} />
              </div>

              <div className="hidden xl:block xl:sticky xl:top-[88px] xl:self-start">
                <QuotePanel />
              </div>
            </div>
          </div>
        ) : null}
      </main>

      <MobileCartSheet />
    </div>
  );
}

export default function CotizadorShell() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
          <Loader2 size={32} className="animate-spin text-[var(--accent)]" />
        </div>
      }
    >
      <CotizadorShellInner />
    </Suspense>
  );
}