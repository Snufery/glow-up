export interface Service {
  id: string;
  title: string;
  description: string;
  items: string[];
  featured?: boolean;
}

export const services: Service[] = [
  {
    id: "domotica",
    title: "Domotica Residencial",
    description: "Automatiza iluminacion, climatizacion, seguridad y entretenimiento desde tu celular o por voz.",
    items: [
      "Control de luces inteligente",
      "Termostatos y climatizacion",
      "Cerraduras y accesos smart",
      "Asistentes de voz integrados",
    ],
    featured: true,
  },
  {
    id: "electrica",
    title: "Instalaciones Electricas",
    description: "Instalaciones electricas residenciales, comerciales e industriales con los mas altos estandares.",
    items: [
      "Cableado estructurado",
      "Tableros electricos",
      "Puesta a tierra",
      "Iluminacion LED",
    ],
  },
  {
    id: "seguridad",
    title: "Seguridad Inteligente",
    description: "Sistemas de vigilancia, alarmas y sensores conectados para proteger lo que mas importa.",
    items: [
      "Camaras IP y CCTV",
      "Sensores de movimiento",
      "Alarmas inteligentes",
      "Monitoreo remoto 24/7",
    ],
  },
  {
    id: "comercial",
    title: "Automatizacion Comercial",
    description: "Optimiza tu negocio con control inteligente de espacios, energia y accesos.",
    items: [
      "Control de accesos",
      "Gestion energetica",
      "Automatizacion de persianas",
      "Sistemas de audio ambiental",
    ],
  },
  {
    id: "redes",
    title: "Redes y Conectividad",
    description: "Infraestructura de red robusta para que todos tus dispositivos funcionen sin interrupciones.",
    items: [
      "WiFi mesh de alto rendimiento",
      "Cableado de red Cat6/Cat6a",
      "Configuracion de routers",
      "Puntos de acceso estrategicos",
    ],
  },
  {
    id: "mantenimiento",
    title: "Mantenimiento Preventivo",
    description: "Servicio de mantenimiento para garantizar el funcionamiento optimo de tus sistemas.",
    items: [
      "Revision de sistemas",
      "Actualizacion de firmware",
      "Diagnostico electrico",
      "Soporte tecnico remoto",
    ],
  },
];

export const processSteps = [
  {
    number: "01",
    title: "Consulta inicial",
    description: "Evaluamos tus necesidades, el espacio y tu presupuesto para disenar la solucion ideal.",
  },
  {
    number: "02",
    title: "Diseno y cotizacion",
    description: "Creamos un plan detallado con los dispositivos, instalacion y costos transparentes.",
  },
  {
    number: "03",
    title: "Instalacion profesional",
    description: "Nuestro equipo realiza la instalacion electrica y domotica con los mas altos estandares.",
  },
  {
    number: "04",
    title: "Configuracion y capacitacion",
    description: "Configuramos todo y te ensenamos a usar cada dispositivo. Tu hogar, tu control.",
  },
];
