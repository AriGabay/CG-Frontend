import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_HOST;
const endpoint = 'siteSetting/';

/** Keys the admin can edit. Kept here so the screen and the readers agree. */
export const SETTING_KEYS = {
  // Replaces the pickup line in the PDF-menu notice. The admin owns this text
  // because only they know the arrangement for the holiday being announced.
  pdfMenuNotice: 'pdf_menu_notice',
};

/**
 * Read settings WITHOUT going through httpService.
 *
 * httpService.get sends the browser to /404 on any failed read, which is right
 * for a page whose content is missing but wrong here: the front end and the API
 * deploy separately, so there is a window where this endpoint does not exist
 * yet, and a missing piece of optional copy must never take the site down.
 * Callers get `{}` and fall back to their defaults.
 */
async function getSettings() {
  try {
    const res = await axios.get(`${BASE_URL}${endpoint}`);
    return res.data && typeof res.data === 'object' ? res.data : {};
  } catch (error) {
    console.error('site settings unavailable, using defaults', error);
    return {};
  }
}

/** Admin-only write. Rejects so the screen can report the failure. */
async function setSetting(key, value) {
  const res = await axios.post(`${BASE_URL}${endpoint}`, { key, value });
  return res.data;
}

export const siteSettingService = { getSettings, setSetting };
