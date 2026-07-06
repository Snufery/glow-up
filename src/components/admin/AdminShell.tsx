"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  LogOut,
  ExternalLink,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex">
      <aside className="hidden md:flex w-60 flex-col border-r border-white/[0.06] bg-zinc-950/90">
        <div className="px-5 py-6 border-b border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <Image src="/logo.png" alt="Glow Up" width={36} height={36} className="h-9 w-9" />
            <div>
              <p className="text-sm font-bold font-[var(--font-display)]">
                <span className="text-brand-glow">Glow</span>{" "}
                <span className="text-brand-up">Up</span>
              </p>
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Admin</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? "bg-[var(--accent)]/12 text-[var(--accent-bright)] border border-[var(--accent)]/20"
                    : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-white/[0.06] space-y-1">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-zinc-500 hover:text-white hover:bg-white/[0.04] transition-all"
          >
            <ExternalLink size={16} />
            Ver sitio publico
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-zinc-500 hover:text-red-400 hover:bg-red-400/5 transition-all cursor-pointer"
          >
            <LogOut size={16} />
            Cerrar sesion
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden flex items-center justify-between px-4 h-14 border-b border-white/[0.06] glass">
          <span className="text-sm font-bold font-[var(--font-display)]">Panel Admin</span>
          <button
            type="button"
            onClick={handleLogout}
            className="text-xs text-zinc-500 hover:text-red-400 cursor-pointer"
          >
            Salir
          </button>
        </header>

        <div className="md:hidden flex gap-1 p-2 border-b border-white/[0.06] overflow-x-auto">
          {navItems.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
                  active ? "bg-[var(--accent)]/15 text-[var(--accent-bright)]" : "text-zinc-500"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}