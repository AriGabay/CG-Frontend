import { SETTING_KEYS, siteSettingService } from './siteSettingService';

/**
 * The catering week: orders are for Friday pickup only. Everything in this
 * module exists to let the admin punch holes in that rule for a single date,
 * in either direction, without a code change and a deploy.
 *
 * Two kinds of exception:
 *   blocked - a Friday that behaves like a Sun-Thu: not selectable.
 *   open    - a non-Friday that behaves like a Friday: selectable.
 *
 * They are stored as one JSON blob in the generic siteSetting key/value table,
 * which is already deployed end to end. A dedicated table would have needed a
 * new model, service, controller and route for data that is a handful of
 * strings.
 */
export const ORDER_DAY = 5; // Friday, per Date#getDay

const EMPTY = { blocked: [], open: [] };

/** Local-midnight 'yyyy-MM-dd'. Never use toISOString here: it shifts to UTC,
 *  which moves an Israeli evening date back a day. */
export function toDateKey(date) {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return '';
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${month}-${day}`;
}

/** 'yyyy-MM-dd' -> Date at local midnight. */
export function fromDateKey(key) {
  const [year, month, day] = String(key).split('-').map(Number);
  return new Date(year, month - 1, day);
}

/** 'yyyy-MM-dd' -> 'dd/MM/yyyy', the format shown to people everywhere else. */
export function formatDateKey(key) {
  const [year, month, day] = String(key).split('-');
  return `${day}/${month}/${year}`;
}

const isKey = (value) => /^\d{4}-\d{2}-\d{2}$/.test(value);

/**
 * Parse the stored blob defensively. Bad or missing data must degrade to "no
 * exceptions" — i.e. the plain Fridays-only rule — never to a broken calendar.
 */
export function parseExceptions(raw) {
  if (!raw) return { ...EMPTY };
  let parsed;
  try {
    parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
  } catch (error) {
    console.error('order date exceptions unreadable, ignoring', error);
    return { ...EMPTY };
  }
  if (!parsed || typeof parsed !== 'object') return { ...EMPTY };
  const clean = (list) =>
    Array.isArray(list) ? [...new Set(list.filter(isKey))].sort() : [];
  const blocked = clean(parsed.blocked);
  // A date in both lists is a contradiction the UI prevents, but old or
  // hand-edited data could still hold one. Blocking is the safe reading: it
  // closes a date rather than opening one nobody meant to open.
  const open = clean(parsed.open).filter((key) => !blocked.includes(key));
  return { blocked, open };
}

/** Can a customer order for this date? */
export function isOrderableDate(date, exceptions = EMPTY) {
  const key = toDateKey(date);
  if (!key) return false;
  if (exceptions.blocked?.includes(key)) return false;
  if (exceptions.open?.includes(key)) return true;
  return new Date(date).getDay() === ORDER_DAY;
}

/**
 * First orderable date on or after `from`. Used for the pickup-date default,
 * which can no longer be "next Friday" now that a Friday may be closed.
 * The 400-day window covers a year of blocked Fridays and still terminates.
 */
export function nextOrderableDate(from, exceptions = EMPTY) {
  const cursor = new Date(from);
  cursor.setHours(0, 0, 0, 0);
  for (let i = 0; i < 400; i += 1) {
    if (isOrderableDate(cursor, exceptions)) return cursor;
    cursor.setDate(cursor.getDate() + 1);
  }
  return cursor;
}

// Both the calendar and the checkout form need this on mount. Sharing one
// in-flight promise keeps that to a single request per page load.
let pending = null;

/**
 * Read the exceptions. Resolves to `{ blocked: [], open: [] }` if the setting
 * is missing or the API is unreachable — getSettings already swallows the
 * error — so the site keeps working on plain Fridays.
 */
export function getExceptions({ force = false } = {}) {
  if (force || !pending) {
    pending = siteSettingService
      .getSettings()
      .then((settings) =>
        parseExceptions(settings?.[SETTING_KEYS.orderDateExceptions])
      )
      .catch((error) => {
        console.error('order date exceptions unavailable, using none', error);
        return { ...EMPTY };
      });
  }
  return pending;
}

/** Admin-only write. Rejects so the screen can report the failure. */
export async function saveExceptions(exceptions) {
  const value = JSON.stringify({
    blocked: exceptions.blocked ?? [],
    open: exceptions.open ?? [],
  });
  const result = await siteSettingService.setSetting(
    SETTING_KEYS.orderDateExceptions,
    value
  );
  // Drop the cache so a customer's calendar picks the change up on next load
  // rather than serving the pre-save list for the rest of the session.
  pending = Promise.resolve(parseExceptions(value));
  return result;
}

export const orderDatesService = {
  getExceptions,
  saveExceptions,
  isOrderableDate,
  nextOrderableDate,
  toDateKey,
  fromDateKey,
  formatDateKey,
};
