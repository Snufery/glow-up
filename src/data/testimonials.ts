export interface Testimonial {
  id: string;
  clientName: string;
  clientRole?: string;
  location: string;
  quote: string;
  videoSrc?: string;       // ruta al .mp4 en /public/videos/testimonios/
  posterSrc?: string;      // imagen de miniatura (opcional)
  rating: number;          // 1-5 estrellas
  serviceType: string;
}

// ═══════════════════════════════════════════
// INSTRUCCIONES PARA AGREGAR TESTIMONIOS:
//
// 1. Graba el video con tu celular
// 2. Copia el archivo .mp4 a: public/videos/testimonios/
// 3. (Opcional) Toma un screenshot como miniatura y guardalo en: public/images/testimonios/
// 4. Agrega un nuevo objeto abajo con los datos del cliente
//
// Ejemplo:
// {
//   id: "4",
//   clientName: "Laura Gomez",
//   clientRole: "Propietaria",
//   location: "Popayan, Cauca",
//   quote: "Glow Up transformo mi casa...",
//   videoSrc: "/videos/testimonios/laura-gomez.mp4",
//   posterSrc: "/images/testimonios/laura-gomez-thumb.jpg",
//   rating: 5,
//   serviceType: "Domotica Residencial",
// }
// ═══════════════════════════════════════════

export const testimonials: Testimonial[] = [
  {
    id: "1",
    clientName: "Carlos Martinez",
    clientRole: "Propietario",
    location: "Popayan, Cauca",
    quote: "Increible el trabajo de Glow Up. Ahora controlo toda mi casa desde el celular. La instalacion fue rapida y profesional.",
    // videoSrc: "/videos/testimonios/carlos-martinez.mp4",
    rating: 5,
    serviceType: "Domotica Residencial",
  },
  {
    id: "2",
    clientName: "Maria Fernanda Lopez",
    clientRole: "Gerente",
    location: "Popayan, Cauca",
    quote: "Automatizaron toda la oficina: luces, accesos y camaras. El ahorro energetico ha sido notable.",
    // videoSrc: "/videos/testimonios/maria-lopez.mp4",
    rating: 5,
    serviceType: "Automatizacion Comercial",
  },
  {
    id: "3",
    clientName: "Andres Ruiz",
    clientRole: "Propietario",
    location: "Popayan, Cauca",
    quote: "La instalacion electrica quedo impecable. Muy profesionales y cumplidos con los tiempos.",
    // videoSrc: "/videos/testimonios/andres-ruiz.mp4",
    rating: 5,
    serviceType: "Instalacion Electrica",
  },
];
