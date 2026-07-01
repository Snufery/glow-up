"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const SESSION_KEY = "glowup_splash_seen";
const SPLASH_HOLD_MS = 900;
const SPLASH_EXIT_MS = 350;

type SplashPhase = "init" | "splash" | "exiting" | "ready";

interface BrandSplashProps {
  children: ReactNode;
}

function markSplashSeen(): void {
  try {
    sessionStorage.setItem(SESSION_KEY, "1");
  } catch {
    // sessionStorage unavailable
  }
}

function hasSeenSplash(): boolean {
  try {
    return sessionStorage.getItem(SESSION_KEY) === "1";
  } catch {
    return true;
  }
}

function shouldSkipSplash(pathname: string, reducedMotion: boolean): boolean {
  if (reducedMotion) return true;
  if (pathname.startsWith("/admin")) return true;
  if (pathname.startsWith("/cotizador")) return true;
  if (pathname !== "/") return true;
  if (hasSeenSplash()) return true;
  return false;
}

export default function BrandSplash({ children }: BrandSplashProps) {
  const pathname = usePathname();
  const reducedMotion = usePrefersReducedMotion();
  const [phase, setPhase] = useState<SplashPhase>("init");
  const [hydrated, setHydrated] = useState(false);

  const finishSplash = useCallback(() => {
    markSplashSeen();
    setPhase("ready");
  }, []);

  const skipSplash = useCallback(() => {
    markSplashSeen();
    setPhase("ready");
  }, []);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    if (shouldSkipSplash(pathname, reducedMotion)) {
      if (!hasSeenSplash()) {
        markSplashSeen();
      }
      setPhase("ready");
      return;
    }

    setPhase("splash");

    const exitTimer = window.setTimeout(() => {
      setPhase("exiting");
    }, SPLASH_HOLD_MS);

    const doneTimer = window.setTimeout(() => {
      finishSplash();
    }, SPLASH_HOLD_MS + SPLASH_EXIT_MS);

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(doneTimer);
    };
  }, [hydrated, pathname, reducedMotion, finishSplash]);

  const showOverlay = phase === "splash" || phase === "exiting";
  const showContent = phase === "exiting" || phase === "ready";

  return (
    <>
      <div
        className={`brand-splash-content ${showContent ? "brand-splash-content-visible" : ""}`}
        aria-hidden={!showContent}
      >
        {children}
      </div>

      {showOverlay ? (
        <div
          className={`brand-splash-overlay ${phase === "exiting" ? "brand-splash-overlay-exit" : ""}`}
          role="presentation"
          aria-hidden="true"
        >
          <button
            type="button"
            onClick={skipSplash}
            className="brand-splash-skip"
            aria-label="Saltar animacion de bienvenida"
          >
            Saltar
          </button>

          <div className="brand-splash-glow" />
          <div className="brand-splash-logo-wrap">
            <Image
              src="/ICONO.png"
              alt=""
              width={148}
              height={148}
              priority
              className="brand-splash-logo"
            />
          </div>
          <p className="brand-splash-tagline">
            <span className="brand-splash-tagline-title">Glow Up</span>
            <span className="brand-splash-tagline-sub">Entornos Inteligentes</span>
          </p>
        </div>
      ) : null}
    </>
  );
}