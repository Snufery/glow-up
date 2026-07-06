import dynamic from "next/dynamic";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Process from "@/components/Process";
import Footer from "@/components/Footer";
import RevealOnScroll from "@/components/transitions/RevealOnScroll";

const Catalog = dynamic(() => import("@/components/Catalog"));
const Testimonials = dynamic(() => import("@/components/Testimonials"));
const Contact = dynamic(() => import("@/components/Contact"));

export default function Home() {
  return (
    <>
      <Hero />
      <RevealOnScroll>
        <About />
      </RevealOnScroll>
      <RevealOnScroll delay={80} deferRender anchorId="servicios" placeholderMinHeight="40vh">
        <Services />
      </RevealOnScroll>
      <RevealOnScroll delay={120} deferRender anchorId="catalogo" placeholderMinHeight="60vh">
        <Catalog />
      </RevealOnScroll>
      <RevealOnScroll delay={80} deferRender anchorId="proyectos" placeholderMinHeight="35vh">
        <Process />
      </RevealOnScroll>
      <RevealOnScroll delay={100} deferRender anchorId="testimonios" placeholderMinHeight="45vh">
        <Testimonials />
      </RevealOnScroll>
      <RevealOnScroll delay={80} deferRender anchorId="contacto" placeholderMinHeight="50vh">
        <Contact />
      </RevealOnScroll>
      <RevealOnScroll deferRender placeholderMinHeight="30vh">
        <Footer />
      </RevealOnScroll>
    </>
  );
}