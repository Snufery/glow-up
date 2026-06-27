export type QuoteGoal = "seguridad" | "confort" | "ahorro" | "completo";

export interface PackageItemSpec {
  productId: string;
  quantity: number;
  channels?: number;
  colorId?: string;
}

export interface QuotePackage {
  id: string;
  goal: QuoteGoal;
  name: string;
  tagline: string;
  description: string;
  items: PackageItemSpec[];
  includes: string[];
  excludes: string[];
}

export const QUOTE_GOALS: Array<{
  id: QuoteGoal;
  label: string;
  subtitle: string;
  icon: string;
}> = [
  {
    id: "seguridad",
    label: "Seguridad",
    subtitle: "Cámaras, sensores y acceso inteligente",
    icon: "shield",
  },
  {
    id: "confort",
    label: "Confort",
    subtitle: "Iluminación y control desde el celular",
    icon: "sofa",
  },
  {
    id: "ahorro",
    label: "Ahorro",
    subtitle: "Monitorea y reduce tu consumo eléctrico",
    icon: "zap",
  },
  {
    id: "completo",
    label: "Todo integrado",
    subtitle: "Seguridad, confort y eficiencia en un solo paquete",
    icon: "sparkles",
  },
];

export const quotePackages: QuotePackage[] = [
  {
    id: "pkg-seguridad-basico",
    goal: "seguridad",
    name: "Paquete Seguridad Esencial",
    tagline: "Protección básica para tu hogar",
    description:
      "Cámaras de vigilancia, sensores de movimiento y cerradura inteligente para monitorear y controlar el acceso.",
    items: [
      { productId: "3", quantity: 2 },
      { productId: "5", quantity: 2 },
      { productId: "7", quantity: 1 },
    ],
    includes: [
      "Cámaras WiFi con visión nocturna",
      "Sensores de movimiento con alertas",
      "Cerradura digital con múltiples métodos de acceso",
      "Cotización estimada de productos",
    ],
    excludes: [
      "Instalación profesional (opcional por producto)",
      "Cableado estructurado o fibra óptica",
      "Monitoreo 24/7 con central de alarmas",
      "Mano de obra en sitio sin visita técnica previa",
    ],
  },
  {
    id: "pkg-confort-basico",
    goal: "confort",
    name: "Paquete Confort Hogar",
    tagline: "Ambientes inteligentes al instante",
    description:
      "Interruptores táctiles, focos RGB y enchufes WiFi para controlar luces y electrodomésticos desde la app.",
    items: [
      { productId: "4", quantity: 2, channels: 2, colorId: "negro" },
      { productId: "1", quantity: 4 },
      { productId: "6", quantity: 2 },
    ],
    includes: [
      "Control de iluminación por app y voz",
      "Interruptores inteligentes de 2 canales",
      "Enchufes con monitoreo de consumo",
      "Cotización estimada de productos",
    ],
    excludes: [
      "Automatizaciones avanzadas (escenas complejas)",
      "Integración con sistemas KNX o bus cableado",
      "Instalación eléctrica mayor a estándar",
      "Hub central propietario de terceros",
    ],
  },
  {
    id: "pkg-ahorro-basico",
    goal: "ahorro",
    name: "Paquete Ahorro Energético",
    tagline: "Mide, controla y optimiza",
    description:
      "Medidor de consumo, enchufes inteligentes y sensor de temperatura para entender y reducir tu gasto eléctrico.",
    items: [
      { productId: "9", quantity: 1 },
      { productId: "6", quantity: 3 },
      { productId: "8", quantity: 1 },
    ],
    includes: [
      "Medidor de consumo en tiempo real",
      "Enchufes con monitoreo individual",
      "Sensor de temperatura y humedad",
      "Cotización estimada de productos",
    ],
    excludes: [
      "Instalación en tablero eléctrico principal",
      "Paneles solares o inversores",
      "Auditoría energética certificada",
      "Tarifas reguladas por operador de red",
    ],
  },
  {
    id: "pkg-completo",
    goal: "completo",
    name: "Paquete Integral Glow Up",
    tagline: "La experiencia domótica completa",
    description:
      "Combinación equilibrada de seguridad, confort y eficiencia para un hogar verdaderamente inteligente.",
    items: [
      { productId: "3", quantity: 1 },
      { productId: "5", quantity: 1 },
      { productId: "4", quantity: 2, channels: 1, colorId: "negro" },
      { productId: "1", quantity: 2 },
      { productId: "6", quantity: 2 },
      { productId: "8", quantity: 1 },
    ],
    includes: [
      "Seguridad perimetral básica",
      "Iluminación y control inteligente",
      "Monitoreo de consumo y ambiente",
      "Cotización estimada de productos",
    ],
    excludes: [
      "Proyecto llave en mano con obra civil",
      "Sistemas de riego o piscina automatizada",
      "Integración con ascensores o portería",
      "Mantenimiento anual sin contrato",
    ],
  },
];

export function getPackagesForGoal(goal: QuoteGoal): QuotePackage[] {
  return quotePackages.filter((pkg) => pkg.goal === goal);
}

export function getPackageById(id: string): QuotePackage | undefined {
  return quotePackages.find((pkg) => pkg.id === id);
}

export const DEFAULT_INCLUDES = [
  "Productos del catálogo Glow Up",
  "Cotización estimada en PDF",
  "Asesoría por WhatsApp",
];

export const DEFAULT_EXCLUDES = [
  "Obra civil o remodelación estructural",
  "Cableado oculto en muros nuevos",
  "Equipos no listados en el catálogo",
  "Garantía extendida sin contrato adicional",
];