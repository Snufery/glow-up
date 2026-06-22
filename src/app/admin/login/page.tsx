"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Lock, Loader2 } from "lucide-react";
import { safeAdminRedirect } from "@/lib/adminRedirect";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = safeAdminRedirect(searchParams.get("next"));

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as {
          error?: string;
          locked?: boolean;
        };
        setError(data.error || "No se pudo iniciar sesion");
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
            Acceso privado — solo administrador
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