/**
 * Stores the visitor's cookie decision and reports it to the Google tag.
 *
 * The tag snippet in public/index.html sets the defaults and restores a saved
 * decision before the tag loads; this module owns everything from the moment
 * the banner appears onwards. Both read the same key, and the stored value is
 * deliberately just 'granted' or 'denied' so the two can never drift.
 */

const STORAGE_KEY = 'cg-consent';

/**
 * Which visitors are *shown* the banner. Enforcement is a separate matter and
 * belongs to Google, which denies storage by IP geolocation through the region
 * list in the snippet — something a browser cannot determine for itself.
 *
 * That split is what makes a wrong guess here harmless in both directions: a
 * European we fail to recognise stays denied, and an Israeli we ask needlessly
 * sees one extra prompt. The zones are the EEA plus the United Kingdom.
 */
const CONSENT_REQUIRED_TIME_ZONES = [
  'Africa/Ceuta',
  'Asia/Famagusta',
  'Asia/Nicosia',
  'Atlantic/Azores',
  'Atlantic/Canary',
  'Atlantic/Madeira',
  'Atlantic/Reykjavik',
  'Europe/Amsterdam',
  'Europe/Athens',
  'Europe/Berlin',
  'Europe/Bratislava',
  'Europe/Brussels',
  'Europe/Bucharest',
  'Europe/Budapest',
  'Europe/Busingen',
  'Europe/Copenhagen',
  'Europe/Dublin',
  'Europe/Helsinki',
  'Europe/Lisbon',
  'Europe/Ljubljana',
  'Europe/London',
  'Europe/Luxembourg',
  'Europe/Madrid',
  'Europe/Malta',
  'Europe/Oslo',
  'Europe/Paris',
  'Europe/Prague',
  'Europe/Riga',
  'Europe/Rome',
  'Europe/Sofia',
  'Europe/Stockholm',
  'Europe/Tallinn',
  'Europe/Vaduz',
  'Europe/Vienna',
  'Europe/Vilnius',
  'Europe/Warsaw',
  'Europe/Zagreb',
];

function readDecision() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === 'granted' || stored === 'denied' ? stored : null;
  } catch (error) {
    // Safari in private mode throws rather than returning null.
    return null;
  }
}

function isConsentRequired() {
  try {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return CONSENT_REQUIRED_TIME_ZONES.indexOf(timeZone) !== -1;
  } catch (error) {
    // Without a readable time zone we cannot place the visitor. Staying quiet
    // leaves them on the defaults, which is the safe half of the trade: a
    // European keeps their storage denied, they just cannot lift it.
    return false;
  }
}

function shouldAsk() {
  return !readDecision() && isConsentRequired();
}

/**
 * Records the answer and tells the tag about it. Saving first means a browser
 * that refuses storage still gets the tag updated for the rest of the visit.
 */
function decide(decision) {
  try {
    window.localStorage.setItem(STORAGE_KEY, decision);
  } catch (error) {
    // Nothing to do — the banner will simply ask again next time.
  }

  if (typeof window.gtag !== 'function') return;
  window.gtag('consent', 'update', {
    ad_storage: decision,
    ad_user_data: decision,
    ad_personalization: decision,
    analytics_storage: decision,
  });
}

export const consentService = {
  readDecision,
  isConsentRequired,
  shouldAsk,
  decide,
};
