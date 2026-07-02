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
    price: 140000,
    priceFormatted: "$140.000",
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
    name: "Imou Ranger",
    slug: "imou-ranger",
    category: "seguridad",
    description:
      "Camara interior WiFi 5MP con vision 360°, deteccion IA de personas y modo privacidad desde la app",
    price: 200000,
    priceFormatted: "$200.000",
    badge: "Nuevo",
    image: "/images/productos/imou-ranger.jpg",
    imageBackground: "white",
    features: [
      "Resolucion 5MP con calidad 3K",
      "Rotacion 355° horizontal y 80° vertical",
      "Deteccion IA de personas con seguimiento automatico",
      "Vision nocturna IR y audio bidireccional",
      "Modo privacidad y almacenamiento en SD o nube",
    ],
  },
  {
    id: "5",
    name: "Sensor de Movimiento PIR",
    slug: "sensor-de-movimiento-pir",
    category: "sensores",
    description: "Deteccion inteligente, notificaciones al celular, facil instalacion",
    price: 60000,
    priceFormatted: "$60.000",
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
    name: "Cerradura Ezviz DL05",
    slug: "cerradura-ezviz-dl05",
    category: "seguridad",
    description:
      "Cerradura inteligente con huella, codigo, app y timbre integrado. Control remoto y notificaciones en tiempo real",
    price: 350000,
    priceFormatted: "$350.000",
    image: "/images/productos/Cerradura.png",
    imageBackground: "white",
    features: [
      "Apertura por huella, codigo, app, Bluetooth y tarjeta",
      "Hasta 50 huellas con almacenamiento local seguro",
      "Timbre electronico integrado y desbloqueo remoto",
      "Bloqueo automatico, modo privacidad y proteccion infantil",
      "IP65, alarma anti-manipulacion y bateria hasta 365 dias",
    ],
  },
  {
    id: "8",
    name: "Sensor de Temperatura y Humedad",
    slug: "sensor-temperatura-humedad",
    category: "sensores",
    description: "Monitoreo en tiempo real, historial, alertas automaticas",
    price: 50000,
    priceFormatted: "$50.000",
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
    name: "Disyuntor Inteligente WiFi",
    slug: "disyuntor-inteligente-wifi",
    category: "energia",
    description:
      "Interruptor de circuito WiFi Tuya con medicion de energia, voltaje y corriente. Control remoto desde app y voz",
    price: 149000,
    priceFormatted: "$149.000",
    image: "/images/productos/disyuntor.png",
    imageBackground: "white",
    features: [
      "Medicion en tiempo real de kWh, voltaje y corriente",
      "Control remoto ON/OFF desde app Tuya Smart / Smart Life",
      "Proteccion contra sobrecarga, sobretension y bajo voltaje",
      "Instalacion en riel DIN, compatible con Alexa y Google Home",
      "Programacion de horarios y estadisticas de consumo",
    ],
  },
  {
    id: "10",
    name: "Camara Imou Cruiser SC 4K con Imou Sense",
    slug: "camara-imou-cruiser-sc-4k",
    category: "seguridad",
    description:
      "Camara PTZ exterior 4K Ultra HD con vision nocturna a color, seguimiento inteligente y deteccion IA Imou Sense",
    price: 340000,
    priceFormatted: "$340.000",
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
    price: 430000,
    priceFormatted: "$430.000",
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
    price: 475000,
    priceFormatted: "$475.000",
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
    price: 149000,
    priceFormatted: "$149.000",
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
    name: "Control Universal Inteligente",
    slug: "control-universal-inteligente",
    category: "control",
    description:
      "Control remoto universal WiFi/IR para integrar aires acondicionados, televisores y electrodomesticos con control por infrarrojo a Alexa y Google Home",
    price: 58000,
    priceFormatted: "$58.000",
    image: "/images/productos/Control.png",
    imageBackground: "white",
    features: [
      "Aprende comandos de controles IR de TV, aire acondicionado y mas",
      "Integracion con Alexa y Google Home para control por voz",
      "Control remoto desde app Tuya Smart / Smart Life",
      "Compatible con miles de marcas de electrodomesticos",
      "Instalacion sencilla, recarga USB-C y cobertura 360°",
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
