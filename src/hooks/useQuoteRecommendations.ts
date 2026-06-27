"use client";

import { useMemo } from "react";
import { useQuote } from "@/context/QuoteContext";
import { useHouseOptional } from "@/context/HouseContext";
import { useCotizadorFlowOptional } from "@/context/CotizadorFlowContext";
import {
  calcQuotePriceRange,
  getAccessoryRecommendations,
  getCompatibilityWarnings,
  getRoomRecommendations,
  getSceneSuggestions,
} from "@/lib/quoteRecommendations";

export function useQuoteRecommendations() {
  const { items } = useQuote();
  const house = useHouseOptional();
  const isConfigured = house?.isConfigured ?? false;
  const rooms = house?.rooms ?? [];
  const selectedRoom = house?.selectedRoom ?? null;
  const flow = useCotizadorFlowOptional();
  const goal = flow?.goal ?? null;

  return useMemo(() => {
    const roomRecs = isConfigured
      ? getRoomRecommendations(rooms, items, selectedRoom, goal)
      : [];

    const accessories = getAccessoryRecommendations(items);
    const warnings = getCompatibilityWarnings(items);
    const scenes = getSceneSuggestions(items, goal);
    const priceRange = items.length > 0 ? calcQuotePriceRange(items) : null;

    const requiredMissing = accessories.filter((a) => a.required);
    const hasBlockingIssues = warnings.some((w) => w.severity === "error");

    return {
      roomRecs,
      accessories,
      warnings,
      scenes,
      priceRange,
      requiredMissing,
      hasBlockingIssues,
      hasRecommendations:
        roomRecs.length > 0 ||
        accessories.length > 0 ||
        warnings.length > 0 ||
        scenes.length > 0,
    };
  }, [items, isConfigured, rooms, selectedRoom, goal]);
}