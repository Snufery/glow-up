import {
  Lightbulb,
  Camera,
  Thermometer,
  Lock,
  Wifi,
  type LucideIcon,
} from "lucide-react";

export const HERO_VIDEO_SRC =
  "https://videos.pexels.com/video-files/11630727/11630727-hd_1920_1080_30fps.mp4";

export const HERO_POSTER_SRC =
  "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=85";

export const HERO_PHOTO_SRC =
  "https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=1400&q=85";

export interface HeroHotspot {
  id: string;
  icon: LucideIcon;
  label: string;
  description: string;
  top: string;
  left: string;
}

export const heroHotspots: HeroHotspot[] = [
  {
    id: "lights",
    icon: Lightbulb,
    label: "Iluminacion inteligente",
    description: "Control de escenas, dimming y automatizacion por horario",
    top: "32%",
    left: "28%",
  },
  {
    id: "camera",
    icon: Camera,
    label: "Seguridad 24/7",
    description: "Camaras IP, deteccion de movimiento y monitoreo remoto",
    top: "20%",
    left: "72%",
  },
  {
    id: "climate",
    icon: Thermometer,
    label: "Climatizacion",
    description: "Temperatura optima con sensores y rutinas inteligentes",
    top: "58%",
    left: "18%",
  },
  {
    id: "lock",
    icon: Lock,
    label: "Acceso smart",
    description: "Cerraduras digitales y control de accesos desde el celular",
    top: "65%",
    left: "78%",
  },
  {
    id: "hub",
    icon: Wifi,
    label: "Control central",
    description: "Todos tus dispositivos conectados en una sola app",
    top: "42%",
    left: "52%",
  },
];

export const dashboardMetrics = [
  { key: "temp", label: "Temperatura", values: ["21°C", "22°C", "22°C", "23°C"] },
  { key: "lights", label: "Luces activas", values: ["3", "4", "5", "4"] },
  { key: "security", label: "Seguridad", values: ["Activa", "Activa", "Monitoreo", "Activa"] },
] as const;