import { loadQuoteDraft } from "@/lib/db/quoteDrafts";
import { checkIpRateLimit, getClientIp } from "@/lib/requestSecurity";

export const runtime = "nodejs";

function sanitizeToken(token: string): string | null {
  if (!/^[A-Za-z0-9_-]{8,24}$/.test(token)) return null;
  return token;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const ip = getClientIp(request);
    const rate = checkIpRateLimit(`quote-draft-read:${ip}`, 60, 10 * 60 * 1000);
    if (!rate.allowed) {
      return Response.json(
        { error: "Demasiadas solicitudes" },
        { status: 429 }
      );
    }

    const { token: rawToken } = await params;
    const token = sanitizeToken(rawToken);
    if (!token) {
      return Response.json({ error: "Token invalido" }, { status: 400 });
    }

    const draft = await loadQuoteDraft(token);
    if (!draft) {
      return Response.json({ error: "Proyecto no encontrado o expirado" }, { status: 404 });
    }

    return Response.json({ draft });
  } catch (error) {
    console.error("Error cargando borrador:", error);
    return Response.json({ error: "Error al cargar" }, { status: 500 });
  }
}