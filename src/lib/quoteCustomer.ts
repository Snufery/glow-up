export interface QuoteCustomerInfo {
  name: string;
  phone: string;
}

export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("57") && digits.length === 12) return digits.slice(2);
  return digits;
}

export function formatPhoneDisplay(phone: string): string {
  const digits = normalizePhone(phone);
  if (digits.length !== 10) return phone.trim();
  return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
}

export function validateQuoteCustomer(
  name: string,
  phone: string
): { valid: boolean; errors: { name?: string; phone?: string } } {
  const trimmedName = name.trim();
  const normalized = normalizePhone(phone);
  const errors: { name?: string; phone?: string } = {};

  if (!trimmedName || trimmedName.length < 2) {
    errors.name = "Ingresa tu nombre completo";
  }

  if (!normalized || normalized.length !== 10 || !normalized.startsWith("3")) {
    errors.phone = "Ingresa un celular valido de 10 digitos (ej. 300 123 4567)";
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

export function buildCustomerInfo(info: QuoteCustomerInfo): QuoteCustomerInfo {
  return {
    name: info.name.trim(),
    phone: normalizePhone(info.phone),
  };
}

function slugifyName(name: string): string {
  const slug = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .join("")
    .replace(/[^a-zA-Z0-9]/g, "");

  return slug.slice(0, 20) || "Cliente";
}

function shortDateFromQuoteRef(quoteRef: string): string {
  const match = quoteRef.match(/^GU-(\d{4})(\d{2})(\d{2})/);
  if (!match) return "cotizacion";
  return `${match[1].slice(2)}${match[2]}${match[3]}`;
}

/** Ej: GlowUp-MariaLopez-250621.pdf */
export function buildQuoteFilename(quoteRef: string, customer: QuoteCustomerInfo): string {
  const name = slugifyName(customer.name);
  const date = shortDateFromQuoteRef(quoteRef);
  return `GlowUp-${name}-${date}.pdf`;
}