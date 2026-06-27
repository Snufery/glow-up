"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { QuoteGoal } from "@/data/quotePackages";

export type { QuoteGoal };

export type CotizadorStep =
  | "objetivo"
  | "casa"
  | "productos"
  | "resumen"
  | "enviar";

export interface CotizadorFlowState {
  goal: QuoteGoal | null;
  goalWizardDone: boolean;
  selectedPackageId: string | null;
  houseSkipped: boolean;
  includesReviewed: boolean;
}

interface CotizadorFlowContextValue extends CotizadorFlowState {
  hydrated: boolean;
  setGoal: (goal: QuoteGoal) => void;
  completeGoalWizard: (packageId?: string | null) => void;
  skipHouse: () => void;
  unskipHouse: () => void;
  markIncludesReviewed: () => void;
  resetIncludesReviewed: () => void;
  resetFlow: () => void;
  loadFlowState: (state: Partial<CotizadorFlowState>) => void;
  getStepIndex: (step: CotizadorStep) => number;
}

const STORAGE_KEY = "glowup-cotizador-flow-v1";

const DEFAULT_STATE: CotizadorFlowState = {
  goal: null,
  goalWizardDone: false,
  selectedPackageId: null,
  houseSkipped: false,
  includesReviewed: false,
};

export const COTIZADOR_STEPS: Array<{ id: CotizadorStep; label: string }> = [
  { id: "objetivo", label: "Objetivo" },
  { id: "casa", label: "Casa" },
  { id: "productos", label: "Productos" },
  { id: "resumen", label: "Resumen" },
  { id: "enviar", label: "Enviar" },
];

function loadStoredFlow(): CotizadorFlowState {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    return { ...DEFAULT_STATE, ...(JSON.parse(raw) as CotizadorFlowState) };
  } catch {
    return DEFAULT_STATE;
  }
}

const CotizadorFlowContext = createContext<CotizadorFlowContextValue | null>(
  null
);

export function CotizadorFlowProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CotizadorFlowState>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(loadStoredFlow());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, hydrated]);

  const setGoal = useCallback((goal: QuoteGoal) => {
    setState((prev) => ({ ...prev, goal }));
  }, []);

  const completeGoalWizard = useCallback((packageId?: string | null) => {
    setState((prev) => ({
      ...prev,
      goalWizardDone: true,
      selectedPackageId: packageId ?? prev.selectedPackageId,
    }));
  }, []);

  const skipHouse = useCallback(() => {
    setState((prev) => ({ ...prev, houseSkipped: true }));
  }, []);

  const unskipHouse = useCallback(() => {
    setState((prev) => ({ ...prev, houseSkipped: false }));
  }, []);

  const markIncludesReviewed = useCallback(() => {
    setState((prev) => ({ ...prev, includesReviewed: true }));
  }, []);

  const resetIncludesReviewed = useCallback(() => {
    setState((prev) => ({ ...prev, includesReviewed: false }));
  }, []);

  const resetFlow = useCallback(() => {
    setState(DEFAULT_STATE);
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const loadFlowState = useCallback((partial: Partial<CotizadorFlowState>) => {
    setState((prev) => ({ ...prev, ...partial }));
  }, []);

  const getStepIndex = useCallback((step: CotizadorStep) => {
    return COTIZADOR_STEPS.findIndex((s) => s.id === step);
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      hydrated,
      setGoal,
      completeGoalWizard,
      skipHouse,
      unskipHouse,
      markIncludesReviewed,
      resetIncludesReviewed,
      resetFlow,
      loadFlowState,
      getStepIndex,
    }),
    [
      state,
      hydrated,
      setGoal,
      completeGoalWizard,
      skipHouse,
      unskipHouse,
      markIncludesReviewed,
      resetIncludesReviewed,
      resetFlow,
      loadFlowState,
      getStepIndex,
    ]
  );

  return (
    <CotizadorFlowContext.Provider value={value}>
      {children}
    </CotizadorFlowContext.Provider>
  );
}

export function useCotizadorFlow() {
  const ctx = useContext(CotizadorFlowContext);
  if (!ctx) {
    throw new Error(
      "useCotizadorFlow must be used within CotizadorFlowProvider"
    );
  }
  return ctx;
}

export function useCotizadorFlowOptional() {
  return useContext(CotizadorFlowContext);
}

export function computeCurrentStep(input: {
  goalWizardDone: boolean;
  houseConfigured: boolean;
  houseSkipped: boolean;
  itemCount: number;
  includesReviewed: boolean;
}): CotizadorStep {
  if (!input.goalWizardDone) return "objetivo";
  if (!input.houseConfigured && !input.houseSkipped) return "casa";
  if (input.itemCount === 0) return "productos";
  if (!input.includesReviewed) return "resumen";
  return "enviar";
}