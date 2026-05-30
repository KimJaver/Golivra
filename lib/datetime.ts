export type TimelineStep = {
  key: string;
  label: string;
  at: string;
  label_fr?: string | null;
};

/** Date + heure en français (ex. « 23 mai 2026, 14:32 »). */
export function formatDateTimeFr(iso?: string | null): string {
  if (!iso) return '—';
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '—';
    return d.toLocaleString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '—';
  }
}

/** Heure seule (ex. « 14:32 »). */
export function formatTimeFr(iso?: string | null): string {
  if (!iso) return '';
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

export function stepLabel(step: TimelineStep): string {
  return step.label_fr || formatDateTimeFr(step.at);
}
