import { gradientFor } from '../styles/designTokens';

// Bridges the API shape (Product + Price + SizePrice[] + Category) to the flat
// view model the redesigned components render.
//
// Pricing semantics, mirrored from the existing PriceFor* components so the
// numbers shown on a card always match what the product page will charge:
//
//   box    - each SizePrice is a discrete option; you pay SizePrice.amount.
//            Sizes are millilitres for סלטים (categoryId 1), grams otherwise.
//   unit   - SizePrices[0] means "`size` units cost `amount`"; the input steps
//            by `size` and the price scales linearly.  (PriceForUnit.jsx)
//   weight - SizePrices[0].amount is the price per 100g; input steps by 100g.
//            (PriceForWeight.jsx)

const MENU_FLAG = {
  weekend: 'isMenuWeekend',
  tishray: 'isMenuTishray',
  pesach: 'isMenuPesach',
};

export const MENU_LABEL = {
  weekend: 'סוף שבוע',
  tishray: 'חגי תשרי',
  pesach: 'פסח',
};

export function money(n) {
  const num = Number(n) || 0;
  const rounded = Math.round(num * 100) / 100;
  const str =
    rounded % 1 === 0 ? String(rounded) : rounded.toFixed(2).replace(/0$/, '');
  return `₪${str}`;
}

export function menuFlagFor(menuType) {
  return MENU_FLAG[menuType] || MENU_FLAG.weekend;
}

export function filterByMenu(products, menuType) {
  const flag = menuFlagFor(menuType);
  return (products || []).filter((p) => !!p[flag]);
}

function sizePricesOf(product) {
  const list = product?.Price?.SizePrices;
  return Array.isArray(list) ? list.filter(Boolean) : [];
}

// Grams vs millilitres — סלטים (categoryId 1) are sold by volume.
export function measureUnitFor(product) {
  const id = Number(product?.categoryId);
  return id === 1 ? 'מ״ל' : 'גרם';
}

/**
 * Everything a card or product page needs to talk about price, without
 * duplicating the per-type arithmetic in each component.
 */
export function priceInfo(product) {
  const type = product?.Price?.priceType;
  const sizes = sizePricesOf(product);

  if (!type || !sizes.length) {
    return {
      type: type || null,
      available: false,
      fromAmount: null,
      priceLabel: 'לפרטים בטלפון',
      servingLabel: '',
      options: [],
    };
  }

  if (type === 'box') {
    const unit = measureUnitFor(product);
    const options = [...sizes].sort((a, b) => a.size - b.size);
    const cheapest = options.reduce(
      (min, o) => (min === null || o.amount < min ? o.amount : min),
      null
    );
    const single = options.length === 1;
    return {
      type,
      available: true,
      fromAmount: cheapest,
      priceLabel: single ? money(cheapest) : `החל מ־${money(cheapest)}`,
      servingLabel: single
        ? `קופסה ${options[0].size} ${unit}`
        : `${options.length} גדלים · ${options[0].size}–${
            options[options.length - 1].size
          } ${unit}`,
      unitLabel: unit,
      options,
    };
  }

  if (type === 'unit') {
    const base = sizes[0];
    const perUnit = base.size ? base.amount / base.size : base.amount;
    return {
      type,
      available: true,
      fromAmount: base.amount,
      priceLabel: money(base.amount),
      servingLabel:
        base.size > 1 ? `ל-${base.size} יחידות` : 'ליחידה',
      unitLabel: 'יחידות',
      step: base.size || 1,
      min: base.size || 1,
      perUnit,
      options: sizes,
    };
  }

  if (type === 'weight') {
    const base = sizes[0];
    // `amount` is the price per 100g (see cart.service.js), but the shopper
    // cannot buy 100g: PlusMinus.jsx steps the quantity by SizePrices[0].size,
    // which is 1000 for every weight product but one. Advertise the price of
    // the smallest quantity that can actually be ordered, and step by the same
    // amount the product page does, so both routes agree on the minimum.
    const stepGrams = Number(base.size) > 0 ? Number(base.size) : 100;
    const minPrice = Number(((base.amount * stepGrams) / 100).toFixed(2));
    return {
      type,
      available: true,
      fromAmount: minPrice,
      priceLabel: money(minPrice),
      servingLabel:
        stepGrams >= 1000
          ? `${stepGrams / 1000} ק״ג`
          : `${stepGrams} גרם`,
      unitLabel: 'גרם',
      step: stepGrams,
      min: stepGrams,
      max: Math.max(4000, stepGrams * 4),
      per100g: base.amount,
      options: sizes,
    };
  }

  return {
    type,
    available: false,
    fromAmount: null,
    priceLabel: 'לפרטים בטלפון',
    servingLabel: '',
    options: [],
  };
}

/**
 * Price for a chosen quantity, matching each PriceFor* component exactly.
 * `value` is the box size, unit count, or gram weight depending on type.
 */
export function priceForSelection(product, value) {
  const info = priceInfo(product);
  const n = Number(value);
  if (!info.available || !n) return 0;

  if (info.type === 'box') {
    const match = info.options.find((o) => Number(o.size) === n);
    return match ? match.amount : 0;
  }
  if (info.type === 'unit') {
    const base = info.options[0];
    return (n / base.size) * base.amount;
  }
  if (info.type === 'weight') {
    return Number(((info.per100g * n) / 100).toFixed(2));
  }
  return 0;
}

/** Card / grid view model. `handlers` supplies navigation and quick-add. */
export function toCardVM(product, handlers = {}) {
  const info = priceInfo(product);
  return {
    id: product.id,
    raw: product,
    name: product.displayName,
    desc: product.description || '',
    imgUrl: product.imgUrl,
    catId: product.categoryId,
    catLabel: product.Category?.displayName || '',
    grad: gradientFor(product.categoryId),
    inStock: product.inStock !== false,
    kitniyot: !!product.kitniyot,
    priceLabel: info.priceLabel,
    serving: info.servingLabel,
    fromAmount: info.fromAmount,
    priceType: info.type,
    // A product can carry a priceType and still have no price tiers at all
    // (7 of them do). Those are quotable by phone only, never quick-addable.
    available: info.available,
    onOpen: handlers.onOpen ? () => handlers.onOpen(product) : undefined,
    onAdd: handlers.onAdd
      ? (e) => {
          if (e && e.stopPropagation) e.stopPropagation();
          handlers.onAdd(product);
        }
      : undefined,
  };
}

/** Categories actually represented in a given product list, in API order. */
export function categoriesPresent(products) {
  const seen = new Map();
  (products || []).forEach((p) => {
    if (p.Category && !seen.has(p.Category.id)) {
      seen.set(p.Category.id, {
        id: p.Category.id,
        label: p.Category.displayName,
        imgUrl: p.Category.imgUrl,
        grad: gradientFor(p.Category.id),
      });
    }
  });
  return [...seen.values()];
}

export function searchProducts(products, query) {
  const q = (query || '').trim();
  if (!q) return products || [];
  return (products || []).filter(
    (p) =>
      (p.displayName || '').includes(q) ||
      (p.description || '').includes(q) ||
      (p.Category?.displayName || '').includes(q)
  );
}

export const viewModelService = {
  money,
  menuFlagFor,
  filterByMenu,
  priceInfo,
  priceForSelection,
  toCardVM,
  categoriesPresent,
  searchProducts,
  measureUnitFor,
  MENU_LABEL,
};
