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
  /** Fondo de la foto: blanco, negro o escena oscura (catálogo) */
  imageBackground?: "white" | "black" | "dark";
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
    image: "/images/productos/Bombillo.png",
    imageFit: "cover",
    imageBackground: "dark",
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
    imageBackground: "white",
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
    imageBackground: "white",
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
    image: "/images/productos/Cerradura.png",
    imageBackground: "white",
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
  {
    id: "10",
    name: "Camara Imou Cruiser SC 4K con Imou Sense",
    slug: "camara-imou-cruiser-sc-4k",
    category: "seguridad",
    description:
      "Camara PTZ exterior 4K Ultra HD con vision nocturna a color, seguimiento inteligente y deteccion IA Imou Sense",
    price: 295000,
    priceFormatted: "$295.000",
    badge: "Nuevo",
    image: "/images/productos/camara-ptZ-4K.jpg",
    imageBackground: "white",
    features: [
      "Resolucion 4K Ultra HD (8MP)",
      "Vision nocturna a color con luces rojo-azul",
      "Imou Sense: deteccion IA de personas y vehiculos",
      "PTZ con seguimiento automatico de movimiento",
      "Wi-Fi 6 y audio bidireccional",
    ],
  },
  {
    id: "11",
    name: "Camara Imou Cruiser Dual 10MP con Imou Sense",
    slug: "camara-imou-cruiser-dual-10mp",
    category: "seguridad",
    description:
      "Camara doble lente 5+5MP que monitorea dos zonas a la vez con vision nocturna inteligente y deteccion IA",
    price: 345000,
    priceFormatted: "$345.000",
    badge: "Nuevo",
    image: "/images/productos/camara-ptz-2lens.jpg",
    imageBackground: "white",
    features: [
      "Doble lente 5+5MP (10MP total)",
      "Imou Sense: deteccion dual de personas y vehiculos",
      "Vision nocturna a color con focos y IR",
      "Wi-Fi 6, IP66 y sirena de 110 dB",
      "Audio bidireccional y almacenamiento en nube o SD",
    ],
  },
  {
    id: "12",
    name: "Camara Imou Cruiser Triple 11MP con Imou Sense",
    slug: "camara-imou-cruiser-triple-11mp",
    category: "seguridad",
    description:
      "Camara triple lente 3+3+5MP con cobertura 360°, Click2Track y algoritmos IA personalizables",
    price: 485000,
    priceFormatted: "$485.000",
    badge: "Nuevo",
    image: "/images/productos/camara-ptz-3lens.jpg",
    imageBackground: "white",
    features: [
      "Triple lente 3+3+5MP (11MP total)",
      "Click2Track: enlace multi-lente desde la app",
      "Cobertura panoramica 160° + rotacion 360°",
      "Imou Sense con deteccion de intrusion y cruce de linea",
      "Wi-Fi 6, doble ranura SD (hasta 1 TB) y luces de advertencia",
    ],
  },
  {
    id: "13",
    name: "Sirena Inteligente Comunitaria",
    slug: "sirena-inteligente-comunitaria",
    category: "seguridad",
    description:
      "Kit de alarma comunitaria WiFi con sirena de 30W y 110 dB, control desde app y compatibilidad con Alexa y Google Home",
    price: 175000,
    priceFormatted: "$175.000",
    badge: "Nuevo",
    image: "/images/productos/sirena-comunitaria.jpg",
    imageBackground: "white",
    features: [
      "Sirena de 30W con 110 dB de potencia",
      "Control remoto via app Tuya Smart / Smart Life",
      "Compatible con Alexa y Google Home",
      "Incluye enchufe WiFi y fuente 12V DC",
      "Alertas instantaneas a usuarios desde la app",
    ],
  },
  {
    id: "14",
    name: "Control Inteligente de Escenas",
    slug: "control-inteligente-escenas",
    category: "control",
    description:
      "Boton inalambrico WiFi para activar escenas y automatizaciones del hogar con un solo toque",
    price: 58000,
    priceFormatted: "$58.000",
    image: "/images/productos/Control.png",
    imageBackground: "white",
    features: [
      "Activacion de escenas con un toque",
      "Control remoto via app Tuya Smart / Smart Life",
      "Compatible con Alexa y Google Home",
      "Instalacion sin cableado, recarga USB-C",
      "Bajo consumo y montaje adhesivo incluido",
    ],
  },
  {
    id: "15",
    name: "Sensor de Apertura Puerta y Ventana",
    slug: "sensor-apertura-puerta-ventana",
    category: "sensores",
    description:
      "Sensor magnetico Zigbee 3.0 para detectar apertura de puertas y ventanas con notificaciones en tiempo real",
    price: 45000,
    priceFormatted: "$45.000",
    badge: "Nuevo",
    image: "/images/productos/sensor-apertura.jpg",
    imageBackground: "white",
    features: [
      "Deteccion magnetica de apertura y cierre",
      "Notificaciones push en tiempo real",
      "Conectividad Zigbee 3.0 (requiere hub)",
      "Alta sensibilidad hasta 25 mm de separacion",
      "Bateria de larga duracion (hasta 1 año)",
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
