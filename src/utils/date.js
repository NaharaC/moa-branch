// Formatos comunes de fecha (Chile): dd/MM/yyyy y relativeTime.

const LOCALE = 'es-CL';
const TIME_ZONE = 'America/Santiago';

// --- Helpers ---
function toDate(d) {
  if (d instanceof Date) return isNaN(d.getTime()) ? null : d;
  if (typeof d === 'string' || typeof d === 'number') {
    const parsed = new Date(d);
    return isNaN(parsed.getTime()) ? null : parsed;
  }
  return null;
}

function partsRecord(date) {
  const parts = new Intl.DateTimeFormat(LOCALE, {
    timeZone: TIME_ZONE,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).formatToParts(date);

  const out = {};
  for (const p of parts) out[p.type] = p.value;
  // defaults por si acaso
  if (!out.day) out.day = '';
  if (!out.month) out.month = '';
  if (!out.year) out.year = '';
  return out;
}

/** dd/MM/yyyy (ej: 30/10/2025) */
function formatDate_ddMMyyyy(dateLike, fallback = '') {
  const d = toDate(dateLike);
  if (!d) return fallback;
  const p = partsRecord(d);
  return `${p.day}/${p.month}/${p.year}`;
}

/** Relative time ("hace X días") */
function relativeTime(fromDateLike, toDateLike = new Date(), fallback = '') {
  const from = toDate(fromDateLike);
  const to = toDate(toDateLike);
  if (!from || !to) return fallback;

  const rtf = new Intl.RelativeTimeFormat(LOCALE, { numeric: 'always' });

  const MS_PER_UNIT = {
    year:   365 * 24 * 60 * 60 * 1000,
    month:   30 * 24 * 60 * 60 * 1000,
    week:     7 * 24 * 60 * 60 * 1000,
    day:         24 * 60 * 60 * 1000,
    hour:             60 * 60 * 1000,
    minute:                60 * 1000,
    second:                    1000,
  };

  const diffMs = from.getTime() - to.getTime();
  const order = ['year', 'month', 'week', 'day', 'hour', 'minute', 'second'];

  for (const unit of order) {
    const value = diffMs / MS_PER_UNIT[unit];
    if (Math.abs(value) >= 1 || unit === 'second') {
      return rtf.format(Math.round(value), unit);
    }
  }
  return fallback;
}

export { formatDate_ddMMyyyy, relativeTime };
