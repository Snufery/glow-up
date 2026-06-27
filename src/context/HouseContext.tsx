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
import {
  buildRoomsFromCounts,
  clampHouseCounts,
  DEFAULT_HOUSE_COUNTS,
  getTotalRoomCount,
  type HouseCounts,
  type HouseRoom,
} from "@/lib/houseLayout";

interface StoredHouseState {
  counts: HouseCounts;
  selectedRoomId: string | null;
}

interface HouseContextValue {
  hydrated: boolean;
  isConfigured: boolean;
  counts: HouseCounts;
  rooms: HouseRoom[];
  selectedRoomId: string | null;
  selectedRoom: HouseRoom | null;
  configureHouse: (counts: HouseCounts) => void;
  selectRoom: (roomId: string | null) => void;
  resetHouse: () => void;
}

const HouseContext = createContext<HouseContextValue | null>(null);
const STORAGE_KEY = "glowup-house-v1";

function loadStoredHouse(): StoredHouseState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredHouseState;
    if (!parsed.counts || getTotalRoomCount(parsed.counts) < 1) return null;
    return {
      counts: clampHouseCounts(parsed.counts),
      selectedRoomId: parsed.selectedRoomId ?? null,
    };
  } catch {
    return null;
  }
}

export function HouseProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [counts, setCounts] = useState<HouseCounts>(DEFAULT_HOUSE_COUNTS);
  const [isConfigured, setIsConfigured] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

  useEffect(() => {
    const stored = loadStoredHouse();
    if (stored) {
      setCounts(stored.counts);
      setIsConfigured(true);
      setSelectedRoomId(stored.selectedRoomId);
    }
    setHydrated(true);
  }, []);

  const rooms = useMemo(
    () => (isConfigured ? buildRoomsFromCounts(counts) : []),
    [isConfigured, counts]
  );

  const selectedRoom = useMemo(
    () => rooms.find((room) => room.id === selectedRoomId) ?? null,
    [rooms, selectedRoomId]
  );

  useEffect(() => {
    if (!hydrated || !isConfigured) return;
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ counts, selectedRoomId } satisfies StoredHouseState)
    );
  }, [counts, selectedRoomId, isConfigured, hydrated]);

  useEffect(() => {
    if (!selectedRoomId) return;
    if (!rooms.some((room) => room.id === selectedRoomId)) {
      setSelectedRoomId(rooms[0]?.id ?? null);
    }
  }, [rooms, selectedRoomId]);

  const configureHouse = useCallback((nextCounts: HouseCounts) => {
    const safeCounts = clampHouseCounts(nextCounts);
    if (getTotalRoomCount(safeCounts) < 1) return;

    setCounts(safeCounts);
    setIsConfigured(true);
    const nextRooms = buildRoomsFromCounts(safeCounts);
    setSelectedRoomId(nextRooms[0]?.id ?? null);
  }, []);

  const selectRoom = useCallback((roomId: string | null) => {
    setSelectedRoomId(roomId);
  }, []);

  const resetHouse = useCallback(() => {
    setIsConfigured(false);
    setSelectedRoomId(null);
    setCounts(DEFAULT_HOUSE_COUNTS);
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const value = useMemo(
    () => ({
      hydrated,
      isConfigured,
      counts,
      rooms,
      selectedRoomId,
      selectedRoom,
      configureHouse,
      selectRoom,
      resetHouse,
    }),
    [
      hydrated,
      isConfigured,
      counts,
      rooms,
      selectedRoomId,
      selectedRoom,
      configureHouse,
      selectRoom,
      resetHouse,
    ]
  );

  return <HouseContext.Provider value={value}>{children}</HouseContext.Provider>;
}

export function useHouse() {
  const ctx = useContext(HouseContext);
  if (!ctx) throw new Error("useHouse must be used within HouseProvider");
  return ctx;
}

export function useHouseOptional() {
  return useContext(HouseContext);
}