/**
 * Thin wrapper around the Google tag (gtag.js).
 *
 * The tag itself is loaded by the snippet in public/index.html, which also
 * defines window.gtag before anything else runs. Nothing here loads a script;
 * this only sends events, and it is safe to call before gtag.js has finished
 * downloading — the queue it writes to is replayed once the tag is ready.
 */

function send(eventName, params) {
  if (typeof window.gtag !== 'function') return;
  window.gtag('event', eventName, params);
}

/**
 * Announces a page the user reached without a document load. The snippet turns
 * off the automatic page view for exactly this reason, so every page view in
 * the reports — including the very first one — comes through here.
 */
function sendPageView({ path, title }) {
  send('page_view', {
    page_path: path,
    page_title: title,
    page_location: window.location.href,
  });
}

export const analyticsService = {
  send,
  sendPageView,
};
