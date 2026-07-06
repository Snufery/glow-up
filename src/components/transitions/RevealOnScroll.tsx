"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

interface RevealOnScrollProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** No montar hijos hasta que la seccion este cerca del viewport (mejora carga en movil) */
  deferRender?: boolean;
  /** Altura minima del placeholder mientras no se monta el contenido */
  placeholderMinHeight?: string;
  /** ID de ancla (#catalogo) para montar de inmediato al navegar por hash */
  anchorId?: string;
}

export default function RevealOnScroll({
  children,
  className = "",
  delay = 0,
  deferRender = false,
  placeholderMinHeight = "40vh",
  anchorId,
}: RevealOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(!deferRender);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      setShouldRender(true);
      setVisible(true);
      return;
    }

    const element = ref.current;
    if (!element) return;

    const reveal = () => {
      setShouldRender(true);
      setVisible(true);
    };

    const isInViewport = () => {
      const rect = element.getBoundingClientRect();
      return rect.top < window.innerHeight + 200 && rect.bottom > -200;
    };

    const hashTarget = window.location.hash.slice(1);
    if (hashTarget && (hashTarget === anchorId || element.querySelector(`#${hashTarget}`))) {
      reveal();
      return;
    }

    if (isInViewport()) {
      reveal();
      return;
    }

    const onHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash && (hash === anchorId || element.querySelector(`#${hash}`))) reveal();
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          reveal();
          observer.disconnect();
        }
      },
      { threshold: 0.01, rootMargin: "200px 0px 200px 0px" }
    );

    window.addEventListener("hashchange", onHashChange);
    observer.observe(element);

    return () => {
      window.removeEventListener("hashchange", onHashChange);
      observer.disconnect();
    };
  }, [reducedMotion, deferRender, anchorId]);

  return (
    <div
      ref={ref}
      className={`reveal ${visible ? "visible" : ""} ${className}`.trim()}
      style={{
        ...(delay > 0 ? { transitionDelay: `${delay}ms` } : undefined),
        ...(deferRender && !shouldRender ? { minHeight: placeholderMinHeight } : undefined),
      }}
    >
      {shouldRender ? children : null}
    </div>
  );
}