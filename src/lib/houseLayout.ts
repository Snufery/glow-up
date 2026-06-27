import type { LucideIcon } from "lucide-react";
import {
  Bed,
  Sofa,
  Bath,
  TreePine,
  PanelTop,
  CookingPot,
  UtensilsCrossed,
} from "lucide-react";

export type RoomType =
  | "cocina"
  | "comedor"
  | "sala"
  | "habitacion"
  | "bano"
  | "patio"
  | "balcon";

export interface HouseCounts {
  habitaciones: number;
  salas: number;
  banos: number;
  patios: number;
  balcones: number;
  cocina: number;
  comedor: number;
}

export interface HouseRoom {
  id: string;
  type: RoomType;
  label: string;
  zone: "social" | "privada" | "servicios" | "exterior";
}

export const DEFAULT_HOUSE_COUNTS: HouseCounts = {
  habitaciones: 3,
  salas: 1,
  banos: 2,
  patios: 1,
  balcones: 0,
  cocina: 1,
  comedor: 1,
};

export const HOUSE_COUNT_LIMITS: Record<keyof HouseCounts, { min: number; max: number }> = {
  habitaciones: { min: 0, max: 8 },
  salas: { min: 0, max: 4 },
  banos: { min: 0, max: 6 },
  patios: { min: 0, max: 3 },
  balcones: { min: 0, max: 4 },
  cocina: { min: 0, max: 2 },
  comedor: { min: 0, max: 2 },
};

export const ROOM_TYPE_META: Record<
  RoomType,
  { label: string; singular: string; icon: LucideIcon; zone: HouseRoom["zone"] }
> = {
  cocina: { label: "Cocinas", singular: "Cocina", icon: CookingPot, zone: "social" },
  comedor: { label: "Comedores", singular: "Comedor", icon: UtensilsCrossed, zone: "social" },
  sala: { label: "Salas", singular: "Sala", icon: Sofa, zone: "social" },
  habitacion: { label: "Habitaciones", singular: "Habitación", icon: Bed, zone: "privada" },
  bano: { label: "Baños", singular: "Baño", icon: Bath, zone: "servicios" },
  patio: { label: "Patios", singular: "Patio", icon: TreePine, zone: "exterior" },
  balcon: { label: "Balcones", singular: "Balcón", icon: PanelTop, zone: "exterior" },
};

const ROOM_BUILD_ORDER: Array<{ key: keyof HouseCounts; type: RoomType }> = [
  { key: "cocina", type: "cocina" },
  { key: "comedor", type: "comedor" },
  { key: "salas", type: "sala" },
  { key: "habitaciones", type: "habitacion" },
  { key: "banos", type: "bano" },
  { key: "patios", type: "patio" },
  { key: "balcones", type: "balcon" },
];

export function clampHouseCounts(counts: HouseCounts): HouseCounts {
  const result = { ...counts };
  for (const key of Object.keys(HOUSE_COUNT_LIMITS) as Array<keyof HouseCounts>) {
    const { min, max } = HOUSE_COUNT_LIMITS[key];
    result[key] = Math.min(max, Math.max(min, Math.floor(result[key] ?? 0)));
  }
  return result;
}

export function getTotalRoomCount(counts: HouseCounts): number {
  return Object.values(clampHouseCounts(counts)).reduce((sum, n) => sum + n, 0);
}

export function buildRoomsFromCounts(rawCounts: HouseCounts): HouseRoom[] {
  const counts = clampHouseCounts(rawCounts);
  const rooms: HouseRoom[] = [];

  for (const { key, type } of ROOM_BUILD_ORDER) {
    const total = counts[key];
    const meta = ROOM_TYPE_META[type];

    for (let index = 1; index <= total; index += 1) {
      const label = total === 1 ? meta.singular : `${meta.singular} ${index}`;
      rooms.push({
        id: `${type}-${index}`,
        type,
        label,
        zone: meta.zone,
      });
    }
  }

  return rooms;
}

export const ZONE_LABELS: Record<HouseRoom["zone"], string> = {
  social: "Zona social",
  privada: "Habitaciones",
  servicios: "Baños",
  exterior: "Exterior",
};

export const ZONE_ORDER: HouseRoom["zone"][] = [
  "social",
  "privada",
  "servicios",
  "exterior",
];

export function groupRoomsByZone(rooms: HouseRoom[]): Record<HouseRoom["zone"], HouseRoom[]> {
  const groups: Record<HouseRoom["zone"], HouseRoom[]> = {
    social: [],
    privada: [],
    servicios: [],
    exterior: [],
  };

  for (const room of rooms) {
    groups[room.zone].push(room);
  }

  return groups;
}