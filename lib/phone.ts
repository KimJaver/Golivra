export const COUNTRY_CODE = '+242';

export function formatCgPhone(value: string): string {
  const digits = value.replace(/\D/g, '');
  const nationalDigits = digits.startsWith('242') ? digits.slice(3, 12) : digits.slice(0, 9);

  const part1 = nationalDigits.slice(0, 2);
  const part2 = nationalDigits.slice(2, 5);
  const part3 = nationalDigits.slice(5, 7);
  const part4 = nationalDigits.slice(7, 9);
  const chunks = [part1, part2, part3, part4].filter(Boolean).join(' ');

  return chunks ? `${COUNTRY_CODE} ${chunks}` : `${COUNTRY_CODE} `;
}

export function toCgE164(value: string): string | null {
  const digits = value.replace(/\D/g, '');
  const nationalDigits = digits.startsWith('242') ? digits.slice(3, 12) : digits.slice(0, 9);
  if (nationalDigits.length !== 9) return null;
  return `+242${nationalDigits}`;
}
