import { execSync } from "child_process";

const rules = [
  {
    name: "Rate limit admin login",
    path: "/api/admin/login",
    window: 60,
    requests: 10,
  },
  {
    name: "Rate limit cotizacion PDF",
    path: "/api/cotizacion/pdf",
    window: 60,
    requests: 8,
  },
  {
    name: "Rate limit analytics events",
    path: "/api/analytics/event",
    window: 60,
    requests: 90,
  },
  {
    name: "Rate limit cotizacion save",
    path: "/api/cotizacion/save",
    window: 60,
    requests: 15,
  },
];

for (const rule of rules) {
  const pathCond = JSON.stringify({ type: "path", op: "pre", value: rule.path });
  const methodCond = JSON.stringify({ type: "method", op: "eq", value: "POST" });

  console.log(`Adding: ${rule.name}`);
  try {
    execSync(
      [
        "npx vercel firewall rules add",
        JSON.stringify(rule.name),
        "--condition",
        JSON.stringify(pathCond),
        "--condition",
        JSON.stringify(methodCond),
        "--action",
        "rate_limit",
        "--rate-limit-window",
        String(rule.window),
        "--rate-limit-requests",
        String(rule.requests),
        "--rate-limit-keys",
        "ip",
        "--rate-limit-action",
        "rate_limit",
        "--yes",
      ].join(" "),
      { stdio: "inherit", shell: true }
    );
    console.log(`OK: ${rule.name}\n`);
  } catch {
    console.error(`FAIL: ${rule.name}\n`);
    process.exitCode = 1;
  }
}

console.log("Publishing firewall rules...");
try {
  execSync("npx vercel firewall publish --yes", { stdio: "inherit", shell: true });
  console.log("Published.");
} catch {
  console.error("Publish failed.");
  process.exitCode = 1;
}