import { useEffect, useState } from 'react';
import { getExceptions } from '../services/orderDatesService';

const EMPTY = { blocked: [], open: [] };

/**
 * Admin-managed exceptions to the Fridays-only ordering rule, for the calendar
 * and the checkout form.
 *
 * Starts as "no exceptions" rather than blocking render, so the calendar shows
 * the normal Fridays immediately and only narrows once the setting arrives.
 * `loading` is exposed for callers that must not act on the empty default —
 * the checkout form uses it to avoid picking a default date twice.
 */
export function useOrderDateExceptions() {
  const [exceptions, setExceptions] = useState(EMPTY);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    getExceptions().then((result) => {
      if (!alive) return;
      setExceptions(result);
      setLoading(false);
    });
    return () => {
      alive = false;
    };
  }, []);

  return { exceptions, loading };
}
