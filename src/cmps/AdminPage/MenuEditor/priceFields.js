import { MENU_LABEL } from '../../../services/viewModel.service';

// Shared by MenuEditor, AdminProductCard and DuplicateDialog. These label maps
// used to be copied into each of the three, which meant a wording or semantics
// change had to be made in three places to stay consistent — and the price-type
// labels in particular are load-bearing: they tell the admin whether a number is
// a price per box, per N units, or per 100g.

/** Seasonal menus, in the order the tab strip shows them. */
export const MENU_TYPES = ['weekend', 'tishray', 'pesach'];

export const PRICE_TYPE_LABEL = {
  box: 'קופסה',
  unit: 'יחידה',
  weight: 'משקל',
};

export const SIZE_LABEL = {
  box: (unit) => `גודל (${unit})`,
  unit: () => 'כמות יחידות',
  weight: () => 'כמות מינימלית (גרם)',
};

export const AMOUNT_LABEL = {
  box: () => 'מחיר לקופסה (₪)',
  unit: () => 'מחיר לכמות (₪)',
  weight: () => 'מחיר ל-100 גרם (₪)',
};

export const sizeLabelFor = (priceType, unit) =>
  (SIZE_LABEL[priceType] || SIZE_LABEL.box)(unit);

export const amountLabelFor = (priceType) =>
  (AMOUNT_LABEL[priceType] || AMOUNT_LABEL.box)();

/**
 * Hebrew has a singular form, and "1 מוצרים" reads as a bug to the admin.
 * Used for every count this screen renders.
 */
export function productCount(n) {
  return n === 1 ? 'מוצר אחד' : `${n} מוצרים`;
}

export const menuLabelOf = (menuType) => MENU_LABEL[menuType] || '';
