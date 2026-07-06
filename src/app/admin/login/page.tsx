"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Lock, Loader2, Shield, ChevronDown, ChevronUp } from "lucide-react";
import { safeAdminRedirect } from "@/lib/adminRedirect";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = safeAdminRedirect(searchParams.get("next"));
  const urlError = searchParams.get("error");

  const [password, setPassword] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [showRegister, setShowRegister] = useState(false);
  const [error, setError] = useState(
    urlError === "device"
      ? "Tu sesion expiro o este dispositivo ya no esta autorizado."
      : ""
  );
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password,
          inviteCode: inviteCode.trim() || undefined,
        }),
      });

      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        code?: string;
        locked?: boolean;
        bootstrapped?: boolean;
      };

      if (!res.ok) {
        setError(data.error || "No se pudo iniciar sesion");
        if (data.code === "DEVICE_NOT_TRUSTED" || data.code === "INVALID_INVITE") {
          setShowRegister(true);
        }
        if (data.locked) setPassword("");
        return;
      }

      router.replace(next);
      router.refresh();
    } catch {
      setError("Error de conexion. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <Image src="/logo.png" alt="Glow Up" width={56} height={56} className="h-14 w-14 mb-4" />
          <h1 className="font-[var(--font-display)] text-xl font-bold">
            <span className="text-brand-glow">Glow</span>{" "}
            <span className="text-brand-up">Up</span> Admin
          </h1>
          <p className="text-xs text-zinc-500 mt-2 text-center">
            Acceso privado — solo dispositivos autorizados
          </p>
        </div>

        <div className="glass rounded-2xl p-4 mb-4 border border-[var(--accent)]/15 flex gap-3">
          <Shield size={16} className="text-[var(--accent)] flex-shrink-0 mt-0.5" />
          <p className="text-[11px] text-zinc-500 leading-relaxed">
            Solo tu PC y celular personal pueden entrar. Si intentas desde otro equipo, se
            bloqueara aunque la contrasena sea correcta.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 space-y-4 border border-white/[0.08]">
          <div>
            <label htmlFor="admin-password" className="block text-xs font-medium text-zinc-400 mb-2">
              Contrasena de administrador
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input pl-11"
                placeholder="Tu contrasena secreta"
                autoComplete="current-password"
                required
              />
            </div>
          </div>

          <div>
            <button
              type="button"
              onClick={() => setShowRegister((v) => !v)}
              className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
            >
              {showRegister ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              Registrar nuevo dispositivo (celular u otro PC)
            </button>

            {showRegister && (
              <div className="mt-3">
                <label htmlFor="invite-code" className="block text-xs font-medium text-zinc-400 mb-2">
                  Codigo de registro (6 digitos)
                </label>
                <input
                  id="invite-code"
                  type="text"
                  inputMode="numeric"
                  pattern="\d{6}"
                  maxLength={6}
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="form-input tracking-[0.35em] text-center font-semibold"
                  placeholder="000000"
                />
                <p className="text-[10px] text-zinc-600 mt-2 leading-relaxed">
                  Codigo de 6 digitos desde el panel admin (10 min), o clave de recuperacion
                  (ADMIN_DEVICE_RECOVERY_KEY en Vercel) si perdiste acceso en todos los equipos.
                </p>
              </div>
            )}
          </div>

          {error && <p className="text-xs text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3 justify-center disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin relative z-[1]" />
                <span className="relative z-[1]">Entrando...</span>
              </>
            ) : (
              <span className="relative z-[1]">Entrar al panel</span>
            )}
          </button>
        </form>

        <p className="text-[10px] text-zinc-600 text-center mt-6">
          Esta area no es visible para clientes. No compartas esta URL.
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-zinc-950" />}>
      <AdminLoginForm />
    </Suspense>
  );
}