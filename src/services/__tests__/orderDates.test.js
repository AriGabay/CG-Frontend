import {
  isOrderableDate,
  nextOrderableDate,
  parseExceptions,
  toDateKey,
  formatDateKey,
  fromDateKey,
} from '../orderDatesService';

const d = (s) => {
  const [y, m, day] = s.split('-').map(Number);
  return new Date(y, m - 1, day);
};

test('toDateKey stays on the local day', () => {
  // 23:30 local on the 2nd must not roll back to the 1st via UTC.
  expect(toDateKey(new Date(2026, 9, 2, 23, 30))).toBe('2026-10-02');
  expect(formatDateKey('2026-10-02')).toBe('02/10/2026');
  expect(toDateKey(fromDateKey('2026-10-02'))).toBe('2026-10-02');
});

test('plain rule: Fridays only', () => {
  const none = { blocked: [], open: [] };
  expect(d('2026-10-02').getDay()).toBe(5);
  expect(isOrderableDate(d('2026-10-02'), none)).toBe(true);
  expect(isOrderableDate(d('2026-10-01'), none)).toBe(false);
  expect(isOrderableDate(d('2026-10-03'), none)).toBe(false);
});

test('a blocked Friday behaves like Sun-Thu', () => {
  const ex = { blocked: ['2026-10-02'], open: [] };
  expect(isOrderableDate(d('2026-10-02'), ex)).toBe(false);
  expect(isOrderableDate(d('2026-10-09'), ex)).toBe(true);
});

test('an opened weekday becomes orderable', () => {
  const ex = { blocked: [], open: ['2026-10-01'] };
  expect(isOrderableDate(d('2026-10-01'), ex)).toBe(true);
});

test('next orderable date skips a blocked Friday', () => {
  const ex = { blocked: ['2026-10-02'], open: [] };
  expect(toDateKey(nextOrderableDate(d('2026-09-30'), ex))).toBe('2026-10-09');
});

test('next orderable date can land on an opened weekday', () => {
  const ex = { blocked: ['2026-10-02'], open: ['2026-10-05'] };
  expect(toDateKey(nextOrderableDate(d('2026-09-30'), ex))).toBe('2026-10-05');
});

test('next orderable date returns today when today is orderable', () => {
  expect(toDateKey(nextOrderableDate(d('2026-10-02'), { blocked: [], open: [] })))
    .toBe('2026-10-02');
});

test('bad stored data degrades to the plain Friday rule', () => {
  expect(parseExceptions(undefined)).toEqual({ blocked: [], open: [] });
  expect(parseExceptions('not json')).toEqual({ blocked: [], open: [] });
  expect(parseExceptions('[1,2]')).toEqual({ blocked: [], open: [] });
  expect(parseExceptions('{"blocked":["nope","2026-10-02"]}')).toEqual({
    blocked: ['2026-10-02'],
    open: [],
  });
});

test('a date in both lists stays blocked', () => {
  const ex = parseExceptions(
    '{"blocked":["2026-10-02"],"open":["2026-10-02"]}'
  );
  expect(ex.open).toEqual([]);
  expect(isOrderableDate(d('2026-10-02'), ex)).toBe(false);
});
