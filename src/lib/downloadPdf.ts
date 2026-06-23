function filenameFromContentDisposition(header: string | null): string | null {
  if (!header) return null;
  const match = header.match(/filename="?([^";\n]+)"?/i);
  return match?.[1]?.trim() || null;
}

export async function downloadPdfFromResponse(response: Response, filename: string): Promise<void> {
  if (!response.ok) {
    const message = (await response.text()).trim() || "No se pudo generar el PDF";
    throw new Error(message);
  }

  const resolvedFilename =
    filenameFromContentDisposition(response.headers.get("Content-Disposition")) || filename;

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = resolvedFilename;
  anchor.style.display = "none";
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export async function downloadPdfViaFetch(
  url: string,
  payload: object,
  filename: string,
  method: "GET" | "POST" = "POST"
): Promise<void> {
  const response = await fetch(url, {
    method,
    headers: method === "POST" ? { "Content-Type": "application/json" } : undefined,
    body: method === "POST" ? JSON.stringify(payload) : undefined,
  });

  await downloadPdfFromResponse(response, filename);
}