const SAUDI_COUNTRY_CODE = "966";

export function normalizeSaudiPhone(phone: string): string | null {
  if (!phone) return null;

  let cleaned = phone.replace(/[\s\-\(\)]/g, "");

  if (cleaned.startsWith("+")) cleaned = cleaned.substring(1);
  if (cleaned.startsWith(SAUDI_COUNTRY_CODE))
    cleaned = cleaned.substring(SAUDI_COUNTRY_CODE.length);
  if (cleaned.startsWith("0")) cleaned = cleaned.substring(1);

  if (!/^5\d{8}$/.test(cleaned)) return null;

  return cleaned;
}

export function formatPhoneForDisplay(phone: string): string {
  const n = normalizeSaudiPhone(phone);
  if (!n) return phone;
  return `+966 ${n.substring(0, 2)} ${n.substring(2, 5)} ${n.substring(5)}`;
}

export function formatPhoneForAuth(phone: string): string {
  const n = normalizeSaudiPhone(phone);
  if (!n) return phone;
  return `+966${n}`;
}
