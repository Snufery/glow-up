import type { QuoteLineItem } from "@/context/QuoteContext";
import type { QuoteGoal } from "@/data/quotePackages";
import { products } from "@/data/products";
import type { HouseRoom, RoomType } from "@/lib/houseLayout";
import { calcQuoteTotals } from "@/lib/quote";

export type RecommendationPriority = "high" | "medium" | "low";

export interface RoomRecommendation {
  id: string;
  productId: string;
  roomId: string;
  roomLabel: string;
  roomType: RoomType;
  reason: string;
  priority: RecommendationPriority;
}

export interface AccessoryRecommendation {
  id: string;
  name: string;
  description: string;
  unitPrice: number;
  quantity: number;
  required: boolean;
  triggerLabel: string;
}

export interface CompatibilityWarning {
  id: string;
  severity: "info" | "warning" | "error";
  title: string;
  message: string;
}

export interface SceneSuggestion {
  id: string;
  name: string;
  description: string;
  unitPrice: number;
  relatedProductIds: string[];
}

export interface QuotePriceRange {
  low: number;
  high: number;
  midpoint: number;
  variancePercent: number;
}

const PRODUCT_PROTOCOL: Record<string, "wifi" | "zigbee"> = {
  "5": "zigbee",
};

const ROOM_RULES: Record<
  RoomType,
  Array<{ productId: string; reason: string; priority: RecommendationPriority }>
> = {
  bano: [
    {
      productId: "8",
      reason: "Monitorea humedad y temperatura para prevenir moho",
      priority: "high",
    },
  ],
  cocina: [
    {
      productId: "6",
      reason: "Controla electrodomésticos y revisa consumo en tiempo real",
      priority: "high",
    },
    {
      productId: "5",
      reason: "Detecta movimiento para automatizar luces al entrar",
      priority: "medium",
    },
  ],
  sala: [
    {
      productId: "4",
      reason: "Control central de iluminación desde pared o app",
      priority: "high",
    },
    {
      productId: "1",
      reason: "Ambiente con escenas de luz para reuniones o cine",
      priority: "medium",
    },
  ],
  comedor: [
    {
      productId: "4",
      reason: "Regula la luz del comedor con un solo toque",
      priority: "medium",
    },
    {
      productId: "1",
      reason: "Iluminación cálida para cenas y reuniones",
      priority: "low",
    },
  ],
  habitacion: [
    {
      productId: "1",
      reason: "Rutinas de luz para despertar y dormir",
      priority: "high",
    },
    {
      productId: "6",
      reason: "Controla cargadores y lámparas sin levantarte",
      priority: "medium",
    },
  ],
  patio: [
    {
      productId: "3",
      reason: "Vigilancia perimetral con visión nocturna",
      priority: "high",
    },
    {
      productId: "5",
      reason: "Enciende luces automáticamente al detectar movimiento",
      priority: "medium",
    },
  ],
  balcon: [
    {
      productId: "3",
      reason: "Monitorea accesos y balcones expuestos",
      priority: "high",
    },
  ],
};

const GOAL_BOOST: Partial<
  Record<QuoteGoal, Array<{ productId: string; reason: string }>>
> = {
  seguridad: [
    { productId: "3", reason: "Refuerza tu objetivo de seguridad" },
    { productId: "7", reason: "Control de acceso inteligente" },
  ],
  confort: [
    { productId: "4", reason: "Mejora el confort con control táctil" },
    { productId: "2", reason: "Ambiente con tira LED multicolor" },
  ],
  ahorro: [
    { productId: "9", reason: "Mide el consumo total de tu vivienda" },
    { productId: "6", reason: "Identifica equipos que gastan más" },
  ],
};

export const SCENE_SUGGESTIONS: SceneSuggestion[] = [
  {
    id: "scene-ausente",
    name: "Escena: Modo ausente",
    description:
      "Simula presencia, apaga luces no esenciales y activa alertas de seguridad.",
    unitPrice: 150000,
    relatedProductIds: ["3", "5", "1", "6"],
  },
  {
    id: "scene-noche",
    name: "Escena: Buenas noches",
    description:
      "Apaga zonas sociales, deja luz tenue en pasillos y cierra enchufes.",
    unitPrice: 120000,
    relatedProductIds: ["1", "4", "6"],
  },
  {
    id: "scene-llegada",
    name: "Escena: Llegada a casa",
    description:
      "Enciende entrada y sala al detectar tu llegada o con un solo toque.",
    unitPrice: 120000,
    relatedProductIds: ["4", "1", "5", "7"],
  },
];

function itemHasProduct(items: QuoteLineItem[], productId: string, roomId?: string): boolean {
  return items.some(
    (i) =>
      i.productId === productId &&
      (!roomId || i.roomId === roomId || !i.roomId)
  );
}

function customItemExists(items: QuoteLineItem[], name: string): boolean {
  const key = name.toLowerCase();
  return items.some((i) => i.isCustom && i.name.toLowerCase() === key);
}

export function getRoomRecommendations(
  rooms: HouseRoom[],
  items: QuoteLineItem[],
  selectedRoom: HouseRoom | null,
  goal: QuoteGoal | null
): RoomRecommendation[] {
  const targetRooms = selectedRoom ? [selectedRoom] : rooms;
  const results: RoomRecommendation[] = [];

  for (const room of targetRooms) {
    const rules = ROOM_RULES[room.type] ?? [];

    for (const rule of rules) {
      if (itemHasProduct(items, rule.productId, room.id)) continue;

      results.push({
        id: `room:${room.id}:${rule.productId}`,
        productId: rule.productId,
        roomId: room.id,
        roomLabel: room.label,
        roomType: room.type,
        reason: rule.reason,
        priority: rule.priority,
      });
    }
  }

  if (goal && GOAL_BOOST[goal]) {
    for (const boost of GOAL_BOOST[goal]!) {
      if (itemHasProduct(items, boost.productId)) continue;
      const already = results.some((r) => r.productId === boost.productId);
      if (already) continue;

      const room = selectedRoom ?? rooms[0];
      if (!room) continue;

      results.push({
        id: `goal:${goal}:${boost.productId}`,
        productId: boost.productId,
        roomId: room.id,
        roomLabel: room.label,
        roomType: room.type,
        reason: boost.reason,
        priority: "medium",
      });
    }
  }

  const priorityOrder: Record<RecommendationPriority, number> = {
    high: 0,
    medium: 1,
    low: 2,
  };

  return results
    .sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
    .slice(0, 6);
}

export function getAccessoryRecommendations(
  items: QuoteLineItem[]
): AccessoryRecommendation[] {
  const accessories: AccessoryRecommendation[] = [];

  const hasZigbeeSensor = items.some((i) => i.productId === "5");
  const hasHub = customItemExists(items, "Hub Zigbee Universal");

  if (hasZigbeeSensor && !hasHub) {
    accessories.push({
      id: "acc-hub-zigbee",
      name: "Hub Zigbee Universal",
      description: "Necesario para conectar sensores Zigbee a tu red WiFi.",
      unitPrice: 145000,
      quantity: 1,
      required: true,
      triggerLabel: "Sensor de movimiento PIR",
    });
  }

  const hasLedStrip = items.some((i) => i.productId === "2");
  const hasPowerSupply = customItemExists(items, "Fuente 12V para tira LED");

  if (hasLedStrip && !hasPowerSupply) {
    accessories.push({
      id: "acc-led-power",
      name: "Fuente 12V para tira LED",
      description: "Alimentación estable para tira LED de 5 metros.",
      unitPrice: 35000,
      quantity: 1,
      required: true,
      triggerLabel: "Tira LED Smart WiFi",
    });
  }

  const cameraCount = items
    .filter((i) => i.productId === "3")
    .reduce((sum, i) => sum + i.quantity, 0);
  const hasStorage = customItemExists(items, "Micro SD 128GB (cámaras)");

  if (cameraCount > 0 && !hasStorage) {
    accessories.push({
      id: "acc-sd-card",
      name: "Micro SD 128GB (cámaras)",
      description: "Almacenamiento local de grabaciones en cada cámara.",
      unitPrice: 45000,
      quantity: Math.min(cameraCount, 3),
      required: false,
      triggerLabel: `${cameraCount} cámara${cameraCount > 1 ? "s" : ""}`,
    });
  }

  const wifiDeviceCount = items.filter(
    (i) => !i.isCustom && PRODUCT_PROTOCOL[i.productId] !== "zigbee"
  ).reduce((sum, i) => sum + i.quantity, 0);

  const hasMeshNote = customItemExists(items, "Router WiFi mesh (recomendado)");

  if (wifiDeviceCount >= 6 && !hasMeshNote) {
    accessories.push({
      id: "acc-mesh-router",
      name: "Router WiFi mesh (recomendado)",
      description:
        "Con 6+ dispositivos WiFi, un mesh mejora estabilidad y respuesta.",
      unitPrice: 280000,
      quantity: 1,
      required: false,
      triggerLabel: `${wifiDeviceCount} dispositivos WiFi`,
    });
  }

  return accessories;
}

export function getCompatibilityWarnings(
  items: QuoteLineItem[]
): CompatibilityWarning[] {
  const warnings: CompatibilityWarning[] = [];

  const hasZigbee = items.some((i) => PRODUCT_PROTOCOL[i.productId] === "zigbee");
  const hasHub = customItemExists(items, "Hub Zigbee Universal");

  if (hasZigbee && !hasHub) {
    warnings.push({
      id: "warn-zigbee-hub",
      severity: "error",
      title: "Falta hub Zigbee",
      message:
        "Tienes sensores Zigbee sin hub compatible. No funcionarán hasta agregar uno.",
    });
  }

  const wifiCount = items.filter(
    (i) => !i.isCustom && i.productId !== "9"
  ).reduce((sum, i) => sum + i.quantity, 0);

  if (wifiCount >= 8) {
    warnings.push({
      id: "warn-wifi-density",
      severity: "warning",
      title: "Alta densidad WiFi",
      message:
        "Muchos dispositivos en la misma red pueden causar lentitud. Valora un router mesh.",
    });
  }

  const hasLock = items.some((i) => i.productId === "7");
  const hasCamera = items.some((i) => i.productId === "3");

  if (hasLock && !hasCamera) {
    warnings.push({
      id: "warn-lock-camera",
      severity: "info",
      title: "Cerradura sin cámara",
      message:
        "Combina la cerradura inteligente con una cámara en la entrada para mayor seguridad.",
    });
  }

  const hasMeter = items.some((i) => i.productId === "9");
  const hasSmartPlug = items.some((i) => i.productId === "6");

  if (hasMeter && !hasSmartPlug) {
    warnings.push({
      id: "warn-meter-plugs",
      severity: "info",
      title: "Medidor sin enchufes inteligentes",
      message:
        "Los enchufes WiFi te permiten identificar qué circuito consume más allá del medidor general.",
    });
  }

  return warnings;
}

export function getSceneSuggestions(
  items: QuoteLineItem[],
  goal: QuoteGoal | null
): SceneSuggestion[] {
  if (items.length === 0) return [];

  const productIds = new Set(items.map((i) => i.productId));

  return SCENE_SUGGESTIONS.filter((scene) => {
    const matchCount = scene.relatedProductIds.filter((id) =>
      productIds.has(id)
    ).length;
    const alreadyAdded = customItemExists(items, scene.name);
    if (alreadyAdded) return false;

    if (goal === "seguridad" && scene.id === "scene-ausente") return true;
    if (goal === "confort" && scene.id === "scene-noche") return true;
    if (goal === "completo") return matchCount >= 2;

    return matchCount >= 2;
  }).slice(0, 3);
}

export function calcQuotePriceRange(
  items: QuoteLineItem[],
  options?: { varianceLow?: number; varianceHigh?: number }
): QuotePriceRange {
  const { grandTotal } = calcQuoteTotals(items);
  const lowFactor = options?.varianceLow ?? 0.92;
  const highFactor = options?.varianceHigh ?? 1.18;

  const low = Math.round(grandTotal * lowFactor);
  const high = Math.round(grandTotal * highFactor);

  return {
    low: Math.min(low, grandTotal),
    high: Math.max(high, grandTotal),
    midpoint: grandTotal,
    variancePercent: Math.round((highFactor - 1) * 100),
  };
}

export function formatPriceRange(range: QuotePriceRange): string {
  if (range.low === range.high) {
    return `$${range.midpoint.toLocaleString("es-CO")}`;
  }
  return `$${range.low.toLocaleString("es-CO")} – $${range.high.toLocaleString("es-CO")}`;
}

export function findProductById(productId: string) {
  return products.find((p) => p.id === productId);
}