import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
  menuFlagFor,
  searchProducts,
} from '../../../services/viewModel.service';
import { colors, fonts, radii } from '../../../styles/designTokens';
import { AdminProductCard, buildDuplicateDraft } from './AdminProductCard';
import { DuplicateDialog } from './DuplicateDialog';
import { MENU_TYPES, productCount } from './priceFields';

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

// Makes each duplication distinct, so duplicating the same product twice
// re-seeds the form instead of keeping the first attempt's values.
let dupSeq = 0;

/** SizePrice rows the form works on: same numbers, plus a stable React key. */
let seedSeq = 0;
// Deliberately NOT sorted. `priceInfo` reads SizePrices[0] verbatim for unit
// and weight pricing, so the server's row order decides the price the customer
// pays; reordering here made the form (and its preview) disagree with the
// customer menu. Box pricing is unaffected — priceInfo sorts box options itself.
const toFormRows = (rows) =>
  (rows || [])
    .slice()
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
  // Announced separately from `query` so a screen reader hears the result count
  // once the admin stops typing, instead of after every character.
  const [announceQuery, setAnnounceQuery] = useState('');
  const [activeCat, setActiveCat] = useState(null);
  const [editingId, setEditingId] = useState(null);
  // A Set, not a single id: two cards can be mid-request at once, and with a
  // single value the second action cleared the first card's spinner and
  // re-enabled its buttons while its request was still in flight.
  const [busyIds, setBusyIds] = useState(() => new Set());
  const [confirmDelete, setConfirmDelete] = useState(null);
  const lastDeleteName = useRef('');
  if (confirmDelete) lastDeleteName.current = confirmDelete.displayName;

  // The open card owns its draft, so anything that closes or replaces that card
  // throws the draft away. The card reports whether it holds unsaved work, and
  // every such transition goes through `guardEditor`.
  const dirtyRef = useRef(false);
  // The 'new' card has no edit button to hand focus back to when it closes, so
  // focus returns to the control that opened it.
  const addBtnRef = useRef(null);
  const [confirmLeave, setConfirmLeave] = useState(null);
  const handleDirtyChange = useCallback((dirty) => {
    dirtyRef.current = dirty;
  }, []);
  const guardEditor = (action) => {
    if (editingId !== null && dirtyRef.current) {
      // Held as an object: passing a bare function to a setter would be read as
      // a state updater and invoked immediately.
      setConfirmLeave({ run: action });
      return;
    }
    action();
  };
  const runPendingLeave = () => {
    const pending = confirmLeave;
    setConfirmLeave(null);
    dirtyRef.current = false;
    if (pending) pending.run();
  };
  const [duplicateSource, setDuplicateSource] = useState(null);
  // Seeds the 'new' card when it stands for a duplicate rather than a blank
  // product. `seedId` makes each seeding distinct so the form re-seeds when a
  // second product is duplicated while the first form is still open.
  const [newSeed, setNewSeed] = useState(null);

  useEffect(() => {
    const id = setTimeout(() => setAnnounceQuery(query), 500);
    return () => clearTimeout(id);
  }, [query]);

  const markBusy = useCallback((id) => {
    setBusyIds((cur) => new Set(cur).add(id));
  }, []);
  const clearBusy = useCallback((id) => {
    setBusyIds((cur) => {
      const next = new Set(cur);
      next.delete(id);
      return next;
    });
  }, []);

  /**
   * Every service in this app catches its own errors and resolves with
   * `undefined` instead of rejecting (see productService/sizePriceService), so
   * an await that "succeeds" proves nothing about the write. Without this, a
   * failed PUT rendered as a green "עודכן בהצלחה" while the DB kept the old row.
   * Note the resolved shapes differ: post() gives res.data, put()/delete() give
   * the whole axios response — so truthiness is the only portable check.
   */
  const mustSucceed = async (promise, what) => {
    const res = await promise;
    if (!res) throw new Error(`${what} failed`);
    return res;
  };

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
        // The read services swallow their rejections and resolve with
        // `undefined` (same reason `mustSucceed` exists for the writes), so the
        // .catch below never fires. Without this the screen rendered an empty
        // catalogue as though the menus were genuinely empty.
        if (
          !Array.isArray(allProducts) ||
          !Array.isArray(cats) ||
          !Array.isArray(priceList) ||
          !Array.isArray(sizePrices)
        ) {
          setLoadError(true);
          setLoading(false);
          return;
        }
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

  const filtered = useMemo(() => {
    const byCat =
      activeCat === null
        ? menuProducts
        : menuProducts.filter(
            (p) => Number(p.Category?.id ?? p.categoryId) === activeCat
          );
    return searchProducts(byCat, query);
  }, [menuProducts, activeCat, query]);

  // The card being edited stays rendered even if the current search or
  // category would filter it out. The form's draft lives inside the card, so
  // letting the filter unmount it silently threw away everything the admin had
  // typed. It keeps its place in the grid; only the filter is overridden.
  // What the live region reports: the same filter, but against the settled
  // query, so the announcement matches what was actually spoken.
  const announcedCount = useMemo(() => {
    const byCat =
      activeCat === null
        ? menuProducts
        : menuProducts.filter(
            (p) => Number(p.Category?.id ?? p.categoryId) === activeCat
          );
    return searchProducts(byCat, announceQuery).length;
  }, [menuProducts, activeCat, announceQuery]);

  const visible = useMemo(() => {
    if (editingId === null || editingId === 'new') return filtered;
    if (filtered.some((p) => p.id === editingId)) return filtered;
    const open = menuProducts.find((p) => p.id === editingId);
    return open ? [open, ...filtered] : filtered;
  }, [filtered, editingId, menuProducts]);

  /** Attach the Category / Price shapes the cards read, for a freshly created row. */
  const enrich = useCallback(
    (row, rowsByPrice, priceList) => {
      const cat = categories.find(
        (c) => String(c.id) === String(row.categoryId)
      );
      const price = (priceList || prices).find(
        (p) => String(p.id) === String(row.priceId)
      );
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
  /**
   * Push the draft's SizePrice rows to the server and return the price list's
   * new row set. Rows are compared against what the DB holds for that price
   * list, so an untouched row costs no request.
   *
   * Runs after the product write (see handleSave): a failure here is a partial
   * success, reconciled from the server rather than rolled back.
   */
  const syncSizePrices = async (priceId, draftRows) => {
    if (priceId === '' || priceId === null || priceId === undefined) return null;
    const key = String(priceId);
    const original = sizeRowsByPrice[key] || [];
    const keptIds = new Set(
      draftRows.filter((r) => r.id).map((r) => String(r.id))
    );

    await Promise.all(
      original
        .filter((r) => !keptIds.has(String(r.id)))
        .map((r) =>
          mustSucceed(sizePriceService.removeSizePrice(r.id), 'remove size price')
        )
    );

    const updated = await Promise.all(
      draftRows
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
          mustSucceed(
            sizePriceService.updateSizePrice({
              id: r.id,
              size: Number(r.size),
              amount: Number(r.amount),
              priceId: Number(priceId),
            }),
            'update size price'
          ).then(() => ({
            id: r.id,
            size: Number(r.size),
            amount: Number(r.amount),
          }))
        )
    );

    // Sequential, not Promise.all: rows are inserted in the order they are
    // POSTed, and for unit/weight pricing the FIRST row of the list is the one
    // priceInfo prices from. Racing the creates made that a coin flip.
    const created = [];
    for (const r of draftRows.filter((row) => !row.id)) {
      const row = await mustSucceed(
        sizePriceService.addSizePrice({
          size: Number(r.size),
          amount: Number(r.amount),
          priceId: Number(priceId),
        }),
        'create size price'
      );
      if (!row.id) throw new Error('create size price returned no id');
      created.push({ id: row.id, size: Number(r.size), amount: Number(r.amount) });
    }

    const byId = new Map(updated.map((r) => [String(r.id), r]));
    const kept = draftRows
      .filter((r) => r.id)
      .map(
        (r) =>
          byId.get(String(r.id)) || {
            id: r.id,
            size: Number(r.size),
            amount: Number(r.amount),
          }
      );
    return [...kept, ...created];
  };

  /**
   * Order matters and is deliberate: create the price list, then write the
   * product, and only then touch the SizePrice rows.
   *
   * The rows are the one destructive step — deletes and overwrites on a price
   * list that other products share cannot be undone without guessing. Running
   * them last means the "nothing was saved" failure is genuinely clean (only a
   * just-created price list can exist, and that is deleted again), and any
   * partial state is confined to the row sync, where it is reported honestly
   * and reconciled from the server rather than assumed.
   */
  const handleSave = async (product, draft) => {
    const isNew = !product;
    const duplicateOf = isNew ? newSeed?.source || null : null;
    const cardId = isNew ? 'new' : product.id;
    markBusy(cardId);

    let createdPrice = null;
    let productWritten = false;
    try {
      let priceId = draft.priceId;
      if (draft.pendingPrice) {
        createdPrice = await mustSucceed(
          pricesService.addPrice({
            displayName: draft.pendingPrice.displayName,
            priceType: draft.pendingPrice.priceType,
          }),
          'create price list'
        );
        if (!createdPrice.id) throw new Error('create price returned no id');
        priceId = createdPrice.id;
      }
      const pricesNow = createdPrice ? [...prices, createdPrice] : prices;

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
        priceId: priceId === '' ? null : Number(priceId),
      };

      let savedId;
      if (isNew) {
        const created = await mustSucceed(
          productService.addProduct(payload),
          'create product'
        );
        if (!created.id) throw new Error('create product returned no id');
        savedId = created.id;
      } else {
        savedId = product.id;
        await mustSucceed(
          productService.updateProduct({ ...payload, id: savedId }),
          'update product'
        );
      }
      productWritten = true;

      // From here on the product is saved. Anything that fails below is
      // reported as a partial success, never as "nothing was saved".
      let rowsFailed = false;
      let newRows = null;
      try {
        newRows = await syncSizePrices(priceId, draft.sizePrices);
      } catch (rowErr) {
        console.error('size price sync failed', rowErr);
        rowsFailed = true;
      }

      const rowsByPrice = { ...sizeRowsByPrice };
      if (rowsFailed) {
        // Some rows may have landed and some not. Rather than guess, take the
        // server's word for the whole list.
        try {
          const fresh = await sizePriceService.getSizePrices();
          if (Array.isArray(fresh)) {
            const rebuilt = {};
            fresh.forEach((row) => {
              const k = String(row.priceId);
              if (!rebuilt[k]) rebuilt[k] = [];
              rebuilt[k].push({ id: row.id, size: row.size, amount: row.amount });
            });
            Object.assign(rowsByPrice, rebuilt);
            newRows = rowsByPrice[String(priceId)] || [];
          }
        } catch (refetchErr) {
          console.error('size price refetch failed', refetchErr);
        }
      } else if (newRows) {
        rowsByPrice[String(priceId)] = newRows;
      }

      // Splitting a dish off into a single menu only works if the original
      // stops claiming that menu — otherwise both copies show up side by side.
      // Two things stop that: the admin may have unticked the menu on the copy,
      // and the original may have no other menu to fall back to, in which case
      // detaching would strand it in no menu at all and make it unreachable.
      const flag = menuFlagFor(menuType);
      const originalKeepsAMenu =
        !!duplicateOf &&
        MENU_TYPES.some(
          (type) => type !== menuType && !!duplicateOf[menuFlagFor(type)]
        );
      const wantsDetach = !!duplicateOf && !!payload[flag];
      const detachOriginal = wantsDetach && originalKeepsAMenu;

      let detachFailed = false;
      if (detachOriginal) {
        try {
          await mustSucceed(
            productService.updateProduct({ id: duplicateOf.id, [flag]: false }),
            'detach original'
          );
        } catch (err) {
          console.error('detach original failed', err);
          detachFailed = true;
        }
      }
      const detached = detachOriginal && !detachFailed;

      if (createdPrice) setPrices(pricesNow);
      setSizeRowsByPrice(rowsByPrice);
      setProducts((list) => {
        // Every product on the edited price list gets the new rows, not just
        // this one — they all read their price off the same Price row.
        const patched = list.map((p) =>
          newRows && String(p.priceId) === String(priceId) && p.Price
            ? {
                ...p,
                Price: {
                  ...p.Price,
                  SizePrices: newRows.map((r) => ({
                    ...r,
                    priceId: Number(priceId),
                  })),
                },
              }
            : p
        );
        const withOriginal = detached
          ? patched.map((p) =>
              p.id === duplicateOf.id ? { ...p, [flag]: false } : p
            )
          : patched;
        const saved = enrich({ ...payload, id: savedId }, rowsByPrice, pricesNow);
        return isNew
          ? [...withOriginal, saved]
          : withOriginal.map((p) => (p.id === savedId ? saved : p));
      });

      clearCatalogCache();
      // Close only if this save's own form is still the one open — a slow save
      // used to close whichever card the admin had opened in the meantime,
      // taking its unsaved edits with it.
      setEditingId((cur) => (cur === cardId ? null : cur));
      if (isNew) setNewSeed((cur) => (cur === newSeed ? null : cur));
      dirtyRef.current = false;

      if (rowsFailed) {
        notify(
          `${payload.displayName} נשמר, אך חלק משינויי המחירון לא הוחלו. בדוק את המחירון ונסה שוב.`,
          'error'
        );
      } else if (detachFailed) {
        notify(
          `${payload.displayName} שוכפל, אך הסרת המקור מתפריט ${MENU_LABEL[menuType]} נכשלה — הסר אותו ידנית.`,
          'error'
        );
      } else if (duplicateOf) {
        if (detached) {
          notify(
            `${payload.displayName} שוכפל, והמקור הוסר מתפריט ${MENU_LABEL[menuType]}`
          );
        } else if (wantsDetach) {
          notify(
            `${payload.displayName} שוכפל. המקור נשאר בתפריט ${MENU_LABEL[menuType]} כי זה התפריט היחיד שלו.`
          );
        } else {
          notify(`${payload.displayName} שוכפל`);
        }
      } else {
        notify(
          isNew
            ? `${payload.displayName} נוסף בהצלחה`
            : `${payload.displayName} עודכן בהצלחה`
        );
      }
    } catch (err) {
      console.error('save product failed', err);
      // Nothing but the price list can have been written at this point, and it
      // is referenced by nothing, so removing it again leaves no trace. Best
      // effort: a failed rollback must not mask the original error.
      if (!productWritten && createdPrice) {
        try {
          await pricesService.removePrice(createdPrice.id);
        } catch (cleanupErr) {
          console.error('rollback of created price list failed', cleanupErr);
        }
      }
      notify('השמירה נכשלה. שום דבר לא נשמר — נסה שוב.', 'error');
    } finally {
      clearBusy(cardId);
    }
  };

  const startDuplicate = (priceChoice) => {
    const source = duplicateSource;
    setDuplicateSource(null);
    if (!source) return;
    setNewSeed({
      seedId: `${source.id}-${(dupSeq += 1)}`,
      source,
      draft: buildDuplicateDraft(source, menuType, sizeRowsFor, priceChoice),
    });
    setEditingId('new');
  };

  const handleRemoveFromMenu = async (product) => {
    const flag = menuFlagFor(menuType);
    markBusy(product.id);
    try {
      await mustSucceed(
        productService.updateProduct({ id: product.id, [flag]: false }),
        'remove from menu'
      );
      setProducts((list) =>
        list.map((p) => (p.id === product.id ? { ...p, [flag]: false } : p))
      );
      clearCatalogCache();
      notify(`${product.displayName} הוסר מתפריט ${MENU_LABEL[menuType]}`);
    } catch (err) {
      console.error('remove from menu failed', err);
      notify('ההסרה נכשלה. נסה שוב.', 'error');
    } finally {
      clearBusy(product.id);
    }
  };

  const handleDeleteForever = async (product) => {
    setConfirmDelete(null);
    markBusy(product.id);
    try {
      await mustSucceed(
        productService.removeProduct(product.id),
        'delete product'
      );
      setProducts((list) => list.filter((p) => p.id !== product.id));
      clearCatalogCache();
      notify(`${product.displayName} נמחק לצמיתות`);
    } catch (err) {
      console.error('delete product failed', err);
      notify('המחיקה נכשלה. המוצר עדיין קיים.', 'error');
    } finally {
      clearBusy(product.id);
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
            onClick={() =>
              guardEditor(() => {
                setMenuType(type);
                setActiveCat(null);
                setQuery('');
                setEditingId(null);
                setNewSeed(null);
                setDuplicateSource(null);
              })
            }
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
              ref={addBtnRef}
              className={classes.addBtn}
              onClick={() =>
                guardEditor(() => {
                  setNewSeed(null);
                  setEditingId('new');
                })
              }
              disabled={editingId === 'new'}
            >
              + הוסף מוצר לתפריט
            </button>
            <span className={classes.count}>{productCount(filtered.length)}</span>
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
            {announcedCount === 0
              ? `לא נמצאו מוצרים בתפריט ${MENU_LABEL[menuType]}`
              : `${announcedCount === 1 ? 'נמצא' : 'נמצאו'} ${productCount(
                  announcedCount
                )} בתפריט ${MENU_LABEL[menuType]}`}
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
                onDirtyChange={handleDirtyChange}
                busy={busyIds.has('new')}
                seedDraft={newSeed}
                onCancel={() => {
                  dirtyRef.current = false;
                  setEditingId(null);
                  setNewSeed(null);
                  requestAnimationFrame(() => addBtnRef.current?.focus());
                }}
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
                onDirtyChange={handleDirtyChange}
                busy={busyIds.has(product.id)}
                onEdit={() => guardEditor(() => setEditingId(product.id))}
                onCancel={() => {
                  dirtyRef.current = false;
                  setEditingId(null);
                }}
                onDuplicate={() => guardEditor(() => setDuplicateSource(product))}
                onSave={(draft) => handleSave(product, draft)}
                onRemoveFromMenu={() => handleRemoveFromMenu(product)}
                onDeleteForever={() => setConfirmDelete(product)}
              />
            ))}
          </div>

          {filtered.length === 0 && editingId !== 'new' && (
            <div className={classes.state}>
              <div className={classes.stateTitle}>אין מוצרים להצגה</div>
              <div>נסה חיפוש אחר, קטגוריה אחרת, או הוסף מוצר חדש.</div>
            </div>
          )}
        </>
      )}

      {duplicateSource && (
        <DuplicateDialog
          product={duplicateSource}
          menuType={menuType}
          priceUsage={priceUsage}
          onCancel={() => setDuplicateSource(null)}
          onConfirm={startDuplicate}
        />
      )}

      <Dialog open={!!confirmLeave} onClose={() => setConfirmLeave(null)}>
        <DialogTitle>שינויים שלא נשמרו</DialogTitle>
        <DialogContent>
          <DialogContentText>
            בטופס הפתוח יש שינויים שעדיין לא נשמרו. אם תמשיך הם יאבדו.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <MuiButton onClick={() => setConfirmLeave(null)}>
            חזור לעריכה
          </MuiButton>
          <MuiButton color="error" variant="contained" onClick={runPendingLeave}>
            המשך בלי לשמור
          </MuiButton>
        </DialogActions>
      </Dialog>

      <Dialog open={!!confirmDelete} onClose={() => setConfirmDelete(null)}>
        <DialogTitle>מחיקת מוצר לצמיתות</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {`למחוק את "${
              // Falls back to the last name shown: MUI keeps the dialog mounted
              // through its fade-out, by which point confirmDelete is null and
              // the text read  למחוק את "undefined".
              confirmDelete?.displayName ?? lastDeleteName.current
            }" מכל התפריטים ומהמסד? הפעולה אינה הפיכה. אם המטרה היא רק להוריד את
            המוצר מהתפריט הנוכחי, השתמש ב"הסר מהתפריט".`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <MuiButton onClick={() => setConfirmDelete(null)}>ביטול</MuiButton>
          <MuiButton
            color="error"
            variant="contained"
            disabled={!confirmDelete}
            onClick={() => handleDeleteForever(confirmDelete)}
          >
            מחק לצמיתות
          </MuiButton>
        </DialogActions>
      </Dialog>
    </div>
  );
};
