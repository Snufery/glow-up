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