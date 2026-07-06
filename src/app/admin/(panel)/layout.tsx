import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import { verifyCurrentAdminDevice } from "@/lib/adminDeviceAuth";

export const metadata: Metadata = {
  title: "Admin — Glow Up",
  robots: { index: false, follow: false },
};

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const deviceOk = await verifyCurrentAdminDevice();
  if (!deviceOk) {
    redirect("/admin/login?error=device");
  }

  return <AdminShell>{children}</AdminShell>;
}