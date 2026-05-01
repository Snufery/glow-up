export interface ChannelOption {
  channels: number;
  price: number;
  priceFormatted: string;
}

export interface ColorVariant {
  id: string;
  label: string;
  hex: string;
  image?: string;                    // imagen simple (productos normales)
  images?: Record<number, string>;   // imagen por canal (interruptores): { 1: "...", 2: "...", etc }
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: "iluminacion" | "control" | "seguridad" | "sensores" | "energia";
  description: string;
  price: number;
  priceFormatted: string;
  badge?: string;
  features?: string[];
  image?: string;
  imageFit?: "cover" | "contain";
  colorVariants?: ColorVariant[];
  channelOptions?: ChannelOption[];  // si existe, muestra selector de canales
}

export const products: Product[] = [
  {
    id: "4",
    name: "Interruptor Inteligente WiFi",
    slug: "interruptor-inteligente-wifi",
    category: "control",
    description: "Panel tactil de vidrio templado, control por app y voz. Compatible con Siri, Alexa y Google Home",
    price: 68000,
    priceFormatted: "$68.000",
    badge: "Popular",
    features: [
      "Panel tactil de vidrio templado",
      "Control remoto desde app",
      "Compatible con Alexa y Google Home",
      "Temporizador y escenas",
      "Facil instalacion",
    ],
    channelOptions: [
      { channels: 1, price: 68000, priceFormatted: "$68.000" },
      { channels: 2, price: 70000, priceFormatted: "$70.000" },
      { channels: 3, price: 75000, priceFormatted: "$75.000" },
      { channels: 4, price: 85000, priceFormatted: "$85.000" },
    ],
    colorVariants: [
      {
        id: "negro",
        label: "Negro",
        hex: "#1A1A1A",
        images: {
          1: "/images/productos/interruptor-1-canal-negro.jpg",
          2: "/images/productos/interruptor-2-canales-negro.jpg",
          3: "/images/productos/interruptor-3-canales-negro.jpg",
          4: "/images/productos/interruptor-4-canales-negro.jpg",
        },
      },
      {
        id: "blanco",
        label: "Blanco",
        hex: "#FFFFFF",
        images: {
          1: "/images/productos/interruptor-1-canal-blanco.jpg",
          2: "/images/productos/interruptor-2-canales-blanco.jpg",
          3: "/images/productos/interruptor-3-canales-blanco.jpg",
          4: "/images/productos/interruptor-4-canales-blanco.jpg",
        },
      },
    ],
  },
  {
    id: "1",
    name: "Foco LED Inteligente RGB",
    slug: "foco-led-inteligente-rgb",
    category: "iluminacion",
    description: "Control por voz y app, 16 millones de colores, compatible con Alexa y Google Home",
    price: 40000,
    priceFormatted: "$40.000",
    badge: "Popular",
    image: "/images/productos/led-wifi.jpg",
    imageFit: "cover",
    features: [
      "16 millones de colores",
      "Compatible con Alexa y Google Home",
      "Control por app WiFi",
      "Temporizador programable",
      "Bajo consumo energetico",
    ],
  },
  {
    id: "2",
    name: "Tira LED Smart WiFi",
    slug: "tira-led-smart-wifi",
    category: "iluminacion",
    description: "5 metros, multicolor, efectos dinamicos, control desde app movil",
    price: 65000,
    priceFormatted: "$65.000",
    features: [
      "5 metros de longitud",
      "Efectos dinamicos y escenas",
      "Corte cada 10cm",
      "Adhesivo 3M incluido",
      "Sincronizacion con musica",
    ],
  },
  {
    id: "3",
    name: "Camara WiFi 360",
    slug: "camara-wifi-360",
    category: "seguridad",
    description: "Full HD, vision nocturna, deteccion de movimiento, audio bidireccional",
    price: 120000,
    priceFormatted: "$120.000",
    badge: "Nuevo",
    image: "/images/productos/dahua-int-5mp.jpg",
    features: [
      "Resolucion Full HD 1080p",
      "Vision nocturna infrarroja",
      "Deteccion de movimiento con alertas",
      "Audio bidireccional",
      "Almacenamiento en nube o micro SD",
    ],
  },
  {
    id: "5",
    name: "Sensor de Movimiento PIR",
    slug: "sensor-de-movimiento-pir",
    category: "sensores",
    description: "Deteccion inteligente, notificaciones al celular, facil instalacion",
    price: 35000,
    priceFormatted: "$35.000",
    features: [
      "Deteccion hasta 6 metros",
      "Notificaciones push al celular",
      "Bateria de larga duracion",
      "Compatible con hub Zigbee",
      "Montaje con adhesivo o tornillo",
    ],
  },
  {
    id: "6",
    name: "Enchufe Inteligente WiFi",
    slug: "enchufe-inteligente-wifi",
    category: "control",
    description: "Monitoreo de consumo, temporizador, control por voz y app",
    price: 38000,
    priceFormatted: "$38.000",
    badge: "Top Ventas",
    image: "/images/productos/socket-wifi.jpg",
    features: [
      "Monitoreo de consumo en watts",
      "Temporizador y horarios",
      "Control por voz",
      "Proteccion contra sobrecarga",
      "Diseno compacto",
    ],
  },
  {
    id: "7",
    name: "Cerradura Digital Smart",
    slug: "cerradura-digital-smart",
    category: "seguridad",
    description: "Huella, codigo, tarjeta y llave, desbloqueo remoto desde app",
    price: 350000,
    priceFormatted: "$350.000",
    features: [
      "4 metodos de apertura",
      "Hasta 100 huellas registradas",
      "Desbloqueo remoto desde app",
      "Alarma anti-manipulacion",
      "Bateria de respaldo USB",
    ],
  },
  {
    id: "8",
    name: "Sensor de Temperatura y Humedad",
    slug: "sensor-temperatura-humedad",
    category: "sensores",
    description: "Monitoreo en tiempo real, historial, alertas automaticas",
    price: 42000,
    priceFormatted: "$42.000",
    features: [
      "Precision de +/- 0.3 grados",
      "Historial de datos en la app",
      "Alertas por temperatura extrema",
      "Pantalla LCD integrada",
      "Compatible con automatizaciones",
    ],
  },
  {
    id: "9",
    name: "Medidor de Consumo WiFi",
    slug: "medidor-consumo-wifi",
    category: "energia",
    description: "Monitorea el consumo electrico en tiempo real desde tu celular",
    price: 95000,
    priceFormatted: "$95.000",
    features: [
      "Monitoreo en tiempo real (kWh)",
      "Historial de consumo mensual",
      "Alertas de consumo excesivo",
      "Instalacion en tablero electrico",
      "Exportacion de datos CSV",
    ],
  },
];

export const categories = [
  { id: "all", label: "Todos" },
  { id: "iluminacion", label: "Iluminacion" },
  { id: "seguridad", label: "Seguridad" },
  { id: "control", label: "Control" },
  { id: "sensores", label: "Sensores" },
  { id: "energia", label: "Energia" },
] as const;
