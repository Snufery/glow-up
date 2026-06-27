import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Catalog from "@/components/Catalog";
import Process from "@/components/Process";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import RevealOnScroll from "@/components/transitions/RevealOnScroll";

export default function Home() {
  return (
    <>
      <Hero />
      <RevealOnScroll>
        <About />
      </RevealOnScroll>
      <RevealOnScroll delay={80}>
        <Services />
      </RevealOnScroll>
      <RevealOnScroll delay={120}>
        <Catalog />
      </RevealOnScroll>
      <RevealOnScroll delay={80}>
        <Process />
      </RevealOnScroll>
      <RevealOnScroll delay={100}>
        <Testimonials />
      </RevealOnScroll>
      <RevealOnScroll delay={80}>
        <Contact />
      </RevealOnScroll>
      <RevealOnScroll>
        <Footer />
      </RevealOnScroll>
    </>
  );
}