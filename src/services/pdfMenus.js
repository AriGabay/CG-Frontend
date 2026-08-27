import roshHashana2026 from '../cmps/PdfViewerPopup/Menu_RoshHashana_2026.pdf';

/**
 * Menus that are presented as a PDF rather than as an orderable grid.
 *
 * A menu listed here is not something a customer can put in a cart: while it is
 * switched on, the whole site is locked behind a notice showing this PDF and
 * the phone number, because the only way to order it is by phone.
 *
 * This is the single place that decides which menus behave that way. Today only
 * חגי תשרי does; if פסח is ever published as a PDF too, adding it here is the
 * whole change — the lock, the route and the copy all read from this map.
 */
export const PDF_MENUS = {
  tishray: {
    label: 'חגי תשרי',
    pdf: roshHashana2026,
  },
};

export const isPdfMenu = (menuType) => !!PDF_MENUS[menuType];

/**
 * Whether an open PDF menu takes the whole site over.
 *
 * Stored as a row in the same isMenuEnable table the menu switches use, so it
 * needs no schema change and is managed from the admin panel. Absent means OFF:
 * a PDF menu can perfectly well run alongside an orderable one, and defaulting
 * to a site-wide lock would take the shop down the moment a holiday menu is
 * published.
 */
export const LOCK_FLAG = 'lock_site_pdf_menu';

export const isSiteLockOn = (menuEnables) => !!menuEnables?.[LOCK_FLAG];

/**
 * The PDF menu that should take over the site, given the admin's menu switches.
 * `menuEnables` is the { menuType: enabled } map the app already builds from
 * isMenuEnableService.
 *
 * Returns `{ menuType, label, pdf }` or null. If more than one PDF menu is ever
 * open at once, the first in PDF_MENUS order wins — deterministic rather than
 * dependent on the order the API happened to return.
 */
export function activePdfMenu(menuEnables) {
  if (!menuEnables) return null;
  const menuType = Object.keys(PDF_MENUS).find((key) => !!menuEnables[key]);
  return menuType ? { menuType, ...PDF_MENUS[menuType] } : null;
}
