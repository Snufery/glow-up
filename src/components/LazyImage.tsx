"use client";

import { useEffect, useRef, useState } from "react";
import Image, { type ImageProps } from "next/image";

type LazyImageProps = Omit<ImageProps, "loading"> & {
  rootMargin?: string;
};

export default function LazyImage({
  rootMargin = "200px 0px",
  ...props
}: LazyImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold: 0.01 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [rootMargin]);

  if (!props.fill && !props.width) {
    return <Image {...props} loading="lazy" />;
  }

  return (
    <div ref={containerRef} className={props.fill ? "absolute inset-0" : "contents"}>
      {visible ? (
        <Image {...props} loading="lazy" />
      ) : (
        <div
          className={props.fill ? "absolute inset-0 bg-zinc-900/40 animate-pulse" : undefined}
          aria-hidden
        />
      )}
    </div>
  );
}