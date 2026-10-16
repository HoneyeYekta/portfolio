/**
 * Dates in the data files are "YYYY-MM" strings, or just "YYYY" when only the
 * year is known. null means "present".
 */
export type Month = string | null | undefined;

function parse(s: string): { y: number; m: number; hasMonth: boolean } {
  const [y, m] = s.split('-').map(Number);
  const hasMonth = Number.isFinite(m) && m > 0;
  return { y, m: hasMonth ? m : 1, hasMonth };
}

export function hasMonth(s: Month): boolean {
  return Boolean(s) && parse(s as string).hasMonth;
}

function nowFraction(now: Date): number {
  return now.getFullYear() + now.getMonth() / 12;
}

/**
 * Year as a decimal, e.g. 2021-03 -> 2021.1667. Null/undefined -> now.
 * A year-only value counts from the start of that year; as an end date it
 * runs to the end of that year (but never past today).
 */
export function toFraction(s: Month, now = new Date(), end = false): number {
  if (!s) return nowFraction(now);
  const { y, m, hasMonth } = parse(s);
  if (!hasMonth && end) return Math.min(y + 1, nowFraction(now));
  return y + (m - 1) / 12;
}

const fmt = new Intl.DateTimeFormat('en-GB', { month: 'short', year: 'numeric', timeZone: 'UTC' });

export function fmtMonth(s: Month): string {
  if (!s) return 'Present';
  const { y, m, hasMonth } = parse(s);
  return hasMonth ? fmt.format(new Date(Date.UTC(y, m - 1, 1))) : String(y);
}

export function fmtRange(from: string, to: Month): string {
  return `${fmtMonth(from)} – ${fmtMonth(to)}`;
}

/** "1 yr 6 mo"; empty when either side is only known to the year. */
export function durationLabel(from: string, to: Month, now = new Date()): string {
  if (!hasMonth(from) || (to && !hasMonth(to))) return '';
  const months = Math.max(1, Math.round((toFraction(to, now) - toFraction(from, now)) * 12));
  const y = Math.floor(months / 12);
  const m = months % 12;
  const parts: string[] = [];
  if (y) parts.push(`${y} yr${y > 1 ? 's' : ''}`);
  if (m) parts.push(`${m} mo`);
  return parts.join(' ');
}
