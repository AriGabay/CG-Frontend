import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { makeStyles } from '@mui/styles';
import {
  Button as MuiButton,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

import { categoryService } from '../../../services/categoryService';
import { pricesService } from '../../../services/pricesService';
import { productService } from '../../../services/productService';
import { sizePriceService } from '../../../services/sizePriceService';
import { clearCatalogCache } from '../../../hooks/useCatalog';
import {
  MENU_LABEL,
  categoriesPresent,
  filterByMenu,
  searchProducts,
} from '../../../services/viewModel.service';
import { colors, fonts, radii } from '../../../styles/designTokens';
import {
  AdminProductCard,
  MENU_FLAG_OF,
  MENU_TYPES,
} from './AdminProductCard';

const useStyles = makeStyles({
  wrap: {
    padding: '8px 4px 40px',
    fontFamily: fonts.body,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 30,
    color: colors.text,
    margin: '0 0 4px',
  },
  sub: {
    fontSize: 14,
    color: colors.textFaint,
    marginBottom: 18,
  },
  tabs: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    background: colors.surfaceSunken,
    borderRadius: 14,
    padding: 5,
    marginBottom: 18,
    width: 'fit-content',
    maxWidth: '100%',
  },
  tab: {
    border: 'none',
    background: 'transparent',
    borderRadius: 10,
    padding: '10px 20px',
    minHeight: 44,
    fontFamily: fonts.body,
    fontSize: 15,
    fontWeight: 700,
    color: colors.textSoft,
    cursor: 'pointer',
    '&:hover': { color: colors.text },
    '&:focus-visible': {
      outline: `3px solid ${colors.greenDeep}`,
      outlineOffset: 2,
    },
  },
  tabActive: {
    background: colors.surface,
    color: colors.text,
    boxShadow: '0 4px 10px -6px rgba(67,49,42,.5)',
  },
  toolbar: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  search: {
    minHeight: 44,
    minWidth: 260,
    border: `1px solid ${colors.borderInput}`,
    background: colors.surface,
    borderRadius: radii.pill,
    padding: '12px 18px',
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.text,
    outline: 'none',
    '&::placeholder': { color: colors.textFaint },
    '&:focus-visible': {
      outline: `3px solid ${colors.greenDeep}`,
      outlineOffset: 2,
    },
  },
  count: {
    fontSize: 14,
    color: colors.textFaint,
    fontWeight: 600,
  },
  chips: {
    display: 'flex',
    gap: 10,
    flexWrap: 'wrap',
    marginBottom: 20,
    padding: 0,
    listStyle: 'none',
  },
  chip: {
    background: colors.surface,
    border: `1px solid ${colors.borderInput}`,
    borderRadius: radii.pill,
    padding: '10px 18px',
    minHeight: 44,
    fontFamily: fonts.body,
    fontSize: 14.5,
    fontWeight: 600,
    color: colors.text,
    cursor: 'pointer',
    '&:hover': { borderColor: colors.text },
    '&:focus-visible': {
      outline: `3px solid ${colors.greenDeep}`,
      outlineOffset: 2,
    },
  },
  chipActive: {
    background: colors.text,
    borderColor: colors.text,
    color: '#fff',
  },
  addBtn: {
    border: `1px solid ${colors.green}`,
    background: colors.green,
    color: '#fff',
    borderRadius: radii.pill,
    padding: '11px 20px',
    minHeight: 44,
    fontFamily: fonts.body,
    fontSize: 14.5,
    fontWeight: 700,
    cursor: 'pointer',
    '&:hover:not(:disabled)': {
      background: colors.greenDeep,
      borderColor: colors.greenDeep,
    },
    '&:disabled': { opacity: 0.5, cursor: 'not-allowed' },
    '&:focus-visible': {
      outline: `3px solid ${colors.greenDeep}`,
      outlineOffset: 2,
    },
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: 18,
    alignItems: 'start',
  },
  state: {
    textAlign: 'center',
    padding: '60px 20px',
    color: colors.textFaint,
  },
  stateTitle: {
    fontSize: 19,
    fontWeight: 700,
    color: colors.text,
    marginBottom: 6,
  },
  srOnly: {
    position: 'absolute',
    width: 1,
    height: 1,
    padding: 0,
    margin: -1,
    overflow: 'hidden',
    clip: 'rect(0 0 0 0)',
    whiteSpace: 'nowrap',
    border: 0,
  },
});

/** SizePrice rows the form works on: same numbers, plus a stable React key. */
let seedSeq = 0;
const toFormRows = (rows) =>
  (rows || [])
    .slice()
    .sort((a, b) => Number(a.size) - Number(b.size))
    .map((r) => ({
      key: `db-${r.id}-${(seedSeq += 1)}`,
      id: r.id,
      size: r.size ?? '',
      amount: r.amount ?? '',
    }));

/**
 * Menu editor: pick a seasonal menu, then see it exactly as a customer would —
 * same cards, same category chips, same price labels — with edit / remove /
 * delete on every card and no navigation away from the page.
 *
 * The whole catalogue is loaded once and kept in local state; every mutation
 * patches that state in place rather than refetching, so the grid never blinks.
 * `clearCatalogCache()` is called alongside so the customer-facing pages pick
 * the change up if the admin walks over to them.
 */
export const MenuEditor = ({ eventBus }) => {
  const classes = useStyles();

  const [menuType, setMenuType] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [prices, setPrices] = useState([]);
  // priceId -> the SizePrice rows of that price list, as stored in the DB.
  const [sizeRowsByPrice, setSizeRowsByPrice] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const [query, setQuery] = useState('');
  const [activeCat, setActiveCat] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const notify = useCallback(
    (message, severity = 'success') => {
      if (eventBus) eventBus.dispatch(severity, { message });
    },
    [eventBus]
  );

  useEffect(() => {
    let alive = true;
    Promise.all([
      productService.getAllProducts(),
      categoryService.getCategoriesDropDown(),
      pricesService.getPrices({ include: false }),
      sizePriceService.getSizePrices(),
    ])
      .then(([allProducts, cats, priceList, sizePrices]) => {
        if (!alive) return;
        setProducts(Array.isArray(allProducts) ? allProducts : []);
        setCategories(Array.isArray(cats) ? cats : []);
        setPrices(Array.isArray(priceList) ? priceList : []);
        const byPrice = {};
        (Array.isArray(sizePrices) ? sizePrices : []).forEach((row) => {
          const key = String(row.priceId);
          if (!byPrice[key]) byPrice[key] = [];
          byPrice[key].push({ id: row.id, size: row.size, amount: row.amount });
        });
        setSizeRowsByPrice(byPrice);
        setLoading(false);
      })
      .catch(() => {
        if (!alive) return;
        setLoadError(true);
        setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  // Prices carry a type but no readable hint of it, and the admin picks from a
  // flat list, so fold the type into the label the dropdown shows.
  const priceOptions = useMemo(
    () =>
      (prices || []).map((p) => ({
        ...p,
        displayName: `${p.displayName} (${
          { box: 'קופסה', unit: 'יחידה', weight: 'משקל' }[p.priceType] ||
          p.priceType
        })`,
      })),
    [prices]
  );

  // How many products lean on each price list — drives the "this is shared"
  // warning before the admin edits an amount.
  const priceUsage = useMemo(() => {
    const usage = {};
    products.forEach((p) => {
      if (p.priceId === null || p.priceId === undefined) return;
      const key = String(p.priceId);
      usage[key] = (usage[key] || 0) + 1;
    });
    return usage;
  }, [products]);

  const sizeRowsFor = useCallback(
    (priceId) =>
      priceId === '' || priceId === null || priceId === undefined
        ? []
        : toFormRows(sizeRowsByPrice[String(priceId)]),
    [sizeRowsByPrice]
  );

  const menuProducts = useMemo(
    () => (menuType ? filterByMenu(products, menuType) : []),
    [products, menuType]
  );

  const chipCategories = useMemo(
    () => categoriesPresent(menuProducts),
    [menuProducts]
  );

  const visible = useMemo(() => {
    const byCat =
      activeCat === null
        ? menuProducts
        : menuProducts.filter(
            (p) => Number(p.Category?.id ?? p.categoryId) === activeCat
          );
    return searchProducts(byCat, query);
  }, [menuProducts, activeCat, query]);

  /** Attach the Category / Price shapes the cards read, for a freshly created row. */
  const enrich = useCallback(
    (row, rowsByPrice) => {
      const cat = categories.find(
        (c) => String(c.id) === String(row.categoryId)
      );
      const price = prices.find((p) => String(p.id) === String(row.priceId));
      return {
        ...row,
        Category: cat ? { id: cat.id, displayName: cat.displayName } : null,
        Price: price
          ? {
              id: price.id,
              priceType: price.priceType,
              displayName: price.displayName,
              SizePrices: (rowsByPrice[String(price.id)] || []).map((r) => ({
                ...r,
                priceId: price.id,
              })),
            }
          : null,
      };
    },
    [categories, prices]
  );

  /**
   * Push the draft's SizePrice rows to the server and return the price list's
   * new row set. Rows are compared against what the DB holds for that price
   * list, so an untouched row costs no request.
   */
  const syncSizePrices = async (priceId, draftRows) => {
    if (priceId === '' || priceId === null || priceId === undefined) return null;
    const key = String(priceId);
    const original = sizeRowsByPrice[key] || [];
    const keptIds = new Set(
      draftRows.filter((r) => r.id).map((r) => String(r.id))
    );

    const deletions = original
      .filter((r) => !keptIds.has(String(r.id)))
      .map((r) => sizePriceService.removeSizePrice(r.id));

    const updates = draftRows
      .filter((r) => {
        if (!r.id) return false;
        const before = original.find((o) => String(o.id) === String(r.id));
        return (
          !before ||
          Number(before.size) !== Number(r.size) ||
          Number(before.amount) !== Number(r.amount)
        );
      })
      .map((r) =>
        sizePriceService
          .updateSizePrice({
            id: r.id,
            size: Number(r.size),
            amount: Number(r.amount),
            priceId: Number(priceId),
          })
          .then(() => ({
            id: r.id,
            size: Number(r.size),
            amount: Number(r.amount),
          }))
      );

    const creations = draftRows
      .filter((r) => !r.id)
      .map((r) =>
        sizePriceService
          .addSizePrice({
            size: Number(r.size),
            amount: Number(r.amount),
            priceId: Number(priceId),
          })
          .then((created) => ({
            id: created?.id,
            size: Number(r.size),
            amount: Number(r.amount),
          }))
      );

    await Promise.all(deletions);
    const [updated, created] = await Promise.all([
      Promise.all(updates),
      Promise.all(creations),
    ]);

    const byId = new Map(updated.map((r) => [String(r.id), r]));
    const kept = draftRows
      .filter((r) => r.id)
      .map((r) => byId.get(String(r.id)) || {
        id: r.id,
        size: Number(r.size),
        amount: Number(r.amount),
      });
    return [...kept, ...created];
  };

  const handleSave = async (product, draft) => {
    const isNew = !product;
    setBusyId(isNew ? 'new' : product.id);
    try {
      const newRows = await syncSizePrices(draft.priceId, draft.sizePrices);
      const rowsByPrice = { ...sizeRowsByPrice };
      if (newRows) rowsByPrice[String(draft.priceId)] = newRows;

      const payload = {
        displayName: draft.displayName,
        description: draft.description,
        categoryId: Number(draft.categoryId),
        imgUrl: draft.imgUrl,
        inStock: !!draft.inStock,
        kitniyot: !!draft.kitniyot,
        isMenuWeekend: !!draft.isMenuWeekend,
        isMenuTishray: !!draft.isMenuTishray,
        isMenuPesach: !!draft.isMenuPesach,
        priceId: draft.priceId === '' ? null : Number(draft.priceId),
      };

      let savedId;
      if (isNew) {
        const created = await productService.addProduct(payload);
        if (!created || !created.id) throw new Error('create failed');
        savedId = created.id;
      } else {
        savedId = product.id;
        await productService.updateProduct({ ...payload, id: savedId });
      }

      setSizeRowsByPrice(rowsByPrice);
      setProducts((list) => {
        // Every product on the edited price list gets the new rows, not just
        // this one — they all read their price off the same Price row.
        const patched = list.map((p) =>
          newRows && String(p.priceId) === String(draft.priceId) && p.Price
            ? {
                ...p,
                Price: {
                  ...p.Price,
                  SizePrices: newRows.map((r) => ({
                    ...r,
                    priceId: Number(draft.priceId),
                  })),
                },
              }
            : p
        );
        const saved = enrich({ ...payload, id: savedId }, rowsByPrice);
        return isNew
          ? [...patched, saved]
          : patched.map((p) => (p.id === savedId ? saved : p));
      });

      clearCatalogCache();
      setEditingId(null);
      notify(isNew ? `${payload.displayName} נוסף בהצלחה` : `${payload.displayName} עודכן בהצלחה`);
    } catch (err) {
      console.error('save product failed', err);
      notify('השמירה נכשלה. נסה שוב.', 'error');
    } finally {
      setBusyId(null);
    }
  };

  const handleRemoveFromMenu = async (product) => {
    const flag = MENU_FLAG_OF[menuType];
    setBusyId(product.id);
    try {
      await productService.updateProduct({ id: product.id, [flag]: false });
      setProducts((list) =>
        list.map((p) => (p.id === product.id ? { ...p, [flag]: false } : p))
      );
      clearCatalogCache();
      notify(
        `${product.displayName} הוסר מתפריט ${MENU_LABEL[menuType]}`
      );
    } catch (err) {
      console.error('remove from menu failed', err);
      notify('ההסרה נכשלה. נסה שוב.', 'error');
    } finally {
      setBusyId(null);
    }
  };

  const handleDeleteForever = async (product) => {
    setConfirmDelete(null);
    setBusyId(product.id);
    try {
      await productService.removeProduct(product.id);
      setProducts((list) => list.filter((p) => p.id !== product.id));
      clearCatalogCache();
      notify(`${product.displayName} נמחק לצמיתות`);
    } catch (err) {
      console.error('delete product failed', err);
      notify('המחיקה נכשלה. נסה שוב.', 'error');
    } finally {
      setBusyId(null);
    }
  };

  // ---- render ------------------------------------------------------------
  if (loading) {
    return (
      <div className={classes.state}>
        <CircularProgress aria-label="טוען את הקטלוג" />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className={classes.state}>
        <div className={classes.stateTitle}>לא הצלחנו לטעון את הקטלוג</div>
        <div>נסה לרענן את העמוד.</div>
      </div>
    );
  }

  return (
    <div className={classes.wrap}>
      <h2 className={classes.title}>הצגת תפריטים</h2>
      <div className={classes.sub}>
        בחר תפריט, וערוך את המוצרים במקום — בלי לעבור בין דפים.
      </div>

      <nav className={classes.tabs} aria-label="בחירת תפריט לעריכה">
        {MENU_TYPES.map((type) => (
          <button
            key={type}
            type="button"
            className={`${classes.tab} ${
              type === menuType ? classes.tabActive : ''
            }`}
            aria-current={type === menuType ? 'true' : undefined}
            onClick={() => {
              setMenuType(type);
              setActiveCat(null);
              setQuery('');
              setEditingId(null);
            }}
          >
            {MENU_LABEL[type]} ({filterByMenu(products, type).length})
          </button>
        ))}
      </nav>

      {!menuType && (
        <div className={classes.state}>
          <div className={classes.stateTitle}>בחר סוג תפריט למעלה</div>
          <div>סוף שבוע, חגי תשרי או פסח.</div>
        </div>
      )}

      {menuType && (
        <>
          <div className={classes.toolbar}>
            <input
              type="search"
              className={classes.search}
              value={query}
              onChange={(ev) => setQuery(ev.target.value)}
              placeholder="חיפוש מנה..."
              aria-label="חיפוש מנה בתפריט"
            />
            <button
              type="button"
              className={classes.addBtn}
              onClick={() => setEditingId('new')}
              disabled={editingId === 'new'}
            >
              + הוסף מוצר לתפריט
            </button>
            <span className={classes.count}>{visible.length} מוצרים</span>
          </div>

          {chipCategories.length > 0 && (
            <ul className={classes.chips} aria-label="סינון לפי קטגוריה">
              <li>
                <button
                  type="button"
                  className={`${classes.chip} ${
                    activeCat === null ? classes.chipActive : ''
                  }`}
                  aria-pressed={activeCat === null}
                  onClick={() => setActiveCat(null)}
                >
                  הכל
                </button>
              </li>
              {chipCategories.map((cat) => (
                <li key={cat.id}>
                  <button
                    type="button"
                    className={`${classes.chip} ${
                      activeCat === Number(cat.id) ? classes.chipActive : ''
                    }`}
                    aria-pressed={activeCat === Number(cat.id)}
                    onClick={() => setActiveCat(Number(cat.id))}
                  >
                    {cat.label}
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className={classes.srOnly} role="status" aria-live="polite">
            {`נמצאו ${visible.length} מוצרים בתפריט ${MENU_LABEL[menuType]}`}
          </div>

          <div className={classes.grid}>
            {editingId === 'new' && (
              <AdminProductCard
                key="new"
                product={null}
                menuType={menuType}
                categories={categories}
                prices={priceOptions}
                sizeRowsFor={sizeRowsFor}
                priceUsage={priceUsage}
                isEditing
                busy={busyId === 'new'}
                onCancel={() => setEditingId(null)}
                onSave={(draft) => handleSave(null, draft)}
              />
            )}
            {visible.map((product) => (
              <AdminProductCard
                key={product.id}
                product={product}
                menuType={menuType}
                categories={categories}
                prices={priceOptions}
                sizeRowsFor={sizeRowsFor}
                priceUsage={priceUsage}
                isEditing={editingId === product.id}
                busy={busyId === product.id}
                onEdit={() => setEditingId(product.id)}
                onCancel={() => setEditingId(null)}
                onSave={(draft) => handleSave(product, draft)}
                onRemoveFromMenu={() => handleRemoveFromMenu(product)}
                onDeleteForever={() => setConfirmDelete(product)}
              />
            ))}
          </div>

          {visible.length === 0 && editingId !== 'new' && (
            <div className={classes.state}>
              <div className={classes.stateTitle}>אין מוצרים להצגה</div>
              <div>נסה חיפוש אחר, קטגוריה אחרת, או הוסף מוצר חדש.</div>
            </div>
          )}
        </>
      )}

      <Dialog open={!!confirmDelete} onClose={() => setConfirmDelete(null)}>
        <DialogTitle>מחיקת מוצר לצמיתות</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {`למחוק את "${confirmDelete?.displayName}" מכל התפריטים ומהמסד? הפעולה
            אינה הפיכה. אם המטרה היא רק להוריד את המוצר מהתפריט הנוכחי, השתמש
            ב"הסר מהתפריט".`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <MuiButton onClick={() => setConfirmDelete(null)}>ביטול</MuiButton>
          <MuiButton
            color="error"
            variant="contained"
            onClick={() => handleDeleteForever(confirmDelete)}
          >
            מחק לצמיתות
          </MuiButton>
        </DialogActions>
      </Dialog>
    </div>
  );
};
