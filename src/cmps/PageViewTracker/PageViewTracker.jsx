import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { analyticsService } from '../../services/analytics.service';

/**
 * react-helmet writes the document title inside a requestAnimationFrame, so the
 * title is still the previous page's at the moment this effect runs. Waiting a
 * beat lets it land first. A plain timer is used rather than another animation
 * frame on purpose: frames are not scheduled at all in a background tab, which
 * would drop the page view of anyone opening the site in one.
 */
const TITLE_SETTLE_MS = 100;

/**
 * Reports every route change to Google Analytics. Renders nothing — it only
 * needs to sit inside the router to see the location.
 */
export function PageViewTracker() {
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      analyticsService.sendPageView({
        path: location.pathname + location.search,
        title: document.title,
      });
    }, TITLE_SETTLE_MS);

    return () => clearTimeout(timer);
  }, [location.pathname, location.search]);

  return null;
}
