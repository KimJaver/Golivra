/** Affichage prix en FCFA (données locales). */
export function formatFcfa(amount: number): string {
  if (!Number.isFinite(amount)) return '—';
  return `${Math.round(amount).toLocaleString('fr-FR')} FCFA`;
}
