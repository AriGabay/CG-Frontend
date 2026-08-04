/**
 * Stores the visitor's cookie decision and reports it to the Google tag.
 *
 * The tag snippet in public/index.html sets the defaults and restores a saved
 * decision before the tag loads; this module owns everything from the moment
 * the banner appears onwards. Both read the same key, and the stored value is
 * deliberately just 'granted' or 'denied' so the two can never drift.
 *
 * Everyone is asked. What the answer *changes* depends on where they are, and
 * that is decided in the snippet rather than here: in the EEA and the UK
 * storage starts denied, so the banner is the only way to switch tracking on,
 * which is the prior opt-in ePrivacy requires. Everywhere else storage starts
 * granted and the banner is notice plus a genuine way to refuse — the
 * transparency Israeli law expects. Google resolves which case applies by IP
 * through the region list, something a browser cannot do for itself, so this
 * module deliberately makes no attempt to guess the visitor's location.
 */

const STORAGE_KEY = 'cg-consent';

function readDecision() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === 'granted' || stored === 'denied' ? stored : null;
  } catch (error) {
    // Safari in private mode throws rather than returning null.
    return null;
  }
}

function shouldAsk() {
  return !readDecision();
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
  shouldAsk,
  decide,
};
