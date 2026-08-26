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
