"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const SESSION_KEY = "glowup_splash_seen";
const SPLASH_HOLD_MS = 1200;
const SPLASH_EXIT_MS = 400;
const SPLASH_AUDIO_SRC = "/sonido/intro.mp3";
const SPLASH_AUDIO_VOLUME = 0.55;

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
  const splashAudioRef = useRef<HTMLAudioElement>(null);
  const splashStartedAtRef = useRef<number | null>(null);

  const syncAudioToSplash = useCallback((audio: HTMLAudioElement) => {
    if (splashStartedAtRef.current === null) return;
    const elapsed = (performance.now() - splashStartedAtRef.current) / 1000;
    const duration = Number.isFinite(audio.duration) && audio.duration > 0 ? audio.duration : 1;
    audio.currentTime = Math.min(Math.max(elapsed, 0), duration);
  }, []);

  const startSplashAudio = useCallback(
    (syncToElapsed: boolean) => {
      const audio = splashAudioRef.current;
      if (!audio || reducedMotion) return;
      if (!audio.paused && audio.currentTime > 0) return;

      audio.volume = SPLASH_AUDIO_VOLUME;
      if (syncToElapsed) {
        syncAudioToSplash(audio);
      } else {
        audio.currentTime = 0;
      }

      void audio.play().catch(() => {
        // Autoplay bloqueado: se reintenta con interaccion del usuario
      });
    },
    [reducedMotion, syncAudioToSplash]
  );

  const stopSplashAudio = useCallback(() => {
    const audio = splashAudioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
  }, []);

  const unlockSplashAudio = useCallback(() => {
    const audio = splashAudioRef.current;
    if (!audio || reducedMotion) return;

    audio.volume = SPLASH_AUDIO_VOLUME;
    syncAudioToSplash(audio);
    void audio.play().catch(() => {});
  }, [reducedMotion, syncAudioToSplash]);

  const finishSplash = useCallback(() => {
    markSplashSeen();
    setPhase("ready");
  }, []);

  const skipSplash = useCallback(() => {
    stopSplashAudio();
    markSplashSeen();
    setPhase("ready");
  }, [stopSplashAudio]);

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

    splashStartedAtRef.current = performance.now();
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

  useLayoutEffect(() => {
    if (phase !== "splash" || reducedMotion) return;

    const audio = splashAudioRef.current;
    if (!audio) return;

    const attemptAutoplay = () => startSplashAudio(false);

    if (audio.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
      attemptAutoplay();
      return;
    }

    const onReady = () => attemptAutoplay();
    audio.addEventListener("canplaythrough", onReady, { once: true });
    audio.load();

    return () => {
      audio.removeEventListener("canplaythrough", onReady);
    };
  }, [phase, reducedMotion, startSplashAudio]);

  useEffect(() => {
    if (phase !== "splash" || reducedMotion) return;

    window.addEventListener("pointerdown", unlockSplashAudio, { passive: true, capture: true });
    window.addEventListener("touchstart", unlockSplashAudio, { passive: true, capture: true });
    window.addEventListener("keydown", unlockSplashAudio, { capture: true });

    return () => {
      window.removeEventListener("pointerdown", unlockSplashAudio, { capture: true });
      window.removeEventListener("touchstart", unlockSplashAudio, { capture: true });
      window.removeEventListener("keydown", unlockSplashAudio, { capture: true });
    };
  }, [phase, reducedMotion, unlockSplashAudio]);

  const showOverlay = phase === "splash" || phase === "exiting";
  const showContent = phase === "exiting" || phase === "ready";

  return (
    <>
      <audio
        ref={splashAudioRef}
        src={SPLASH_AUDIO_SRC}
        preload="auto"
        playsInline
        className="absolute w-px h-px opacity-0 overflow-hidden pointer-events-none"
        aria-hidden="true"
      />

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
          onPointerDown={unlockSplashAudio}
          onTouchStart={unlockSplashAudio}
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