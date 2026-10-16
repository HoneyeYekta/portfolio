/** Dates in the data files are "YYYY-MM" strings; null means "present". */
export type Month = string | null | undefined;

function parse(s: string): { y: number; m: number } {
  const [y, m] = s.split('-').map(Number);
  return { y, m: m || 1 };
}

/** Year as a decimal, e.g. 2021-03 -> 2021.1667. Null/undefined -> now. */
export function toFraction(s: Month, now = new Date()): number {
  if (!s) return now.getFullYear() + now.getMonth() / 12;
  const { y, m } = parse(s);
  return y + (m - 1) / 12;
}

const fmt = new Intl.DateTimeFormat('en-GB', { month: 'short', year: 'numeric', timeZone: 'UTC' });

export function fmtMonth(s: Month): string {
  if (!s) return 'Present';
  const { y, m } = parse(s);
  return fmt.format(new Date(Date.UTC(y, m - 1, 1)));
}

export function fmtRange(from: string, to: Month): string {
  return `${fmtMonth(from)} – ${fmtMonth(to)}`;
}

export function durationLabel(from: string, to: Month, now = new Date()): string {
  const months = Math.max(1, Math.round((toFraction(to, now) - toFraction(from, now)) * 12));
  const y = Math.floor(months / 12);
  const m = months % 12;
  const parts: string[] = [];
  if (y) parts.push(`${y} yr${y > 1 ? 's' : ''}`);
  if (m) parts.push(`${m} mo`);
  return parts.join(' ');
}
