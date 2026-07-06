"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, Shield, Smartphone, Trash2, KeyRound } from "lucide-react";

interface DeviceRow {
  id: string;
  label: string;
  userAgent: string;
  createdAt: string;
  lastSeenAt: string;
  isCurrent: boolean;
}

function formatWhen(iso: string): string {
  try {
    return new Intl.DateTimeFormat("es-CO", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export default function TrustedDevicesPanel() {
  const [devices, setDevices] = useState<DeviceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [inviteExpiresAt, setInviteExpiresAt] = useState<string | null>(null);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [error, setError] = useState("");

  const loadDevices = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/devices");
      if (!res.ok) throw new Error("No se pudieron cargar los dispositivos");
      const data = (await res.json()) as { devices: DeviceRow[] };
      setDevices(data.devices);
    } catch {
      setError("No se pudieron cargar los dispositivos autorizados.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDevices();
  }, [loadDevices]);

  const handleCreateInvite = async () => {
    setInviteLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/devices/invite", { method: "POST" });
      const data = (await res.json()) as {
        code?: string;
        expiresAt?: string;
        error?: string;
      };
      if (!res.ok) throw new Error(data.error || "No se pudo generar el codigo");
      setInviteCode(data.code ?? null);
      setInviteExpiresAt(data.expiresAt ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al generar codigo");
    } finally {
      setInviteLoading(false);
    }
  };

  const handleRevoke = async (id: string) => {
    if (!window.confirm("¿Revocar este dispositivo? Ya no podra entrar al admin.")) return;
    setError("");
    try {
      const res = await fetch(`/api/admin/devices/${id}`, { method: "DELETE" });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error || "No se pudo revocar");
      await loadDevices();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al revocar");
    }
  };

  return (
    <div className="premium-card p-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Shield size={18} className="text-[var(--accent)]" />
            <h2 className="font-[var(--font-display)] font-bold">Dispositivos autorizados</h2>
          </div>
          <p className="text-xs text-zinc-500 leading-relaxed max-w-xl">
            Solo estos equipos pueden entrar al admin, aunque alguien conozca la contrasena.
            Para registrar tu celular, genera un codigo aqui desde tu PC y usalo al iniciar sesion.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void handleCreateInvite()}
          disabled={inviteLoading}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border border-[var(--accent)]/25 bg-[var(--accent)]/10 text-[var(--accent-bright)] hover:bg-[var(--accent)]/18 transition-all cursor-pointer shrink-0"
        >
          {inviteLoading ? <Loader2 size={14} className="animate-spin" /> : <KeyRound size={14} />}
          Codigo para nuevo dispositivo
        </button>
      </div>

      {inviteCode && (
        <div className="mb-5 rounded-xl border border-[var(--accent)]/20 bg-[var(--accent)]/8 px-4 py-3">
          <p className="text-xs text-zinc-400 mb-1">Codigo de registro (valido 10 min)</p>
          <p className="font-[var(--font-display)] text-2xl font-bold tracking-[0.3em] text-[var(--accent-bright)]">
            {inviteCode}
          </p>
          {inviteExpiresAt && (
            <p className="text-[10px] text-zinc-500 mt-1">
              Expira: {formatWhen(inviteExpiresAt)}
            </p>
          )}
          <p className="text-[10px] text-zinc-500 mt-2 leading-relaxed">
            En el celular: abre /admin/login, ingresa tu contrasena y este codigo en
            &quot;Registrar dispositivo&quot;.
          </p>
        </div>
      )}

      {error && <p className="text-xs text-red-400 mb-4">{error}</p>}

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-zinc-500 py-4">
          <Loader2 size={14} className="animate-spin" />
          Cargando dispositivos...
        </div>
      ) : devices.length === 0 ? (
        <p className="text-sm text-zinc-500">No hay dispositivos registrados aun.</p>
      ) : (
        <ul className="space-y-3">
          {devices.map((device) => (
            <li
              key={device.id}
              className="flex items-start gap-3 rounded-xl border border-white/[0.06] bg-zinc-900/40 px-4 py-3"
            >
              <div className="w-9 h-9 rounded-lg bg-[var(--accent)]/10 border border-[var(--accent)]/20 flex items-center justify-center text-[var(--accent)] shrink-0">
                <Smartphone size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold">{device.label}</p>
                  {device.isCurrent && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--accent)]/15 text-[var(--accent-bright)] border border-[var(--accent)]/20">
                      Este dispositivo
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-zinc-500 truncate mt-0.5">{device.userAgent}</p>
                <p className="text-[10px] text-zinc-600 mt-1">
                  Ultimo acceso: {formatWhen(device.lastSeenAt)}
                </p>
              </div>
              {!device.isCurrent && (
                <button
                  type="button"
                  onClick={() => void handleRevoke(device.id)}
                  className="p-2 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-400/10 transition-colors cursor-pointer"
                  aria-label={`Revocar ${device.label}`}
                >
                  <Trash2 size={14} />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}