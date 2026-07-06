import AnalyticsDashboard from "@/components/admin/AnalyticsDashboard";
import { getAnalyticsSummary } from "@/lib/analytics/queries";
import { isDatabaseConfigured } from "@/lib/db/client";

interface AdminDashboardPageProps {
  searchParams: Promise<{ days?: string }>;
}

export default async function AdminDashboardPage({ searchParams }: AdminDashboardPageProps) {
  const params = await searchParams;
  const daysRaw = Number(params.days);
  const days = daysRaw === 30 ? 30 : 7;
  const dbConfigured = isDatabaseConfigured();
  const data = dbConfigured ? await getAnalyticsSummary(days) : null;

  return <AnalyticsDashboard data={data} days={days} dbConfigured={dbConfigured} />;
}