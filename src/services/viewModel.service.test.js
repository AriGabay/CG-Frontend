import {
  money,
  priceInfo,
  priceForSelection,
  filterByMenu,
  categoriesPresent,
  searchProducts,
  measureUnitFor,
} from './viewModel.service';

// Fixtures copied verbatim from the production API (GET /api/product/all),
// one per pricing shape that actually occurs in the data.
const boxSalad = {
  id: 30,
  displayName: 'סלט חמוציות',
  categoryId: 1,
  inStock: true,
  isMenuWeekend: true,
  isMenuTishray: true,
  isMenuPesach: false,
  Category: { id: 1, displayName: 'סלטים' },
  Price: {
    id: 21,
    priceType: 'box',
    SizePrices: [
      { id: 61, size: 250, amount: 16 },
      { id: 62, size: 500, amount: 30 },
      { id: 63, size: 1000, amount: 60 },
    ],
  },
};

const unitBundle = {
  id: 2,
  displayName: 'פילה סלמון מזרחי',
  categoryId: 7,
  inStock: true,
  isMenuWeekend: true,
  isMenuTishray: false,
  isMenuPesach: false,
  Category: { id: 7, displayName: 'דגים' },
  Price: { id: 5, priceType: 'unit', SizePrices: [{ id: 7, size: 5, amount: 195 }] },
};

const unitSingle = {
  id: 1,
  displayName: 'דג מושט מזרחי',
  categoryId: 7,
  inStock: true,
  isMenuWeekend: true,
  isMenuTishray: false,
  isMenuPesach: false,
  Category: { id: 7, displayName: 'דגים' },
  Price: { id: 4, priceType: 'unit', SizePrices: [{ id: 6, size: 1, amount: 25 }] },
};

const weightItem = {
  id: 90,
  displayName: 'כרובית מצופה',
  categoryId: 3,
  inStock: true,
  isMenuWeekend: true,
  isMenuTishray: false,
  isMenuPesach: false,
  Category: { id: 3, displayName: 'מטוגנים' },
  Price: { id: 40, priceType: 'weight', SizePrices: [{ id: 90, size: 1000, amount: 10 }] },
};

// One of the 7 real products whose price tiers were never entered.
const brokenWeight = {
  id: 144,
  displayName: 'תפוחי אדמה בשום שמיר',
  categoryId: 4,
  inStock: true,
  isMenuWeekend: false,
  isMenuTishray: true,
  isMenuPesach: true,
  Category: { id: 4, displayName: 'פחמימות וירקות' },
  Price: { id: 70, priceType: 'weight', SizePrices: [] },
};

describe('money', () => {
  it('formats whole and fractional shekel amounts', () => {
    expect(money(52)).toBe('₪52');
    expect(money(0)).toBe('₪0');
    expect(money(16.5)).toBe('₪16.5');
  });
});

describe('priceInfo - box', () => {
  const info = priceInfo(boxSalad);

  it('advertises the cheapest tier as a "from" price', () => {
    expect(info.available).toBe(true);
    expect(info.fromAmount).toBe(16);
    expect(info.priceLabel).toBe('החל מ־₪16');
  });

  it('uses millilitres for salads (categoryId 1) and grams elsewhere', () => {
    expect(measureUnitFor(boxSalad)).toBe('מ״ל');
    expect(measureUnitFor(weightItem)).toBe('גרם');
    expect(info.servingLabel).toContain('מ״ל');
  });

  it('sorts the tiers ascending', () => {
    expect(info.options.map((o) => o.size)).toEqual([250, 500, 1000]);
  });
});

describe('priceForSelection matches the backend formula', () => {
  // cg-backend/api/cart/cart.service.js is the authority on money:
  //   box    -> amount of the SizePrice whose size === sizeToOrder
  //   unit   -> amount * (sizeToOrder / size)
  //   weight -> (sizeToOrder / 100) * amount
  it('box: charges the matching tier exactly', () => {
    expect(priceForSelection(boxSalad, 250)).toBe(16);
    expect(priceForSelection(boxSalad, 500)).toBe(30);
    expect(priceForSelection(boxSalad, 1000)).toBe(60);
  });

  it('box: an unknown size costs nothing rather than guessing', () => {
    expect(priceForSelection(boxSalad, 750)).toBe(0);
  });

  it('unit: scales linearly from the bundle tier', () => {
    expect(priceForSelection(unitBundle, 5)).toBe(195);
    expect(priceForSelection(unitBundle, 10)).toBe(390);
    expect(priceForSelection(unitSingle, 3)).toBe(75);
  });

  it('weight: amount is the price per 100g, not per the stored size of 1000', () => {
    expect(priceForSelection(weightItem, 100)).toBe(10);
    expect(priceForSelection(weightItem, 500)).toBe(50);
    expect(priceForSelection(weightItem, 1000)).toBe(100);
  });
});

describe('priceInfo - weight', () => {
  // PlusMinus.jsx steps the quantity by SizePrices[0].size, so 1000g is the
  // smallest orderable amount for this product even though `amount` is per 100g.
  // The card must advertise a price the shopper can actually pay, and quick-add
  // must step by the same amount as the product page.
  const info = priceInfo(weightItem);

  it('advertises the price of the smallest orderable quantity', () => {
    expect(info.fromAmount).toBe(100);
    expect(info.priceLabel).toBe('₪100');
    expect(info.servingLabel).toBe('1 ק״ג');
  });

  it('steps by SizePrices[0].size, matching PlusMinus on the product page', () => {
    expect(info.step).toBe(1000);
    expect(info.min).toBe(1000);
    expect(info.per100g).toBe(10);
  });

  it('handles the one product sold in 200g steps', () => {
    const smallStep = {
      ...weightItem,
      Price: {
        id: 41,
        priceType: 'weight',
        SizePrices: [{ id: 91, size: 200, amount: 9 }],
      },
    };
    const i = priceInfo(smallStep);
    expect(i.step).toBe(200);
    expect(i.servingLabel).toBe('200 גרם');
    expect(i.fromAmount).toBe(18);
    expect(priceForSelection(smallStep, 200)).toBe(18);
  });
});

describe('products with no price tiers', () => {
  it('degrades instead of throwing on an empty SizePrices array', () => {
    const info = priceInfo(brokenWeight);
    expect(info.available).toBe(false);
    expect(info.fromAmount).toBeNull();
    expect(info.priceLabel).toBe('לפרטים בטלפון');
    expect(info.options).toEqual([]);
  });

  it('never invents a price for one', () => {
    expect(priceForSelection(brokenWeight, 500)).toBe(0);
  });

  it('survives a product with no Price relation at all', () => {
    expect(() => priceInfo({ id: 1, categoryId: 2 })).not.toThrow();
    expect(priceInfo({ id: 1, categoryId: 2 }).available).toBe(false);
  });
});

describe('menu filtering', () => {
  const all = [boxSalad, unitBundle, unitSingle, weightItem, brokenWeight];

  it('filters by the right boolean column per menu', () => {
    expect(filterByMenu(all, 'weekend').map((p) => p.id)).toEqual([30, 2, 1, 90]);
    expect(filterByMenu(all, 'tishray').map((p) => p.id)).toEqual([30, 144]);
    expect(filterByMenu(all, 'pesach').map((p) => p.id)).toEqual([144]);
  });
});

describe('categoriesPresent', () => {
  it('returns each category once, in first-seen order', () => {
    const cats = categoriesPresent([boxSalad, unitBundle, unitSingle, weightItem]);
    expect(cats.map((c) => c.id)).toEqual([1, 7, 3]);
    expect(cats[0].label).toBe('סלטים');
  });
});

describe('searchProducts', () => {
  const all = [boxSalad, unitBundle, unitSingle, weightItem];

  it('matches on Hebrew name substrings', () => {
    expect(searchProducts(all, 'סלמון').map((p) => p.id)).toEqual([2]);
  });

  it('matches on category name', () => {
    expect(searchProducts(all, 'דגים').map((p) => p.id)).toEqual([2, 1]);
  });

  it('returns everything for an empty query', () => {
    expect(searchProducts(all, '   ')).toHaveLength(4);
  });
});
