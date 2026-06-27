"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useQuote } from "@/context/QuoteContext";
import { useHouse } from "@/context/HouseContext";
import { useCotizadorFlow } from "@/context/CotizadorFlowContext";
import type { QuoteDraftPayload } from "@/lib/db/quoteDrafts";

export function useQuoteDraftLoader() {
  const searchParams = useSearchParams();
  const token = searchParams.get("p");
  const { replaceItems } = useQuote();
  const { configureHouse, selectRoom } = useHouse();
  const { loadFlowState, hydrated: flowHydrated } = useCotizadorFlow();
  const loadedRef = useRef<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!token || !flowHydrated) return;
    if (loadedRef.current === token) return;

    let cancelled = false;

    async function loadDraft() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/cotizacion/draft/${encodeURIComponent(token!)}`);
        const data = (await res.json()) as {
          draft?: QuoteDraftPayload;
          error?: string;
        };

        if (!res.ok || !data.draft) {
          throw new Error(data.error ?? "No se pudo cargar el proyecto");
        }

        if (cancelled) return;

        replaceItems(data.draft.items);

        if (data.draft.house?.isConfigured && data.draft.house.counts) {
          configureHouse(data.draft.house.counts);
          if (data.draft.house.selectedRoomId) {
            selectRoom(data.draft.house.selectedRoomId);
          }
        }

        if (data.draft.flow) {
          loadFlowState({
            goal: data.draft.flow.goal,
            goalWizardDone: data.draft.flow.goalWizardDone ?? true,
            selectedPackageId: data.draft.flow.selectedPackageId,
            houseSkipped: data.draft.flow.houseSkipped ?? false,
            includesReviewed: false,
          });
        } else {
          loadFlowState({ goalWizardDone: true });
        }

        loadedRef.current = token!;
        setLoaded(true);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Error al cargar");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadDraft();

    return () => {
      cancelled = true;
    };
  }, [
    token,
    flowHydrated,
    replaceItems,
    configureHouse,
    selectRoom,
    loadFlowState,
  ]);

  return { loading, error, loaded, hasToken: Boolean(token) };
}