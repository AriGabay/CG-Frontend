import React, { useEffect, useMemo, useRef, useState } from 'react';
import { makeStyles } from '@mui/styles';
import {
  Checkbox,
  CircularProgress,
  FormControlLabel,
  IconButton,
  TextField,
  Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import Controls from '../../Controls/Controls';
import { ImageCloud } from '../../ImageCloud/ImageCloud';
import {
  MENU_LABEL,
  measureUnitFor,
  menuFlagFor,
  priceInfo,
} from '../../../services/viewModel.service';
import { colors, fonts, gradientFor, radii } from '../../../styles/designTokens';
import {
  MENU_TYPES,
  amountLabelFor,
  productCount,
  sizeLabelFor,
} from './priceFields';

export { MENU_TYPES };

// Local keys for the SizePrice rows. Rows that already exist in the DB are
// keyed by their id; rows the admin just added have no id yet, so they get a
// synthetic key from this counter. Math.random would do, but a counter keeps
// the keys readable in the React tree.
let newRowSeq = 0;
const nextRowKey = () => `new-${(newRowSeq += 1)}`;

/**
 * The card's editable state. Mirrors the Product columns plus the SizePrice
 * rows of whichever price list is currently selected — those live on the Price
 * row, not the product, which is why they are pulled in through `sizeRowsFor`.
 */
export function buildDraft(product, menuType, sizeRowsFor) {
  const priceId = product ? product.priceId ?? '' : '';
  return {
    displayName: product?.displayName ?? '',
    description: product?.description ?? '',
    categoryId: product?.categoryId ?? '',
    imgUrl: product?.imgUrl ?? '',
    inStock: product ? product.inStock !== false : true,
    kitniyot: !!product?.kitniyot,
    isMenuWeekend: product ? !!product.isMenuWeekend : menuType === 'weekend',
    isMenuTishray: product ? !!product.isMenuTishray : menuType === 'tishray',
    isMenuPesach: product ? !!product.isMenuPesach : menuType === 'pesach',
    priceId,
    sizePrices: sizeRowsFor(priceId),
    // Set only while duplicating with "create a new price list": the Price row
    // does not exist yet, so it is described here and created on save.
    pendingPrice: null,
  };
}

/**
 * Seed for a duplicate. A product that sits in several menus at once cannot be
 * repriced for just one of them, because the price lives on the shared Price
 * row — so duplicating splits one copy off into the menu being edited, with
 * (optionally) a price list of its own.
 *
 * `priceChoice` comes from the duplicate dialog:
 *   { createNew: true,  displayName, priceType, rows }  -> new list, created on save
 *   { createNew: false }                                -> keep the original's list
 */
export function buildDuplicateDraft(product, menuType, sizeRowsFor, priceChoice) {
  const base = buildDraft(product, menuType, sizeRowsFor);
  const single = {
    isMenuWeekend: menuType === 'weekend',
    isMenuTishray: menuType === 'tishray',
    isMenuPesach: menuType === 'pesach',
  };
  if (!priceChoice || !priceChoice.createNew) return { ...base, ...single };
  return {
    ...base,
    ...single,
    priceId: '',
    pendingPrice: {
      displayName: priceChoice.displayName,
      priceType: priceChoice.priceType,
    },
    // Fresh rows with no id: they are created under the new list on save, so
    // the original's rows are never touched.
    sizePrices: (priceChoice.rows || []).map((r) => ({
      key: nextRowKey(),
      size: r.size,
      amount: r.amount,
    })),
  };
}

const useStyles = makeStyles({
  card: {
    background: colors.surface,
    border: `1px solid ${colors.border}`,
    borderRadius: radii.lg,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
  },
  cardEditing: {
    // The form needs room to breathe, so an open card takes the whole row
    // instead of staying inside its 260px grid cell.
    gridColumn: '1 / -1',
    borderColor: colors.green,
    boxShadow: `0 0 0 2px ${colors.greenPale}`,
  },
  media: {
    position: 'relative',
    height: 150,
    overflow: 'hidden',
    '& img': { width: '100%', height: '100%', objectFit: 'cover' },
  },
  mediaSmall: {
    height: 110,
  },
  chip: {
    position: 'absolute',
    bottom: 8,
    insetInlineEnd: 10,
    background: 'rgba(255,255,255,.92)',
    color: colors.text,
    fontWeight: 700,
    fontSize: 12,
    borderRadius: radii.pill,
    padding: '3px 10px',
  },
  outBadge: {
    position: 'absolute',
    top: 8,
    insetInlineEnd: 10,
    background: colors.danger,
    color: '#fff',
    fontWeight: 700,
    fontSize: 12,
    borderRadius: radii.pill,
    padding: '3px 10px',
  },
  body: {
    padding: '12px 14px 14px',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    gap: 4,
  },
  name: {
    fontWeight: 800,
    fontSize: 16,
    color: colors.text,
    lineHeight: 1.3,
    margin: 0,
  },
  desc: {
    fontSize: 13,
    color: colors.textFaint,
    lineHeight: 1.4,
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 2,
    overflow: 'hidden',
    minHeight: '2.8em',
    margin: 0,
  },
  serving: {
    fontSize: 12.5,
    color: colors.textFaint,
    fontWeight: 600,
  },
  price: {
    fontFamily: fonts.display,
    fontSize: 19,
    color: colors.greenLink,
  },
  flags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 5,
    marginTop: 6,
  },
  flag: {
    fontSize: 11,
    fontWeight: 700,
    borderRadius: radii.pill,
    padding: '2px 9px',
    background: colors.surfaceSunken,
    color: colors.textSoft,
  },
  flagOn: {
    background: colors.greenPale,
    color: colors.greenDark,
  },
  actions: {
    marginTop: 'auto',
    paddingTop: 10,
    display: 'flex',
    flexWrap: 'wrap',
    gap: 6,
  },
  btn: {
    border: `1px solid ${colors.borderInput}`,
    background: colors.surface,
    color: colors.text,
    borderRadius: radii.pill,
    padding: '7px 14px',
    minHeight: 36,
    fontFamily: fonts.body,
    fontSize: 13.5,
    fontWeight: 700,
    cursor: 'pointer',
    '&:hover:not(:disabled)': { borderColor: colors.text },
    '&:disabled': { opacity: 0.5, cursor: 'not-allowed' },
    '&:focus-visible': {
      outline: `3px solid ${colors.greenDeep}`,
      outlineOffset: 2,
    },
  },
  btnPrimary: {
    background: colors.green,
    borderColor: colors.green,
    color: '#fff',
    '&:hover:not(:disabled)': {
      background: colors.greenDeep,
      borderColor: colors.greenDeep,
    },
  },
  btnDanger: {
    color: colors.danger,
    borderColor: colors.danger,
  },
  // ---- edit form -------------------------------------------------------
  form: {
    padding: '16px 18px 18px',
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
  },
  formHead: {
    fontFamily: fonts.display,
    fontSize: 20,
    color: colors.text,
    margin: 0,
  },
  row: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 14,
    alignItems: 'flex-start',
  },
  section: {
    border: `1px solid ${colors.border}`,
    borderRadius: radii.md,
    padding: '12px 14px',
    background: colors.surfaceAlt,
  },
  sectionTitle: {
    fontWeight: 800,
    fontSize: 14,
    color: colors.textSoft,
    marginBottom: 10,
  },
  hint: {
    fontSize: 12.5,
    color: colors.textFaint,
    lineHeight: 1.5,
  },
  warn: {
    fontSize: 12.5,
    fontWeight: 700,
    color: colors.danger,
    lineHeight: 1.5,
  },
  spRow: {
    display: 'flex',
    gap: 10,
    alignItems: 'center',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  preview: {
    fontSize: 13,
    color: colors.textSoft,
    fontWeight: 600,
  },
  previewPrice: {
    fontFamily: fonts.display,
    fontSize: 18,
    color: colors.greenLink,
  },
  err: {
    fontSize: 13,
    fontWeight: 700,
    color: colors.danger,
  },
  narrow: { width: 130 },
  // The busy overlay only covers the form visually — every field underneath
  // stayed tabbable and editable, and those keystrokes were thrown away when
  // the save landed. A disabled fieldset takes all of them out of the tab order
  // natively; these resets keep it invisible to the layout.
  fieldset: {
    border: 0,
    padding: 0,
    margin: 0,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
  },
  spinnerWrap: {
    position: 'absolute',
    inset: 0,
    background: 'rgba(255,255,255,.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 4,
  },
});

/**
 * One product inside the menu editor: reads like the customer's card when
 * closed, turns into a full-width inline form when opened. Nothing here
 * navigates away — every action reports back to MenuEditor, which owns the
 * catalogue state and does the actual API calls.
 */
export const AdminProductCard = ({
  product,
  menuType,
  categories,
  prices,
  sizeRowsFor,
  priceUsage,
  isEditing,
  busy,
  seedDraft,
  onEdit,
  onCancel,
  onSave,
  onDirtyChange,
  onDuplicate,
  onRemoveFromMenu,
  onDeleteForever,
}) => {
  const classes = useStyles();
  const isNew = !product;
  const [draft, setDraft] = useState(null);
  const [initialDraft, setInitialDraft] = useState(null);
  const [errors, setErrors] = useState([]);
  const cardRef = useRef(null);
  const headingRef = useRef(null);
  const editBtnRef = useRef(null);
  const errorRef = useRef(null);
  const wasEditing = useRef(false);

  // Entering edit mode seeds the draft from the product as it stands now.
  // Keyed off `isEditing` rather than an effect so the form never renders a
  // frame with stale values.
  const [editKey, setEditKey] = useState(null);
  // The seed id is part of the key so duplicating a second product while the
  // first duplicate form is still open re-seeds it instead of keeping stale
  // values (both render under the id 'new').
  const currentKey = isEditing
    ? `${product?.id ?? 'new'}:${seedDraft?.seedId ?? ''}`
    : null;
  if (isEditing && editKey !== currentKey) {
    const seeded = seedDraft?.draft || buildDraft(product, menuType, sizeRowsFor);
    setEditKey(currentKey);
    setDraft(seeded);
    setInitialDraft(seeded);
    setErrors([]);
  }
  if (!isEditing && editKey !== null) {
    setEditKey(null);
  }

  // A pending list has no id yet, so it stands in for the selected Price and
  // drives the row labels and the preview exactly as a saved one would.
  // A duplicate carries the dialog's answers, so it is worth protecting from
  // the moment it opens; the other forms only once something actually changed.
  const isDirty =
    isEditing &&
    !!draft &&
    (!!seedDraft || JSON.stringify(draft) !== JSON.stringify(initialDraft));

  useEffect(() => {
    // Only the open card may report: the flag it writes is shared by the whole
    // grid, and a closed card has nothing to say about unsaved work.
    if (isEditing && onDirtyChange) onDirtyChange(isDirty);
  }, [isEditing, isDirty, onDirtyChange]);

  // Opening the form used to leave focus on the body, and a duplicate opens at
  // the top of the grid — often off-screen. Scroll it into view and put focus
  // on its heading: that announces which product is being edited without
  // skipping past any field. On close, focus goes back to the button that
  // opened it.
  useEffect(() => {
    if (isEditing && !wasEditing.current) {
      wasEditing.current = true;
      const node = headingRef.current;
      if (node) {
        node.scrollIntoView({ block: 'nearest' });
        node.focus({ preventScroll: true });
      }
    } else if (!isEditing && wasEditing.current) {
      wasEditing.current = false;
      const active = document.activeElement;
      // When one card closes because another opened, the other card has already
      // taken focus — pulling it back would undo that. Only restore when focus
      // was left inside this card or nowhere in particular.
      const ours = cardRef.current?.contains(active);
      if (active && active !== document.body && !ours) return;
      // The edit button is disabled while the save that closed the form is
      // still in flight, and focusing a disabled button is a no-op.
      requestAnimationFrame(() => {
        const btn = editBtnRef.current;
        if (btn && !btn.disabled) btn.focus();
      });
    }
  }, [isEditing]);

  const selectedPrice = useMemo(() => {
    if (draft?.pendingPrice) return draft.pendingPrice;
    return (
      (prices || []).find((p) => String(p.id) === String(draft?.priceId)) || null
    );
  }, [prices, draft]);

  // What the customer would see once this draft is saved — computed with the
  // very same helper the menu grid uses, so the preview cannot drift from it.
  const previewInfo = useMemo(() => {
    if (!draft) return null;
    return priceInfo({
      categoryId: draft.categoryId,
      Price: selectedPrice
        ? {
            priceType: selectedPrice.priceType,
            SizePrices: draft.sizePrices
              .filter((r) => r.size !== '' && r.amount !== '')
              .map((r) => ({ size: Number(r.size), amount: Number(r.amount) })),
          }
        : null,
    });
  }, [draft, selectedPrice]);

  const set = (patch) => setDraft((d) => ({ ...d, ...patch }));

  const changePriceList = (priceId) => {
    // The rows belong to the price list, so switching lists swaps the rows for
    // that list's own — editing them would otherwise silently rewrite the
    // previous list's prices.
    setDraft((d) => ({
      ...d,
      priceId,
      pendingPrice: null,
      sizePrices: sizeRowsFor(priceId),
    }));
  };

  const setRow = (key, patch) =>
    setDraft((d) => ({
      ...d,
      sizePrices: d.sizePrices.map((r) =>
        r.key === key ? { ...r, ...patch } : r
      ),
    }));

  const addRow = () =>
    setDraft((d) => ({
      ...d,
      sizePrices: [...d.sizePrices, { key: nextRowKey(), size: '', amount: '' }],
    }));

  const removeRow = (key) =>
    setDraft((d) => ({
      ...d,
      sizePrices: d.sizePrices.filter((r) => r.key !== key),
    }));

  const validate = () => {
    const errs = [];
    // Built from the same helpers that label the inputs, so an error always
    // names the field the admin is looking at ("גודל (גרם)", not "כמות").
    const unitNow = measureUnitFor({ categoryId: draft.categoryId });
    const sizeLabel = sizeLabelFor(selectedPrice?.priceType, unitNow);
    const amountLabel = amountLabelFor(selectedPrice?.priceType);
    if (!draft.displayName.trim()) errs.push('חובה להזין שם מוצר.');
    if (draft.categoryId === '' || draft.categoryId === null)
      errs.push('חובה לבחור קטגוריה.');
    draft.sizePrices.forEach((r, i) => {
      const hasSize = String(r.size).trim() !== '';
      const hasAmount = String(r.amount).trim() !== '';
      if (!hasSize && !hasAmount) return;
      if (!hasSize || !hasAmount)
        errs.push(
          `שורת מחיר ${i + 1}: חובה למלא גם "${sizeLabel}" וגם "${amountLabel}".`
        );
      else if (!(Number(r.size) > 0) || !(Number(r.amount) > 0))
        errs.push(
          `שורת מחיר ${i + 1}: "${sizeLabel}" ו"${amountLabel}" חייבים להיות מספרים חיוביים.`
        );
      // `size` is an INTEGER column; a decimal is silently truncated by the DB,
      // which would quietly reprice the product.
      else if (!Number.isInteger(Number(r.size)))
        errs.push(`שורת מחיר ${i + 1}: "${sizeLabel}" חייב להיות מספר שלם.`);
    });
    return errs;
  };

  const handleSave = () => {
    const errs = validate();
    setErrors(errs);
    if (errs.length) {
      // Without this the rejection was silent for anyone not looking at the
      // bottom of the form. role="alert" announces it; the focus move makes it
      // reachable.
      requestAnimationFrame(() => errorRef.current?.focus());
      return;
    }
    onSave({
      ...draft,
      displayName: draft.displayName.trim(),
      description: draft.description.trim(),
      imgUrl: draft.imgUrl.trim(),
      sizePrices: draft.sizePrices.filter(
        (r) => String(r.size).trim() !== '' && String(r.amount).trim() !== ''
      ),
    });
  };

  // ---- closed card -------------------------------------------------------
  if (!isEditing) {
    const info = priceInfo(product);
    const grad = gradientFor(product.categoryId);
    return (
      <article className={classes.card} ref={cardRef}>
        {busy && (
          <div className={classes.spinnerWrap}>
            <CircularProgress size={30} />
          </div>
        )}
        <div className={classes.media} style={{ background: grad }}>
          {product.imgUrl ? (
            <ImageCloud
              imageId={product.imgUrl}
              maxWidth={400}
              maxHeight={300}
              alt={`תמונה של ${product.displayName}`}
            />
          ) : null}
          {product.inStock === false && (
            <span className={classes.outBadge}>אזל</span>
          )}
          {product.Category?.displayName && (
            <span className={classes.chip}>
              {product.Category.displayName}
            </span>
          )}
        </div>
        <div className={classes.body}>
          <h3 className={classes.name}>{product.displayName}</h3>
          <p className={classes.desc}>{product.description || ' '}</p>
          <div className={classes.serving}>{info.servingLabel || ' '}</div>
          <div className={classes.price}>{info.priceLabel}</div>
          <div className={classes.flags}>
            {MENU_TYPES.map((type) => (
              <span
                key={type}
                className={`${classes.flag} ${
                  product[menuFlagFor(type)] ? classes.flagOn : ''
                }`}
              >
                {MENU_LABEL[type]}
              </span>
            ))}
            {product.kitniyot ? (
              <span className={classes.flag}>קיטניות</span>
            ) : null}
          </div>
          <div className={classes.actions}>
            <button
              ref={editBtnRef}
              type="button"
              className={`${classes.btn} ${classes.btnPrimary}`}
              onClick={onEdit}
              disabled={busy}
            >
              ערוך
            </button>
            <Tooltip
              title={`פותח חלון שכפול: העותק ישויך רק לתפריט ${MENU_LABEL[menuType]}, אפשר לתת לו מחירון משלו, והמקור יוסר מתפריט זה בשמירה`}
            >
              <button
                type="button"
                className={classes.btn}
                onClick={onDuplicate}
                disabled={busy}
              >
                שכפל
              </button>
            </Tooltip>
            <Tooltip title={`מכבה את הסימון של תפריט ${MENU_LABEL[menuType]}`}>
              <button
                type="button"
                className={classes.btn}
                onClick={onRemoveFromMenu}
                disabled={busy}
              >
                הסר מהתפריט
              </button>
            </Tooltip>
            <button
              type="button"
              className={`${classes.btn} ${classes.btnDanger}`}
              onClick={onDeleteForever}
              disabled={busy}
            >
              מחק לצמיתות
            </button>
          </div>
        </div>
      </article>
    );
  }

  // ---- open card (form) --------------------------------------------------
  if (!draft) return null;
  const unit = measureUnitFor({ categoryId: draft.categoryId });
  const priceType = selectedPrice?.priceType;
  const noMenuSelected =
    !draft.isMenuWeekend && !draft.isMenuTishray && !draft.isMenuPesach;
  const onList = draft.priceId ? priceUsage[String(draft.priceId)] || 0 : 0;
  const alreadyCounted =
    !isNew && String(product.priceId) === String(draft.priceId) ? 1 : 0;
  const sharedCount = Math.max(onList - alreadyCounted, 0);
  const sharedWithOthers = sharedCount > 0;

  return (
    <article className={`${classes.card} ${classes.cardEditing}`}>
      {busy && (
        <div className={classes.spinnerWrap}>
          <CircularProgress size={30} />
        </div>
      )}
      <div className={classes.form} aria-busy={busy || undefined}>
        <h3 className={classes.formHead} ref={headingRef} tabIndex={-1}>
          {isNew ? 'מוצר חדש' : `עריכת ${product.displayName}`}
        </h3>
        <fieldset className={classes.fieldset} disabled={busy}>

        <div className={classes.row}>
          <TextField
            label="שם המוצר"
            variant="outlined"
            size="small"
            value={draft.displayName}
            onChange={(e) => set({ displayName: e.target.value })}
            style={{ minWidth: 240 }}
            InputLabelProps={{ shrink: true }}
          />
          <Controls.Select
            label="קטגוריה"
            name="categoryId"
            value={draft.categoryId}
            options={categories || []}
            onChange={(e) => set({ categoryId: e.target.value })}
          />
          <TextField
            label="שם התמונה בענן"
            variant="outlined"
            size="small"
            value={draft.imgUrl}
            onChange={(e) => set({ imgUrl: e.target.value })}
            style={{ minWidth: 220 }}
            InputLabelProps={{ shrink: true }}
            helperText="ה-public_id של Cloudinary"
          />
        </div>

        <TextField
          label="תיאור"
          variant="outlined"
          size="small"
          multiline
          minRows={2}
          value={draft.description}
          onChange={(e) => set({ description: e.target.value })}
          fullWidth
          InputLabelProps={{ shrink: true }}
        />

        <div className={classes.row}>
          <FormControlLabel
            control={
              <Checkbox
                checked={draft.inStock}
                onChange={(e) => set({ inStock: e.target.checked })}
              />
            }
            label="במלאי"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={draft.kitniyot}
                onChange={(e) => set({ kitniyot: e.target.checked })}
              />
            }
            label="מכיל קיטניות"
          />
          {MENU_TYPES.map((type) => (
            <FormControlLabel
              key={type}
              control={
                <Checkbox
                  checked={draft[menuFlagFor(type)]}
                  onChange={(e) =>
                    set({ [menuFlagFor(type)]: e.target.checked })
                  }
                />
              }
              label={`תפריט ${MENU_LABEL[type]}`}
            />
          ))}
        </div>

        <div className={classes.section}>
          <div className={classes.sectionTitle}>מחירון</div>
          <div className={classes.row}>
            {draft.pendingPrice ? (
              <div>
                <div className={classes.sectionTitle} style={{ marginBottom: 4 }}>
                  {draft.pendingPrice.displayName}
                </div>
                <div className={classes.hint}>
                  מחירון חדש — ייווצר בשמירה, ולא ישפיע על אף מוצר אחר.
                </div>
                <button
                  type="button"
                  className={classes.btn}
                  style={{ marginTop: 8 }}
                  onClick={() => changePriceList('')}
                >
                  בחר מחירון קיים במקום
                </button>
              </div>
            ) : (
              <Controls.Select
                label="מחירון"
                name="priceId"
                value={draft.priceId}
                options={prices || []}
                onChange={(e) => changePriceList(e.target.value)}
              />
            )}
            <div>
              <div className={classes.preview}>כפי שיוצג ללקוח:</div>
              <div className={classes.previewPrice}>
                {previewInfo?.priceLabel}
              </div>
              <div className={classes.serving}>
                {previewInfo?.servingLabel || ' '}
              </div>
            </div>
          </div>

          {selectedPrice ? (
            <div style={{ marginTop: 12 }}>
              {sharedWithOthers && !draft.pendingPrice && (
                <div className={classes.warn} style={{ marginBottom: 8 }}>
                  שים לב: המחירון הזה משמש עוד {productCount(sharedCount)}. כל
                  שינוי בסכומים כאן ישנה את המחיר גם שם.
                </div>
              )}
              {draft.sizePrices.map((row, i) => (
                <div className={classes.spRow} key={row.key}>
                  <TextField
                    className={classes.narrow}
                    label={sizeLabelFor(priceType, unit)}
                    variant="outlined"
                    size="small"
                    type="number"
                    value={row.size}
                    onChange={(e) => setRow(row.key, { size: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    className={classes.narrow}
                    label={amountLabelFor(priceType)}
                    variant="outlined"
                    size="small"
                    type="number"
                    value={row.amount}
                    onChange={(e) => setRow(row.key, { amount: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                  />
                  <IconButton
                    aria-label={`מחק שורת מחיר ${i + 1}`}
                    onClick={() => removeRow(row.key)}
                    size="small"
                  >
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </div>
              ))}
              <button
                type="button"
                className={classes.btn}
                onClick={addRow}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}
              >
                <AddIcon fontSize="small" /> הוסף שורת מחיר
              </button>
              {priceType !== 'box' && draft.sizePrices.length > 1 && (
                <div className={classes.hint} style={{ marginTop: 8 }}>
                  בתמחור לפי {priceType === 'unit' ? 'יחידה' : 'משקל'} נעשה
                  שימוש בשורה הראשונה בלבד.
                </div>
              )}
            </div>
          ) : (
            <div className={classes.hint} style={{ marginTop: 8 }}>
              בלי מחירון המוצר יוצג ללקוח כ״לפרטים בטלפון״.
            </div>
          )}
        </div>

        {noMenuSelected && (
          <div className={classes.hint}>
            שים לב: המוצר לא משויך לאף תפריט ולכן לא יוצג ללקוחות. השמירה תתבצע
            בכל זאת.
          </div>
        )}

        {errors.length > 0 && (
          <div role="alert" ref={errorRef} tabIndex={-1}>
            {errors.map((e) => (
              <div key={e} className={classes.err}>
                {e}
              </div>
            ))}
          </div>
        )}

        <div className={classes.row}>
          <button
            type="button"
            className={`${classes.btn} ${classes.btnPrimary}`}
            onClick={handleSave}
            disabled={busy}
          >
            {isNew ? 'צור מוצר' : 'שמור'}
          </button>
          <button
            type="button"
            className={classes.btn}
            onClick={onCancel}
            disabled={busy}
          >
            בטל
          </button>
        </div>
        </fieldset>
      </div>
    </article>
  );
};
