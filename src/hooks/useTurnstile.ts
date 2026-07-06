"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { isTurnstileEnabledClient, TURNSTILE_SITE_KEY } from "@/lib/turnstileClient";

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
          theme?: "light" | "dark" | "auto";
        }
      ) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
    onTurnstileLoad?: () => void;
  }
}

let scriptPromise: Promise<void> | null = null;

function loadTurnstileScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.turnstile) return Promise.resolve();

  if (!scriptPromise) {
    scriptPromise = new Promise((resolve, reject) => {
      window.onTurnstileLoad = () => resolve();
      const existing = document.querySelector('script[data-turnstile="true"]');
      if (existing) {
        if (window.turnstile) {
          resolve();
          return;
        }
        existing.addEventListener("load", () => resolve(), { once: true });
        return;
      }

      const script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileLoad";
      script.async = true;
      script.defer = true;
      script.dataset.turnstile = "true";
      script.onerror = () => reject(new Error("No se pudo cargar Turnstile"));
      document.head.appendChild(script);
    });
  }

  return scriptPromise;
}

export function useTurnstile(options?: { enabled?: boolean }) {
  const enabled = options?.enabled ?? true;
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [ready, setReady] = useState(!isTurnstileEnabledClient());
  const [error, setError] = useState<string | null>(null);
  const required = isTurnstileEnabledClient() && enabled;

  const reset = useCallback(() => {
    setToken(null);
    if (widgetIdRef.current && window.turnstile) {
      window.turnstile.reset(widgetIdRef.current);
    }
  }, []);

  useEffect(() => {
    if (!isTurnstileEnabledClient() || !enabled) {
      setToken(null);
      setError(null);
      return;
    }

    let cancelled = false;

    void loadTurnstileScript()
      .then(() => {
        if (cancelled || !containerRef.current || !window.turnstile) return;

        if (widgetIdRef.current) {
          window.turnstile.remove(widgetIdRef.current);
          widgetIdRef.current = null;
        }

        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: TURNSTILE_SITE_KEY,
          theme: "dark",
          callback: (value) => {
            setToken(value);
            setError(null);
          },
          "expired-callback": () => setToken(null),
          "error-callback": () => {
            setToken(null);
            setError("No se pudo verificar. Intenta de nuevo.");
          },
        });

        setReady(true);
      })
      .catch(() => {
        if (!cancelled) {
          setError("Verificacion anti-bot no disponible.");
          setReady(false);
        }
      });

    return () => {
      cancelled = true;
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [enabled]);

  return {
    required,
    ready,
    token,
    error,
    containerRef,
    reset,
    canSubmit: !required || Boolean(token),
  };
}