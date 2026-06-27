import type { HouseCounts } from "@/lib/houseLayout";

export interface HousePreset {
  id: string;
  label: string;
  description: string;
  counts: HouseCounts;
}

export const HOUSE_PRESETS: HousePreset[] = [
  {
    id: "apto-2",
    label: "Apto 2 hab",
    description: "2 hab · 1 baño · cocina · sala",
    counts: {
      habitaciones: 2,
      salas: 1,
      banos: 1,
      cocina: 1,
      comedor: 0,
      patios: 0,
      balcones: 1,
    },
  },
  {
    id: "casa-3",
    label: "Casa 3 hab",
    description: "3 hab · 2 baños · patio",
    counts: {
      habitaciones: 3,
      salas: 1,
      banos: 2,
      cocina: 1,
      comedor: 1,
      patios: 1,
      balcones: 0,
    },
  },
  {
    id: "casa-4",
    label: "Casa 4 hab",
    description: "4 hab · 2 baños · patio · balcón",
    counts: {
      habitaciones: 4,
      salas: 1,
      banos: 2,
      cocina: 1,
      comedor: 1,
      patios: 1,
      balcones: 1,
    },
  },
];